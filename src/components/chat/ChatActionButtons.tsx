interface ChatActionButtonsProps {
	onCancel: () => void
	onConfirm: () => void
	cancelText?: string
	confirmText?: string
	isConfirmDisabled?: boolean
	containerClassName?: string
}

const ChatActionButtons = ({
	onCancel,
	onConfirm,
	cancelText = '취소',
	confirmText = '완료',
	isConfirmDisabled = false,
	containerClassName = '',
}: ChatActionButtonsProps) => {
	return (
		<div className={`bg-white px-[41px] flex gap-2 items-center shrink-0 ${containerClassName}`}>
			<button
				onClick={onCancel}
				className='w-[140px] h-9 px-2.5 flex items-center justify-center bg-neutral-50 border-[1.5px] border-neutral-200 rounded-md text-neutral-900 button-1 font-semibold leading-[1.4]'
			>
				{cancelText}
			</button>
			<button
				onClick={onConfirm}
				disabled={isConfirmDisabled}
				className={`w-[140px] h-9 px-2.5 flex items-center justify-center rounded-md button-1 font-semibold leading-[1.4] ${
					!isConfirmDisabled
						? 'bg-primary-400-normal text-neutral-50'
						: 'bg-primary-200-light text-neutral-50'
				}`}
			>
				{confirmText}
			</button>
		</div>
	)
}

export default ChatActionButtons
