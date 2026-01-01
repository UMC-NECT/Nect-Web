import backButtonIcon from '../../assets/icons/signup/back-button.svg'

interface IBackButton {
	onClick?: () => void
}

const BackButton = ({ onClick }: IBackButton) => {
	return (
		<>
			<button
				type='button'
				onClick={onClick}
				className='max-w-11.5 p-3.25 border rounded-full border-neutral-200 bg-neutral-50 text-neutral-600 hover:cursor-pointer hover:bg-neutral-200 duration-300 ease-in-out'
			>
				<img src={backButtonIcon} alt='뒤로가기' />
			</button>
		</>
	)
}

export default BackButton
