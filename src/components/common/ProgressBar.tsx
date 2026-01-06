interface IProgressBar {
	currentStep?: number
	totalSteps?: number
}

const ProgressBar = ({ currentStep = 2, totalSteps = 8 }: IProgressBar) => {
	const steps = Array.from({ length: totalSteps })

	return (
		<div className='relative w-full max-w-188 h-1.5'>
			{/* 배경으로 깔아줄 8칸 */}
			<div className='flex w-full h-full gap-1.5 rounded-[20px] overflow-hidden'>
				{steps.map((_, index) => (
					<div
						key={index}
						className={`flex-1 transition-colors duration-300 bg-primary-100-light ${
							index === 0 ? 'rounded-l-[20px]' : ''
						} ${index === totalSteps - 1 ? 'rounded-r-[20px]' : ''}`}
					/>
				))}
			</div>

			{/* 진행 단계만큼 색찰 */}
			<div className='absolute top-0 left-0 w-full h-full flex'>
				{steps.map((_, index) => (
					<div
						key={index}
						className={`
                        h-1.5 flex-1 transition-colors duration-300
                        ${index < currentStep ? 'bg-primary-400-normal' : ''}
                        ${index === 0 ? 'rounded-l-[20px]' : ''}
                        ${index === currentStep - 1 ? 'rounded-r-[20px]' : ''}
                    `}
					></div>
				))}
			</div>
		</div>
	)
}

export default ProgressBar
