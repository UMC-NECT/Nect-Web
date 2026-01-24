import { useFormContext } from 'react-hook-form'
import StepSlider from '../StepSlider'
import type { OnboardingFormType } from '@/utils/validate'

const Step6 = () => {
	// 유효성 검사용
	const { setValue, watch } = useFormContext<OnboardingFormType>()

	// 폼 데이터 감시 (optional이라 기본값을 중간값인 3으로 줌)
	const selectedWorkStyle = watch('workStyle') || 3
	const selectedCommunicationStyle = watch('communicationStyle') || 3
	const selectedTeamworkStyle = watch('teamworkStyle') || 3

	return (
		<>
			{/* 타이틀 */}
			<div className='heading-3 text-neutral-900'>
				<span className='text-primary-500-normal'>협업 스타일</span>을 알려주세요
			</div>

			{/* 콘텐츠 */}
			<div className='flex flex-col gap-14.5'>
				<StepSlider
					leftLabel='신중한 계획형'
					rightLabel='빠른 실행형'
					currentValue={selectedWorkStyle}
					onSelect={val => {
						setValue('workStyle', val, { shouldValidate: true })
					}}
				/>
				<StepSlider
					leftLabel='이성적인 논리형'
					rightLabel='따뜻한 공감형'
					currentValue={selectedCommunicationStyle}
					onSelect={val => {
						setValue('communicationStyle', val, { shouldValidate: true })
					}}
				/>
				<StepSlider
					leftLabel='주도적인 리더형'
					rightLabel='든든한 서포터형'
					currentValue={selectedTeamworkStyle}
					onSelect={val => {
						setValue('teamworkStyle', val, { shouldValidate: true })
					}}
				/>
			</div>
		</>
	)
}

export default Step6
