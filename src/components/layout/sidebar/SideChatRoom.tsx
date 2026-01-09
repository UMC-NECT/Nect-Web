import { ChatRoomMessage } from '@/components/common/ChatRoomMessage'

interface SideChatRoomProps {
	roomName: string
	onClose: () => void
}

const SideChatRoom = ({ roomName, onClose }: SideChatRoomProps) => {
	const messages = [
		{ id: 1, senderName: '송지원', content: '메시지 내용', time: 'PM 10:31', isMine: false },
		{ id: 2, senderName: '김진호', content: '메시지 내용', time: 'PM 10:36', isMine: false },
		{ id: 3, senderName: '나', content: '메시지 내용', time: 'PM 10:40', isMine: true },
		{ id: 4, senderName: '나', content: '긴 메시지 내용 긴 메시지 내용 긴 메시지 내용', time: 'PM 10:41', isMine: true },
	]

	return (
		<div className='w-[360px] bg-white rounded-2xl border border-neutral-200 z-50 overflow-hidden shadow-drop-neutral-1 flex'>
			{/* 왼쪽 사이드바 */}
			<div className='w-12 bg-neutral-50 flex flex-col items-center py-4 gap-2'>
				<div className='w-8 h-8 rounded-full bg-neutral-200' />
				<div className='w-8 h-8 rounded-full bg-neutral-200' />
				<div className='w-8 h-8 rounded-full bg-neutral-200' />
				<div className='mt-auto w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center'>
					<span className='text-xs'>✏️</span>
				</div>
			</div>

			{/* 메인 채팅 영역 */}
			<div className='flex-1 flex flex-col h-[500px]'>
				{/* 헤더 */}
				<div className='h-12 border-b border-neutral-200 flex items-center justify-between px-3 shrink-0'>
					<div className='flex items-center gap-2'>
						<button onClick={onClose} className='text-sm'>
							←
						</button>
						<span className='text-sm'>{roomName}</span>
					</div>
					<div className='flex items-center gap-2'>
						<button className='text-sm'>🔍</button>
						<button className='text-sm'>☰</button>
					</div>
				</div>

				{/* 메시지 영역 */}
				<div className='flex-1 overflow-y-auto p-3 bg-neutral-50 min-h-0'>
					{messages.map(message => (
						<ChatRoomMessage
							key={message.id}
							senderName={message.senderName}
							content={message.content}
							time={message.time}
							isMine={message.isMine}
						/>
					))}
				</div>

				{/* 입력 필드 */}
				<div className='h-12 border-t border-neutral-200 flex items-center px-3 gap-2 shrink-0'>
					<input
						type='text'
						placeholder='메시지 입력'
						className='flex-1 h-8 px-2 rounded-lg border border-neutral-200 text-sm'
					/>
					<button className='w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs'>🎤</button>
					<button className='w-8 h-8 rounded-full bg-primary-500-normal flex items-center justify-center text-xs'>
						✈️
					</button>
				</div>
			</div>
		</div>
	)
}

export default SideChatRoom
