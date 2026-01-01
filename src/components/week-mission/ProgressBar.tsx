interface ProgressBarProps {
	completed: number // 0-4 사이의 값
	total?: number // 기본값 4
}

const ProgressBar = ({ completed, total = 4 }: ProgressBarProps) => {
	const segments = Array.from({ length: total }, (_, index) => index < completed)

	return (
		<div className="flex gap-px items-center w-full max-w-[250px]">
			{segments.map((isCompleted, index) => (
				<div key={index} className="h-[2px] relative shrink-0 flex-1">
					<div
						className={`absolute inset-0 rounded-[20px] ${
							isCompleted ? 'bg-primary-400-normal' : 'bg-white'
						}`}
					/>
				</div>
			))}
		</div>
	)
}

export default ProgressBar

