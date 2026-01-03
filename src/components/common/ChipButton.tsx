interface IChipButton {
	text: string
	isChecked?: boolean
	onClick?: () => void
}

const ChipButton = ({ text, isChecked = false, onClick }: IChipButton) => {
	return (
		<button
			type='button'
			className={`px-5 py-2.5 w-full max-w-73 title-3 border-2 rounded-10 hover:bg-primary-400-normal duration-200 ease-in-out
            ${
				isChecked
					? 'text-neutral-50 bg-primary-400-normal border-primary-400-normal '
					: 'text-neutral-700 bg-primary-50-light border-primary-300-light hover:text-neutral-50 hover:border-primary-400-normal '
			}`}
			onClick={onClick}
		>
			{text}
		</button>
	)
}

export default ChipButton
