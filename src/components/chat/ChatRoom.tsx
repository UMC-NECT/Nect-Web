import { useState } from 'react'
import { ChatRoomMessage } from './ChatRoomMessage'
import ChatHeader from './ChatHeader'
import ChatMenu from './ChatMenu'
import ChatSidebar from './ChatSidebar'
import ChatInput from './ChatInput'
import { ChatDateLine } from './ChatDateLine'
import { ChatReadLine } from './ChatReadLine'
import ChatMemberSelectModal from './ChatMemberSelectModal'

interface ChatRoomProps {
	roomName: string
	memberCount?: number
	role?: string
	unreadCount?: number
	onClose: () => void
}

const ChatRoom = ({ roomName, memberCount, role, unreadCount = 0, onClose }: ChatRoomProps) => {
	const [isSearchMode, setIsSearchMode] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isSelectContactOpen, setIsSelectContactOpen] = useState(false)
	const messages = [
		{ id: 'date-1', type: 'date', date: '2026년 1월 27일 화요일' },
		{ id: 1, senderName: '나', content: '다들 모이셨나요?바로진행해볼까요?바로진행해볼까요?바로진행해볼까요?바로진행해볼까요?', time: '00:00', isMine: true, readCount: 20 },
		{ id: 2, senderName: '이방토', content: '네좋습니다!네좋습니다!네좋습니다!네좋습니다!네좋습니다!네좋습니다!네좋습니다!네좋습니다!', time: '00:00', isMine: false, role: 'Design', profileImage: 'https://placehold.co/30x30', readCount: 20 },
		{ id: 3, senderName: '나', content: '미카엘님, 저번에 말씀하신 API 명세서 나왔나요?', time: '00:00', isMine: true, readCount: 20 },
		{ id: 4, senderName: '미카엘', content: '네, 방금 정리했습니다. 파일 올릴게요~', time: '00:00', isMine: false, role: 'Backend', profileImage: 'https://placehold.co/30x30', readCount: 20 },
		{ id: 5, senderName: '미카엘', fileAttachment: { fileName: 'API_명세서_초안_초안_초안_초안_초안_초안_초안_초안_초안.pdf', fileSize: '00.0MB', fileType: 'PDF' }, time: '00:00', isMine: false, role: 'Backend', profileImage: 'https://placehold.co/30x30', readCount: 20 },
		{ id: 'read-line-1', type: 'read-line' },
		{ id: 6, senderName: '나', content: '확인했습니다. 고생하셨어요!', time: '00:00', isMine: true, readCount: 20 },
		{ id: 7, senderName: '나', content: '저희 전체적으로 진행 상황 음성 회의를 하려고 해요 ! 내일 오후 5시 다들 가능하시나요?', time: '00:00', isMine: true },
		{ id: 8, senderName: '숀', content: '네 가능합니다', time: '00:00', isMine: false, role: 'Frontend', profileImage: 'https://placehold.co/30x30' },
		{ id: 9, senderName: '세인트', content: '넵 알겠습니다 !', time: '00:00', isMine: false, role: 'Backend', profileImage: 'https://placehold.co/30x30' },
		{ id: 10, senderName: '나', fileAttachment: { fileName: '회의_자료_초안_초안_초안_초안_초안_초안_초안.pptx', fileSize: '2.5MB', fileType: 'PPT' }, time: '00:00', isMine: true, readCount: 20 },
	]

	// 대화상대 선택 모달이 열려있으면 모달만 표시
	if (isSelectContactOpen) {
		// 기존 멤버 ID 목록 (실제로는 채팅방 데이터에서 가져와야 함)
		// 예시: PM 역할의 첫 번째 멤버(id: 1)와 Design 역할의 첫 번째 멤버(id: 3)가 이미 채팅방에 있음
		const existingMemberIds = [1, 3] // 예시: 이미 채팅방에 있는 멤버 ID
		
		return (
			<ChatMemberSelectModal
				onClose={() => setIsSelectContactOpen(false)}
				onConfirm={(selectedContacts) => {
					console.log('선택된 대화상대:', selectedContacts)
					// TODO: 대화상대 초대 로직 구현
					setIsSelectContactOpen(false)
				}}
				existingMemberIds={existingMemberIds}
			/>
		)
	}

	return (
		<div className='flex items-start h-full'>
			{/* 사이드바 */}
			<ChatSidebar
				unreadCount={unreadCount}
				onMessageClick={onClose}
				onCloudClick={() => {}}
				onSettingsClick={() => {}}
			/>
			{/* 메인 채팅 영역 */}
			<div className='w-[380px] h-full bg-white rounded-2xl rounded-l-none border-l-0 border border-neutral-200 z-50 overflow-hidden relative flex flex-col'>
				{/* 헤더 */}
				<ChatHeader
					type={isSearchMode ? 'search' : 'room'}
					roomName={roomName}
					memberCount={memberCount}
					role={role}
					onBack={onClose}
					onSearchClick={() => setIsSearchMode(true)}
					onMenu={() => setIsMenuOpen(true)}
					onClose={() => setIsSearchMode(false)}
					onSearch={(query) => {
						console.log('검색:', query)
						// TODO: 검색 로직 구현
					}}
				/>

				{/* 메뉴 모달 */}
				{isMenuOpen && (
					<ChatMenu
						type="room"
						onClose={() => setIsMenuOpen(false)}
						onTurnOffNotification={() => {
							console.log('알림 끄기')
							// TODO: 알림 끄기 로직 구현
						}}
						onInviteContact={() => {
							setIsSelectContactOpen(true)
						}}
						onLeaveRoom={() => {
							console.log('채팅방 나가기')
							// TODO: 채팅방 나가기 로직 구현
						}}
					/>
				)}

				{/* 메시지 영역 */}
				<div className='flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 bg-neutral-50 min-h-0 notification-scrollbar'>
					{messages.map((message: any) => {
						if (message.type === 'date') {
							return <ChatDateLine key={message.id} date={message.date} />
						}
						if (message.type === 'read-line') {
							return <ChatReadLine key={message.id} />
						}
						return (
							<ChatRoomMessage
								key={message.id}
								senderName={message.senderName}
								content={message.content}
								time={message.time}
								isMine={message.isMine}
								readCount={message.readCount}
								role={message.role}
								profileImage={message.profileImage}
								fileAttachment={message.fileAttachment}
							/>
						)
					})}
				</div>

				{/* 입력 필드 */}
				<div className='border-t border-neutral-200 shrink-0'>
					<ChatInput
						onSend={(message) => {
							console.log('메시지 전송:', message)
							// TODO: 실제 메시지 전송 로직 구현
						}}
						onAttach={() => {
							console.log('파일 첨부')
							// TODO: 파일 첨부 로직 구현
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default ChatRoom

