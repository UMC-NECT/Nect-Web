import { useState } from 'react'
import { ChatMessageItem } from './ChatMessageItem'
import SideChatRoom from './SideChatRoom'
import SideNewChatModal from './SideNewChatModal'
import SideSelectContactModal from './SideSelectContactModal'

type ModalView = 'list' | 'newChat' | 'selectContact' | 'room'

const SideChatModal = () => {
	const [view, setView] = useState<ModalView>('list')
	const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

	const messages = [
		{
			id: 1,
			senderName: '시루/강승희',
			content: '네! 풀타임으로 프로젝트 가능합니다~',
			time: '오후 3:23',
			isRead: false,
		},
		{
			id: 2,
			senderName: '시루/강승희',
			content: '~~~~ 대화내용 ~~~',
			time: '오후 3:23',
			isRead: true,
		},
	]

	if (view === 'room' && selectedRoom) {
		return <SideChatRoom roomName={selectedRoom} onClose={() => setView('list')} />
	}

	if (view === 'newChat') {
		return <SideNewChatModal onClose={() => setView('list')} onSelectContact={() => setView('selectContact')} />
	}

	if (view === 'selectContact') {
		return <SideSelectContactModal onClose={() => setView('newChat')} onConfirm={() => setView('list')} />
	}

	return (
		<div className='w-[360px] bg-white rounded-2xl border border-neutral-200 z-50 overflow-hidden shadow-drop-neutral-1 relative h-[500px]'>
			<div className='notification-scrollbar h-full overflow-y-auto pl-4'>
				{messages.map(message => (
					<ChatMessageItem
						key={message.id}
						message={message}
						onClick={() => {
							setSelectedRoom(message.senderName)
							setView('room')
						}}
					/>
				))}
			</div>
			{/* 새 메시지 버튼 */}
			<button
				onClick={() => setView('newChat')}
				className='absolute bottom-4 left-4 w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shadow-drop-neutral-3'
			>
				✏️
			</button>
		</div>
	)
}

export default SideChatModal

