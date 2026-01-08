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
		formState: { errors, isValid },
	} = useFormContext<OnboardingFormType>()

	const selectedJob = watch('job') || ''

	// 직업 선택 핸들러
	const handleSelectJob = (option: string) => {
		setValue('job', option, { shouldValidate: true })
	}

	return (
		<div>
			<div className=' heading-3 text-neutral-900 text-center mb-23'>나에 대해 알려주세요!</div>

			<div className='flex flex-col justify-center items-center gap-47.25'>
				<div className='flex flex-col gap-7.5'>
					{/* 닉네임 (zod + 중복검사 api)  */}
					<Input
						placeholder='닉네임'
						error={errors.nickname?.message}
						success={isNicknameChecked ? '사용 가능' : ''}
						{...register('nickname', { onChange: () => setIsNicknameChecked(false) })}
					/>
					{/* 생년월일 (zod) */}
					<Input
						placeholder='생년월일 8자리'
						success={isValid ? '8자리' : ''}
						error={errors.birth?.message}
						{...register('birth')}
					/>
					<Dropdown options={jobs} placeholder='직업' value={selectedJob} onSelect={handleSelectJob} />
				</div>
			</div>
		</div>
	)
}

export default Step1
