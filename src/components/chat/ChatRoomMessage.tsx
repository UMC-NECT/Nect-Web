interface ChatRoomMessageProps {
	senderName: string
	content: string
	time: string
	isMine: boolean
}

export const ChatRoomMessage = ({ senderName, content, time, isMine }: ChatRoomMessageProps) => {
	return (
		<div className={`mb-2 flex ${isMine ? 'justify-end' : 'justify-start'}`}>
			<div className='max-w-[70%]'>
				{!isMine && <span className='text-xs text-neutral-600 mb-1 block'>{senderName}</span>}
				<div className={`px-3 py-2 rounded-lg ${isMine ? 'bg-primary-500-normal' : 'bg-neutral-200'}`}>
					<p className={`text-sm ${isMine ? 'text-white' : 'text-neutral-900'}`}>{content}</p>
				</div>
				<span className='text-xs text-neutral-400 mt-1 block'>{time}</span>
			</div>
		</div>
	)
}

