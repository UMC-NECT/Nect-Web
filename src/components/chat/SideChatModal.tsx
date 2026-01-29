import { useState } from 'react'
import { ChatMessageItem } from './ChatMessageItem'
import SideChatRoom from './SideChatRoom'
import SideNewChatModal from './SideNewChatModal'
import SideSelectContactModal from './SideSelectContactModal'
import ChatMessageHeader from './ChatMessageHeader'
import ChatSidebar from './ChatSidebar'

type ModalView = 'list' | 'newChat' | 'selectContact' | 'room'

const SideChatModal = () => {
	const [view, setView] = useState<ModalView>('list')
	const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

	const messages = [
		{
			id: 1,
			senderName: '넥트 전체방',
			content: '그시간 다들 괜찮으신가요~~?',
			time: '19:45',
			isRead: false,
			participants: [
				'https://placehold.co/20x20',
				'https://placehold.co/20x20',
				'https://placehold.co/20x20',
				'https://placehold.co/20x20',
			],
			memberCount: 20,
			unreadCount: 990,
			isGroup: true,
		},
		{
			id: 2,
			senderName: '이방토',
			content: '넵 확인했습니다!',
			time: '00:00',
			isRead: false,
			profileImage: 'https://placehold.co/44x44',
			role: 'Design',
			unreadCount: 8,
			isGroup: false,
		},
		{
			id: 3,
			senderName: '숀',
			content: '수정해서 피그마에 올려두었습니당',
			time: '00:00',
			isRead: true,
			profileImage: 'https://placehold.co/44x44',
			role: 'Frontend',
			isGroup: false,
		},
		{
			id: 4,
			senderName: '디자인팀',
			content: '컴퍼넌트 수정사항 체크해주세요 ~',
			time: '12월 30일',
			isRead: false,
			participants: [
				'https://placehold.co/20x20',
				'https://placehold.co/20x20',
				'https://placehold.co/20x20',
			],
			memberCount: 3,
			unreadCount: 80,
			isGroup: true,
		},
		{
			id: 7,
			senderName: '넥트 팀방',
			content: '그시간 다들 괜찮으신가요~~?',
			time: '12월 30일',
			isRead: false,
			participants: [
				'https://placehold.co/20x20',
				'https://placehold.co/20x20',
			],
			memberCount: 3,
			unreadCount: 80,
			isGroup: true,
		},
		{
			id: 5,
			senderName: '세인트',
			content: '마지막으로 보낸 메세지',
			time: '1월 27일',
			isRead: true,
			profileImage: 'https://placehold.co/44x44',
			role: 'Part',
			isGroup: false,
		},
		{
			id: 6,
			senderName: '웬디',
			content: '마지막으로 보낸 메세지',
			time: '1월 27일',
			isRead: true,
			profileImage: 'https://placehold.co/44x44',
			role: 'Part',
			isGroup: false,
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
		<div className='flex items-start'>
			{/* 사이드바 */}
			<ChatSidebar
				unreadCount={messages.filter(m => !m.isRead).length}
				onMessageClick={() => setView('list')}
				onCloudClick={() => {}}
				onSettingsClick={() => {}}
			/>
			{/* 메인 채팅 모달 */}
			<div className='w-[380px] bg-neutral-50 rounded-2xl rounded-l-none border-l-0 border border-neutral-200 z-50 overflow-hidden shadow-drop-neutral-1 relative max-h-[calc(100vh-20px)] flex flex-col'>
				{/* 헤더 */}
				<ChatMessageHeader
					onBack={() => {}}
					onSearch={() => {}}
					onNewMessage={() => setView('newChat')}
				/>
				<div className='notification-scrollbar flex-1 overflow-y-auto'>
				{messages.map((message, index) => (
					<ChatMessageItem
						key={message.id}
						message={message}
						showDivider={index === 0}
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
		</div>
	)
}

export default SideChatModal

