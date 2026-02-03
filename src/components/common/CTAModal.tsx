import Button from './Button'

interface CTAModalProps {
	message: string
	subMessage?: string
	isMessageHighlight?: boolean
	fixedHeight?: boolean
	// 단일 버튼 모드
	buttonMsg?: string
	onButtonClick?: () => void
	// 이중 버튼 모드
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
	buttonMsg,
	onButtonClick,
	leftButtonMsg,
	rightButtonMsg,
	onLeftClick,
	onRightClick,
}: CTAModalProps) => {
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

	// 단일 버튼 모드인지 확인
	const isSingleButtonMode = !!buttonMsg && !leftButtonMsg && !rightButtonMsg

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
			<div
				className={`bg-neutral-000 border border-neutral-200 flex flex-col items-center justify-center gap-[36px] py-14 w-120 rounded-12 shadow-[0px_6px_20px_0px_#e4e4e4] h-[286px]`}
			>
				{/* 타이틀 + 설명글 */}
				<div
					className={`flex flex-col items-center text-center whitespace-pre-line ${isSingleButtonMode ? 'gap-[18px] py-1' : ''} ${isMessageHighlight ? 'text-primary-500-normal' : 'text-neutral-900'} ${fixedHeight ? ' h-40.5' : ''}`}
				>
					<span className='leading-[160%] text-[20px] font-bold'>{parseMessage(message)}</span>

					<div className={`body-1 font-medium text-neutral-600 ${isSingleButtonMode ? '' : 'mt-4.5'} ${!subMessage ? 'min-h-[24px]' : ''}`}>
						{subMessage}
					</div>
				</div>

				{/* 버튼 영역 */}
				{isSingleButtonMode ? (
					/* 단일 버튼 모드 */
					<div className='flex items-center justify-center'>
						<Button color='mypage2' className='w-40 h-12' onClick={onButtonClick}>
							{buttonMsg}
						</Button>
					</div>
				) : (
					/* 이중 버튼 모드 */
					<div className='flex gap-3 px-7'>
						{leftButtonMsg && (
							<Button color='mypage1' className='min-w-40 w-fit' onClick={onLeftClick}>
								{leftButtonMsg}
							</Button>
						)}

						{rightButtonMsg && (
							<Button color='mypage2' size='modal' className='min-w-40 max-w-40' onClick={onRightClick}>
								{rightButtonMsg}
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default CTAModal
