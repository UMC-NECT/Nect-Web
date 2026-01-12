import BackButton from '@/components/common/BackButton'
import ProgressBar from '@/components/common/ProgressBar'
import Step1 from './steps/Step1'
import { useOnboardingForm } from '@/hooks/useForm'
import { useState } from 'react'
import Button from '@/components/common/Button'
import type { OnboardingFormType } from '@/utils/validate'
import { FormProvider, type Path } from 'react-hook-form'
import Step2 from './steps/Step2'

type STEPS = 1 | 2 | 3 | 4 | 5 | 6

// 단계별로 유효성 검사 항목
const STEP_FIELDS: Record<number, Path<OnboardingFormType>[]> = {
	1: ['nickname', 'birth', 'job'],
	2: ['role', 'fields'],
}

const OnboardingMain = () => {
	const [currentStep, setCurrentStep] = useState<STEPS>(1)
	const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false)

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

		return isEmptyFieldExist || hasError
	}

	// 닉네임 중복 확인
	const handleCheckNickname = async () => {
		const nickname = methods.getValues('nickname')

		// 나중에 api나오면 고치기
		console.log('닉네임중복 테스트 콘솔', nickname)

		const isAvailable = true
		if (isAvailable) {
			setIsNicknameChecked(true)
			methods.clearErrors('nickname')
			return true
		} else {
			setIsNicknameChecked(false)
			methods.setError('nickname', { message: '중복된 닉네임 사용 불가' })
			return false
		}
	}

	// 단계별 컴포넌트 렌더링 함수
	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return <Step1 setIsNicknameChecked={setIsNicknameChecked} isNicknameChecked={isNicknameChecked} />
			case 2:
				return <Step2 />
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
			// 닉네임 중복검사 안했다면 제한
			if (currentStep === 1) {
				if (!isNicknameChecked) {
					const isApiPass = await handleCheckNickname()
					if (!isApiPass) return
				}
			}
			if (currentStep < 6) {
				setCurrentStep(prev => (prev + 1) as STEPS)
				console.log('현재 폼에 입력된 값들', methods.getValues())
			} else {
				console.log('최종 제출', methods.getValues())
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

					{/* 다음 버튼 */}
					<Button size='lg' onClick={handleNext} disabled={isNextDisabled()}>
						다음
					</Button>
				</div>
			</form>
		</FormProvider>
	)
}

export default OnboardingMain
