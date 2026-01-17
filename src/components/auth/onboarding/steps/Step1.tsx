import Dropdown from '@/components/common/Dropdown'
import Input from '@/components/common/Input'
import type { OnboardingFormType } from '@/utils/validate'
import { useFormContext } from 'react-hook-form'

const jobs = ['직장인', '대학생', '취업 준비생', '프리랜서', '사업가', '기타']

interface IStep1 {
	isNicknameChecked: boolean
	setIsNicknameChecked: (isNicknameChecked: boolean) => void
}

const Step1 = ({ isNicknameChecked = false, setIsNicknameChecked }: IStep1) => {
	const {
		register,
		setValue,
		watch,
		getFieldState,
		formState: { errors },
	} = useFormContext<OnboardingFormType>()

	// 직업 필드 감시
	const selectedJob = watch('job') || ''

	// 생일 유효성 검사
	const { invalid: isBirthInvalid, isDirty: isBirthDirty } = getFieldState('birth')
	const isBirthValid = !isBirthInvalid && isBirthDirty

	// 직업 선택 핸들러
	const handleSelectJob = (option: string) => {
		setValue('job', option, { shouldValidate: true })
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
						})}
					/>
					{/* 생년월일 (zod) */}
					<Input
						category='onboarding'
						type='text'
						placeholder='생년월일 8자리'
						maxLength={8}
						success={isBirthValid ? '8자리' : ''}
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
					<Dropdown options={jobs} placeholder='직업' value={selectedJob} onSelect={handleSelectJob} />
				</div>
			</div>
		</div>
	)
}

export default Step1
