interface StepSliderProps {
	leftLabel: string
	rightLabel: string
	currentValue: number
	onSelect: (value: number) => void
}

const StepSlider = ({ leftLabel, rightLabel, currentValue = 3, onSelect }: StepSliderProps) => {
	const steps = [1, 2, 3, 4, 5]

	return (
		<div className='flex items-center justify-between w-full gap-10'>
			{/* 왼쪽 라벨 */}
			<span className='title-1 text-neutral-900 w-60 text-right'>{leftLabel}</span>

			{/* 슬라이더 - 버튼은 고정 크기, 선택 시 같은 자리에서 오버레이로 표시 */}
			<div className='relative flex items-center justify-between flex-1 gap-18.5'>
				{/* 배경 가로선: 버튼들과 같은 세로 중앙에 맞춤 */}
				<div className='absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-neutral-300 -z-10 mx-3' />

				{steps.map(step => {
					const isSelected = currentValue === step
					return (
						<button
							key={step}
							type='button'
							onClick={() => onSelect(step)}
							className='relative w-7 h-7 flex items-center justify-center rounded-full transition-transform duration-300 ease-out active:scale-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400-normal focus-visible:ring-offset-2'
						>
							{/* 비활성: 작은 원 (고정 컨테이너 안에서 중앙 정렬) */}
							{!isSelected && (
								<div className='w-4 h-4 rounded-full bg-primary-150-light border-2 border-primary-300-light' />
							)}
							{/* 활성: 둘 다 버튼 중앙 기준 absolute로 겹쳐서 동심 유지 */}
							{isSelected && (
								<>
									<div
										className='absolute top-1/2 left-1/2 w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-primary-400-normal'
										aria-hidden
									/>
									<div
										className='absolute top-1/2 left-1/2 w-4.5 h-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400-normal'
										aria-hidden
									/>
								</>
							)}
						</button>
					)
				})}
			</div>

			{/* 오른쪽 라벨 */}
			<span className='title-1 text-neutral-900 w-60 text-left'>{rightLabel}</span>
		</div>
	)
}

export default StepSlider
