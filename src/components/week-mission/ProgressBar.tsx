interface ProgressBarProps {
	/** 채워질 칸 수 (0~4). 진행률 비율(complete/whole)에 따라 4칸 기준으로 계산됨 */
	completed: number
	/** 전체 칸 수, 미션 막대는 항상 4 */
	total?: number
}

const ProgressBar = ({ completed, total = 4 }: ProgressBarProps) => {
	const segments = Array.from({ length: total }, (_, index) => index < completed)

	return (
		<div className='flex gap-px items-center w-full max-w-[250px]'>
			{segments.map((isCompleted, index) => (
				<div key={index} className='h-[2px] relative shrink-0 flex-1'>
					<div
						className={`absolute inset-0 rounded-[20px] ${isCompleted ? 'bg-primary-400-normal' : 'bg-neutral-200'}`}
					/>
				</div>
			))}
		</div>
	)
}

export default ProgressBar

