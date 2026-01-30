import { ChatRoomMessage } from './ChatRoomMessage'
import ChatRoomHeader from './ChatRoomHeader'
import ChatSidebar from './ChatSidebar'

interface SideChatRoomProps {
	roomName: string
	memberCount?: number
	role?: string
	onClose: () => void
}

const SideChatRoom = ({ roomName, memberCount, role, onClose }: SideChatRoomProps) => {
	const messages = [
		{ id: 1, senderName: '송지원', content: '메시지 내용', time: 'PM 10:31', isMine: false },
		{ id: 2, senderName: '김진호', content: '메시지 내용', time: 'PM 10:36', isMine: false },
		{ id: 3, senderName: '나', content: '메시지 내용', time: 'PM 10:40', isMine: true },
		{ id: 4, senderName: '나', content: '긴 메시지 내용 긴 메시지 내용 긴 메시지 내용', time: 'PM 10:41', isMine: true },
	]

	return (
		<div className='flex items-start h-full'>
			{/* 사이드바 */}
			<ChatSidebar
				unreadCount={0}
				onMessageClick={onClose}
				onCloudClick={() => {}}
				onSettingsClick={() => {}}
			/>
			{/* 메인 채팅 영역 */}
			<div className='w-[380px] h-full bg-white rounded-2xl rounded-l-none border-l-0 border border-neutral-200 z-50 overflow-hidden relative flex flex-col'>
				{/* 헤더 */}
				<ChatRoomHeader
					roomName={roomName}
					memberCount={memberCount}
					role={role}
					onBack={onClose}
					onSearch={() => {}}
					onMenu={() => {}}
				/>

				{/* 메시지 영역 */}
				<div className='flex-1 overflow-y-auto p-3 bg-neutral-50 min-h-0 notification-scrollbar'>
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
				<div className='h-12 border-t border-neutral-200 flex items-center px-3 gap-2 shrink-0 bg-white'>
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

