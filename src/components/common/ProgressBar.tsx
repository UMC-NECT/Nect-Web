interface IProgressBar {
	currentStep?: number
	totalSteps?: number
}

const ProgressBar = ({ currentStep = 1, totalSteps = 6 }: IProgressBar) => {
	const steps = Array.from({ length: totalSteps })

	return (
		<div className='w-full max-w-188'>
			{/* 전체 8단계 프로그레스 바 */}
			<div className='flex w-full h-1.5 gap-1.5'>
				{steps.map((_, index) => (
					<div
						key={index}
						className={`
							flex-1 h-full rounded-[20px] transition-colors duration-300
							${index < currentStep ? 'bg-primary-400-normal' : 'bg-primary-100-light'}
						`}
					/>
				))}
			</div>
		</div>
	)
}

export default ProgressBar
