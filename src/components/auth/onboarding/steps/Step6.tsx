import { useFormContext } from 'react-hook-form'
import StepSlider from '../StepSlider'
import type { OnboardingFormType } from '@/utils/validate'

const Step6 = () => {
	// 유효성 검사용
	const { setValue, watch } = useFormContext<OnboardingFormType>()

	// 폼 데이터 감시 (optional이라 기본값을 중간값인 3으로 줌)
	const selectedWorkStyle = watch('workStyle') || 3
	const selectedCommunicationStyle = watch('communicationStyle') || 3

	return (
		<>
			{/* 타이틀 */}
			<div className='heading-3 text-neutral-900'>
				<span className='text-primary-500-normal'>협업 스타일</span>을 알려주세요
			</div>

			{/* 콘텐츠 */}
			<div className='flex flex-col gap-14.5'>
				<StepSlider
					leftLabel='빠른 실행형'
					rightLabel='신중한 계획형'
					currentValue={selectedWorkStyle}
					onSelect={val => {
						setValue('workStyle', val, { shouldValidate: true })
					}}
				/>
				<StepSlider
					leftLabel='자유로운 커뮤니케이션 선호'
					rightLabel='정제된 문서 선호'
					currentValue={selectedCommunicationStyle}
					onSelect={val => {
						setValue('communicationStyle', val, { shouldValidate: true })
					}}
				/>
			</div>
		</>
	)
}

export default Step6
