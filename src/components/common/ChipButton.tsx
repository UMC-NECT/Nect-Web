import { cn } from '@/utils/cn'

interface IChipButton {
	text: string
	isChecked?: boolean
	onClick?: () => void
	className?: string
}

const ChipButton = ({ text, isChecked = false, onClick, className }: IChipButton) => {
	return (
		<button
			type='button'
			className={cn(
				'title-3 px-5 py-2.5 w-73 border-2 rounded-12 hover:bg-primary-400-normal duration-200 ease-in-out',
				isChecked
					? 'text-neutral-50 font-semibold bg-primary-400-normal border-primary-400-normal'
					: 'text-neutral-700 bg-primary-50-light border-primary-300-light hover:text-neutral-50 hover:border-primary-400-normal',
				className
			)}
			onClick={onClick}
		>
			{text}
		</button>
	)
}

export default ChipButton
