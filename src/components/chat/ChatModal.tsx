import { useState } from 'react'
import { ChatMessageItem } from './ChatMessageItem'
import ChatRoom from './ChatRoom'
import ChatMemberSelectModal from './ChatMemberSelectModal'
import ChatRoomInfoModal from './ChatRoomInfoModal'
import ChatHeader from './ChatHeader'
import ChatSidebar from './ChatSidebar'
import ChatCloudView from './ChatCloudView'

type ModalView = 'list' | 'roomInfo' | 'selectContact' | 'room' | 'cloud'

const ChatModal = () => {
	const [view, setView] = useState<ModalView>('list')
	const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
	const [selectedMessage, setSelectedMessage] = useState<typeof messages[0] | null>(null)

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

	if (view === 'room' && selectedRoom && selectedMessage) {
		return (
			<ChatRoom
				roomName={selectedRoom}
				memberCount={selectedMessage.memberCount}
				role={selectedMessage.role}
				unreadCount={messages.filter(m => !m.isRead).length}
				onClose={() => {
					setView('list')
					setSelectedMessage(null)
				}}
			/>
		)
	}

	if (view === 'selectContact') {
		return (
			<ChatMemberSelectModal
				onClose={() => setView('list')}
				onConfirm={(_selectedContacts) => {
					// 멤버 선택 완료 후 방 정보 설정으로 이동
					setView('roomInfo')
				}}
			/>
		)
	}

	if (view === 'roomInfo') {
		return (
			<ChatRoomInfoModal
				onClose={() => setView('list')}
				onConfirm={(roomName, selectedAvatar) => {
					console.log('방 정보:', { roomName, selectedAvatar })
					// TODO: 채팅방 생성 로직 구현
					setView('list')
				}}
			/>
		)
	}

	if (view === 'cloud') {
		return (
			<ChatCloudView
				onBack={() => setView('list')}
			/>
		)
	}

	return (
		<div className='flex items-start h-full'>
			{/* 사이드바 */}
			<ChatSidebar
				unreadCount={messages.filter(m => !m.isRead).length}
				onMessageClick={() => setView('list')}
				onCloudClick={() => setView('cloud')}
				onSettingsClick={() => {}}
			/>
			{/* 메인 채팅 모달 */}
			<div className='w-[380px] h-full bg-neutral-50 rounded-2xl rounded-l-none border-l-0 border border-neutral-200 z-50 overflow-hidden relative flex flex-col'>
				{/* 헤더 */}
				<ChatHeader
					type="list"
					onSearchClick={() => {}}
					onNewMessage={() => setView('selectContact')}
				/>
				<div className='notification-scrollbar flex-1 overflow-y-auto overflow-x-hidden'>
				{messages.map((message, index) => (
					<ChatMessageItem
						key={message.id}
						message={message}
						showDivider={index === 0}
						onClick={() => {
							setSelectedRoom(message.senderName)
							setSelectedMessage(message)
							setView('room')
						}}
					/>
				))}
			</div>
				
			</div>
		</div>
	)
}

export default ChatModal

