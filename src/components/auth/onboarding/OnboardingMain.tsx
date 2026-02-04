import BackButton from '@/components/common/BackButton'
import ProgressBar from '@/components/common/ProgressBar'
import Step1 from './steps/Step1'
import { useOnboardingForm } from '@/hooks/useForm'
import { useState } from 'react'
import Button from '@/components/common/Button'
import type { OnboardingFormType } from '@/utils/validate'
import { FormProvider, type Path } from 'react-hook-form'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
import Step6 from './steps/Step6'
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'
import { postCheck, postSetup } from '@/api/users'
import type { RequestSetupDto } from '@/types/api/users'
import { useNavigate } from 'react-router'

type STEPS = 1 | 2 | 3 | 4 | 5 | 6

// 단계별로 유효성 검사 항목
const STEP_FIELDS: Record<number, Path<OnboardingFormType>[]> = {
	1: ['nickname', 'birth', 'job'],
	2: ['role', 'fields'],
	3: ['skill'],
	4: ['interest'],
	5: ['goal'],
	6: [],
}

// 폼 데이터 -> RequestSetupDto (form에는 이미 API value 저장됨)
const toRequestSetupDto = (
	data: OnboardingFormType,
	skillCategories: { value: string }[],
	skillsByCategory: Record<string, { value: string }[]>
): RequestSetupDto => {
	const birthStr = data.birth || ''
	const birthDate = birthStr.length === 8 ? birthStr : ''

	const fields = (data.fields || []).map(f => {
		if (f.startsWith('직접입력:')) {
			const customValue = f.replace('직접입력:', '').trim() || null
			return { field: 'CUSTOM', customField: customValue }
		}
		return { field: f, customField: null }
	})

	const skills = (data.skill || []).map(skillValue => {
		let skillCategory = 'OTHER'
		for (const cat of skillCategories) {
			const list = skillsByCategory[cat.value] ?? []
			if (list.some(s => s.value === skillValue)) {
				skillCategory = cat.value
				break
			}
		}
		const isCustom = !skillCategories.some(cat => (skillsByCategory[cat.value] ?? []).some(s => s.value === skillValue))
		return {
			skillCategory,
			skill: skillValue,
			customSkillName: isCustom ? skillValue : null,
		}
	})

	return {
		nickname: data.nickname || '',
		birthDate,
		job: data.job || '',
		role: data.role || '',
		fields,
		skills,
		interests: data.interest || [],
		firstGoal: (data.goal || [])[0] || '',
		collaborationStyle: {
			planning: data.workStyle ?? 3,
			logic: data.communicationStyle ?? 3,
			leadership: data.teamworkStyle ?? 3,
		},
	}
}

const OnboardingMain = () => {
	const [currentStep, setCurrentStep] = useState<STEPS>(1)
	const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const navigate = useNavigate()
	const { skillCategories, skillsByCategory } = useOnboardingEnums()

	const methods = useOnboardingForm() // 온보딩 1~6단계용 커스텀 useForm

	// 값 감시 (버튼 비활성화용)
	const {
		watch,
		formState: { errors },
	} = methods

	const values = watch()

	// 버튼 비활성화 계산 함수
	const isNextDisabled = () => {
		const currentFields = STEP_FIELDS[currentStep] || []

		const isEmptyFieldExist = currentFields.some(field => {
			const value = values[field as keyof OnboardingFormType]
			if (Array.isArray(value)) {
				return value.length === 0
			}
			return !value || (typeof value === 'string' && value.trim() === '')
		})
		const hasError = currentFields.some(field => !!errors[field as keyof OnboardingFormType])
		// 1단계: 닉네임 중복 확인 완료 전에는 다음 비활성화
		const needNicknameCheck = currentStep === 1 && !isNicknameChecked

		return isEmptyFieldExist || hasError || needNicknameCheck
	}

	// 닉네임 중복 확인
	const handleCheckNickname = async () => {
		const nickname = methods.getValues('nickname')?.trim()
		if (!nickname) return false

		try {
			const response = await postCheck({
				type: 'NICKNAME',
				value: nickname,
			})

			if (response.body?.available === true) {
				setIsNicknameChecked(true)
				methods.clearErrors('nickname')
				return true
			}

			setIsNicknameChecked(false)
			methods.setError('nickname', { message: '중복된 닉네임 사용 불가' })
			return false
		} catch {
			methods.setError('nickname', { message: '중복 확인에 실패했습니다. 다시 시도해주세요.' })
			return false
		}
	}

	// 단계별 컴포넌트 렌더링 함수
	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<Step1
						setIsNicknameChecked={setIsNicknameChecked}
						isNicknameChecked={isNicknameChecked}
						onCheckNickname={handleCheckNickname}
					/>
				)
			case 2:
				return <Step2 />
			case 3:
				return <Step3 />
			case 4:
				return <Step4 />
			case 5:
				return <Step5 />
			case 6:
				return <Step6 />
			default:
				return <></>
		}
	}

	// 다음 버튼 핸들러
	const handleNext = async () => {
		// 현재 단계에서 유효성 검사할 필드들 가져옴
		const fieldsToValidate = STEP_FIELDS[currentStep]

		// zod 유효성 검증
		const isStepValid = await methods.trigger(fieldsToValidate)

		if (isStepValid) {
			// 1단계: 닉네임 중복검사 완료된 경우에만 다음 허용 (검사는 onBlur에서 수행)
			if (currentStep === 1 && !isNicknameChecked) return
			if (currentStep < 6) {
				setCurrentStep(prev => (prev + 1) as STEPS)
			} else {
				setIsSubmitting(true)
				try {
					const formData = methods.getValues()
					const body = toRequestSetupDto(formData, skillCategories, skillsByCategory)
					await postSetup(body)
					navigate('/')
				} catch {
					console.error('프로필 설정에 실패했습니다. 다시 시도해주세요.')
				} finally {
					setIsSubmitting(false)
				}
			}
		}
	}
	// 뒤로가기 버튼 핸들러
	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep(prev => (prev - 1) as STEPS)
		}
	}

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={e => e.preventDefault()}
				className='relative min-h-screen w-screen flex pt-24.75 left-1/2 -translate-x-1/2'
			>
				{/* 뒤로가기 */}
				<div className='hidden md:block absolute left-18 top-[50%]' onClick={handleBack}>
					<BackButton />
				</div>

				{/* 메인 영역 */}
				<div className='w-full flex flex-col items-center gap-18'>
					{/* 프로그레스바 */}
					<ProgressBar currentStep={currentStep} totalSteps={6} />

					{/* 컨텐츠 */}
					{renderStep()}
				</div>

				{/* 다음 버튼 */}
				<div className='absolute bottom-34 left-1/2 -translate-x-1/2'>
					<Button size='lg' onClick={handleNext} disabled={isNextDisabled() || isSubmitting}>
						{currentStep === 6 && isSubmitting ? '저장 중...' : '다음'}
					</Button>
				</div>
			</form>
		</FormProvider>
	)
}

export default OnboardingMain
