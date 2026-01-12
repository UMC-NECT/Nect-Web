import { cn } from '@/utils/cn'

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

			{/* 슬라이더 */}
			<div className='relative flex items-center justify-between flex-1 gap-18.5'>
				{/* 배경 가로선 */}
				<div className='absolute w-93 h-px bg-neutral-300 -z-10' />

				{steps.map(step => {
					const isSelected = currentValue === step
					return (
						<button
							key={step}
							type='button'
							onClick={() => onSelect(step)}
							className={cn(
								'relative rounded-full transition-all duration-300 flex items-center justify-center',
								// 선택 X
								!isSelected && 'w-4 h-4 bg-primary-150-light border-2 border-primary-300-light',
								// 선택 O
								isSelected && 'w-7 h-7 bg-transparent border-[3px] border-primary-400-normal'
							)}
						>
							{/* 선택했을때 안에 보라색 원 */}
							{isSelected && <div className='w-4.5 h-4.5 bg-primary-400-normal rounded-full' />}
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
