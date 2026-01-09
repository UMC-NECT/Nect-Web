import { type ChatMessage } from '@/types/message'

interface ChatMessageItemProps {
	message: ChatMessage
	onClick?: () => void
}

export const ChatMessageItem = ({ message, onClick }: ChatMessageItemProps) => {
	return (
		<div
			className='mb-2 px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-neutral-50'
			onClick={onClick}
		>
			{/* 프로필 이미지 */}
			<div className='w-10 h-10 rounded-full bg-neutral-200 flex-shrink-0' />

			{/* 메시지 내용 */}
			<div className='flex-1 min-w-0'>
				{/* 발신자 이름과 타임스탬프 */}
				<div className='flex items-center justify-between mb-1'>
					<span className='text-sm font-medium text-neutral-900'>{message.senderName}</span>
					<div className='flex items-center gap-1.5'>
						<span className='text-xs text-neutral-400'>{message.time}</span>
						{!message.isRead && <div className='w-1.5 h-1.5 bg-semantic-600 rounded-full' />}
					</div>
				</div>

				{/* 메시지 내용 */}
				<p className='text-sm text-neutral-900'>{message.content}</p>
			</div>
		</div>
	)
}

