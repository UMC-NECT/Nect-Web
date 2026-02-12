import ChipButton from '@/components/common/ChipButton'
import type { OnboardingFormType } from '@/utils/validate'
import { useFormContext } from 'react-hook-form'
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'

const Step4 = () => {
	const { setValue, watch } = useFormContext<OnboardingFormType>()
	const { interestFields } = useOnboardingEnums()

	const selectedInterest = watch('interest') || []

	const handleSelectInterest = (value: string) => {
		if (selectedInterest.includes(value)) {
			setValue(
				'interest',
				selectedInterest.filter(f => f !== value),
				{ shouldValidate: true }
			)
		} else {
			setValue('interest', [...selectedInterest, value], { shouldValidate: true })
		}
	}

	return (
		<>
			<div className='mb-16'>
				{/* 타이틀 */}
				<div className='flex flex-col justify-center items-center gap-3 mb-19.25'>
					<div className='heading-3 text-neutral-900'>
						<span className='text-primary-500-normal'>관심 분야</span>를 골라주세요
					</div>
					<div className='title-2 text-neutral-500'>추후 프로필에서 변경 가능해요</div>
				</div>

				{/* 컨텐츠 */}
				<div className='w-126.5 grid grid-cols-2 gap-x-2.5 gap-y-3'>
					{interestFields.map(item => (
						<ChipButton
							key={item.value}
							text={item.label}
							isChecked={selectedInterest.includes(item.value)}
							onClick={() => handleSelectInterest(item.value)}
							className='body-1 px-5 py-2.5 w-full'
						/>
					))}
				</div>
			</div>
		</>
	)
}

export default Step4
