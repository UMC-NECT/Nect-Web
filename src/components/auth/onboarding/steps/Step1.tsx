import Dropdown from '@/components/common/Dropdown'
import Input from '@/components/common/Input'
import type { OnboardingFormType } from '@/utils/validate'
import { useFormContext } from 'react-hook-form'
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'

interface IStep1 {
	isNicknameChecked: boolean
	setIsNicknameChecked: (isNicknameChecked: boolean) => void
	onCheckNickname?: () => void | Promise<unknown>
}

const Step1 = ({ isNicknameChecked = false, setIsNicknameChecked, onCheckNickname }: IStep1) => {
	const {
		register,
		setValue,
		watch,
		getValues,
		formState: { errors },
	} = useFormContext<OnboardingFormType>()
	const { jobs } = useOnboardingEnums()

	// 직업 필드 감시 (form에는 API value 저장)
	const selectedJobValue = watch('job') || ''
	const selectedJobLabel = jobs.find(j => j.value === selectedJobValue)?.label ?? ''

	// 직업 선택 핸들러 (옵션은 label로 표시, 선택 시 value 저장)
	const handleSelectJob = (label: string) => {
		const item = jobs.find(j => j.label === label)
		if (item) setValue('job', item.value, { shouldValidate: true })
	}

	return (
		<div>
			<div className='heading-3 text-neutral-900 text-center mb-23'>나에 대해 알려주세요!</div>

			<div className='flex flex-col justify-center items-center gap-47.25'>
				<div className='flex flex-col gap-9'>
					{/* 닉네임 (zod + 중복검사 api)  */}
					<Input
						category='onboarding'
						placeholder='닉네임'
						error={errors.nickname?.message}
						success={isNicknameChecked ? '사용 가능' : ''}
						{...register('nickname', {
							onChange: e => {
								setValue('nickname', e.target.value, { shouldValidate: true })
								setIsNicknameChecked(false)
							},
							onBlur: () => {
								if (getValues('nickname')?.trim()) onCheckNickname?.()
							},
						})}
					/>
					{/* 생년월일 (zod) */}
					<Input
						category='onboarding'
						type='text'
						placeholder='생년월일 8자리'
						maxLength={8}
						error={errors.birth?.message}
						onKeyDown={e => {
							const allowedKeys = ['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'Enter']

							if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
								e.preventDefault()
							}
						}}
						{...register('birth', {
							onChange: e => {
								const cleanedValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 8)
								setValue('birth', cleanedValue, { shouldValidate: true })
							},
						})}
					/>
					<Dropdown
						options={jobs.map(j => j.label)}
						placeholder='직업'
						value={selectedJobLabel}
						onSelect={handleSelectJob}
					/>
				</div>
			</div>
		</div>
	)
}

export default Step1
