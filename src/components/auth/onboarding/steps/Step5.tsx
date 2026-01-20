import ChipButton from '@/components/common/ChipButton'
import type { OnboardingFormType } from '@/utils/validate'
import { useFormContext } from 'react-hook-form'

const goals = ['포트폴리오 제작', '프로젝트 경험 및 팀 협업 능력 향상', '다른 분야의 프로젝트 경험', '기타']

const Step5 = () => {
	// 유효성 검사용
	const { setValue, watch } = useFormContext<OnboardingFormType>()

	// 폼 데이터 감시
	const selectedGoals = watch('goal') || []

	const handleSelectGoal = (goal: string) => {
		const isAlreadySelected = selectedGoals.includes(goal)

		if (isAlreadySelected) {
			// 이미 선택한 항목 해제는 허용
			const newFields = selectedGoals.filter(f => f !== goal)
			setValue('goal', newFields, { shouldValidate: true })
		} else {
			// 새로 추가
			setValue('goal', [...selectedGoals, goal], { shouldValidate: true })
		}
	}

	return (
		<div className='flex flex-col justify-center items-center mb-17'>
			{/* 타이틀 */}
			<div className='flex flex-col justify-center items-center gap-3 mb-17.5'>
				<div className='heading-3 text-neutral-900'>
					넥트를 통해 이루고 싶은 <span className='text-primary-500-normal'>첫번째 목표</span>를 알려주세요 !
				</div>
				<div className='title-2 text-neutral-500'>넥트가 함께 도와드릴게요</div>
			</div>

			{/* 컨텐츠 */}
			<div className='flex flex-col justify-center items-center w-98 gap-3'>
				{goals.map(goal => (
					<>
						<ChipButton
							key={goal}
							text={goal}
							isChecked={selectedGoals.includes(goal)}
							className='title-3 w-full'
							onClick={() => handleSelectGoal(goal)}
						/>
					</>
				))}
			</div>
		</div>
	)
}

export default Step5
