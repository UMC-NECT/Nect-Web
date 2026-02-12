import { cn } from '@/utils/cn'

type ColorType = 'filled' | 'outline'

interface IRoundChipButton {
	text: string
	color?: ColorType
	isChecked?: boolean
	onClick?: () => void
	className?: string
}

const RoundChipButton = ({ text, color = 'filled', isChecked = false, onClick, className }: IRoundChipButton) => {
	const base = 'body-1 rounded-100 border px-4 py-1.5 duration-200 ease-in-out'

	const getStyle = () => {
		if (color === 'outline') {
			return 'bg-white border-neutral-300 text-neutral-600'
		}

		return isChecked
			? 'bg-primary-100-light border-primary-200-light text-primary-500-normal font-semibold'
			: 'bg-neutral-100 border-[#EEEEEE] text-neutral-400 hover:bg-neutral-200'
	}

	return (
		<button type='button' className={cn(base, getStyle(), className)} onClick={onClick}>
			{text}
		</button>
	)
}

export default RoundChipButton
