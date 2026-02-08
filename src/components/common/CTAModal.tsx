import Button from './Button'

interface ICTAModal {
	message: string
	subMessage?: string
	isMessageHighlight?: boolean
	fixedHeight?: boolean
	leftButtonMsg?: string
	rightButtonMsg?: string
	onLeftClick?: () => void
	onRightClick?: () => void
}

const CTAModal = ({
	message,
	subMessage = '',
	isMessageHighlight = false,
	fixedHeight = false,
	leftButtonMsg,
	rightButtonMsg,
	onLeftClick,
	onRightClick,
}: ICTAModal) => {
	// {텍스트} 형식 부분만 보라색으로 하이라이팅
	const parseMessage = (text: string) => {
		const parts = text.split(/(\{[^}]+\})/g)
		return parts.map((part, index) => {
			if (part.startsWith('{') && part.endsWith('}')) {
				const highlightText = part.slice(1, -1)
				return (
					<span key={index} className='text-primary-500-normal'>
						{highlightText}
					</span>
				)
			}
			return part
		})
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
			<div
				className={`bg-neutral-000 border border-neutral-200 flex flex-col items-center justify-center gap-11 py-14 w-120 rounded-12 ${fixedHeight ? 'h-71.5' : 'h-fit'}`}
			>
				{/* 타이틀 + 설명글 */}
				<div
					className={`text-center whitespace-pre-line ${isMessageHighlight ? 'text-primary-500-normal' : 'text-neutral-900'} ${fixedHeight ? ' h-40.5' : ''}`}
				>
					<span className='leading-[160%] text-[20px] font-bold'>{parseMessage(message)}</span>

					{subMessage ? <div className='mt-4.5 body-1 font-normal text-neutral-600'>{subMessage}</div> : ''}
				</div>

				{/* 선택용 버튼 2개 */}
				<div className='flex gap-3 px-7'>
					{leftButtonMsg && (
						<Button color='mypage1' size='modal' className='min-w-40 w-fit' onClick={onLeftClick}>
							{leftButtonMsg}
						</Button>
					)}

					{rightButtonMsg && (
						<Button color='mypage2' size='modal' className='min-w-40 max-w-40' onClick={onRightClick}>
							{rightButtonMsg}
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}

export default CTAModal
