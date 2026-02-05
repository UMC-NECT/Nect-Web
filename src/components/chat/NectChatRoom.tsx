import { useState } from 'react'
import { ChatRoomMessage } from './ChatRoomMessage'
import ChatHeader from './ChatHeader'
import ChatMenu from './ChatMenu'
import ChatInput from './ChatInput'
import { ChatDateLine } from './ChatDateLine'
import { ChatReadLine } from './ChatReadLine'

interface NectChatRoomProps {
	roomName?: string
	memberCount?: number
	onClose?: () => void
}

const NectChatRoom = ({ roomName = 'Nect 전체', memberCount = 20, onClose }: NectChatRoomProps) => {
	const [isSearchMode, setIsSearchMode] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const messages = [
		{ id: 'date-1', type: 'date', date: '2026년 1월 27일 화요일' },
		{ id: 1, senderName: '나', content: '다들 모이셨나요? 바로 진행해볼까요?', time: '00:00', isMine: true, readCount: 20 },
		{ id: 2, senderName: '이방토', content: '네 좋습니다 !네 좋습니다 !네 좋습니다 !네 좋습니다 !', time: '00:00', isMine: false, role: 'Design', profileImage: 'https://placehold.co/30x30' },
		{ id: 3, senderName: '나', content: '미카엘님, 저번에 말씀하신 API 명세서 나왔나요?', time: '00:00', isMine: true, readCount: 20 },
		{ id: 4, senderName: '미카엘', content: '네, 방금 정리했습니다. 파일 올릴게요~', time: '00:00', isMine: false, role: 'Backend', profileImage: 'https://placehold.co/30x30', readCount: 20 },
		{ id: 5, senderName: '미카엘', fileAttachment: { fileName: 'API_명세서_초안.pdf', fileSize: '00.0MB', fileType: 'PDF' }, time: '00:00', isMine: false, role: 'Backend', profileImage: 'https://placehold.co/30x30' },
		{ id: 'read-line-1', type: 'read-line' },
		{ id: 6, senderName: '나', content: '확인했습니다. 고생하셨어요!', time: '00:00', isMine: true, readCount: 20 },
		{ id: 7, senderName: '나', content: '저희 전체적으로 진행 상황 음성 회의를 하려고 해요 ! 내일 오후 5시 다들 가능하시나요?', time: '00:00', isMine: true },
		{ id: 8, senderName: '숀', content: '네 가능합니다', time: '00:00', isMine: false, role: 'Frontend', profileImage: 'https://placehold.co/30x30' },
		{ id: 9, senderName: '세인트', content: '넵 알겠습니다 !', time: '00:00', isMine: false, role: 'Backend', profileImage: 'https://placehold.co/30x30' },
		{ id: 10, senderName: '미노', content: '네 알겠습니다 !!', time: '00:00', isMine: false, role: 'Frontend', profileImage: 'https://placehold.co/30x30' },
		{ id: 11, senderName: '패트', content: '넵 확인했습니다.', time: '00:00', isMine: false, role: 'Backend', profileImage: 'https://placehold.co/30x30' },
		{ id: 12, senderName: '매트', content: '넵 그때 뵙겠습니다', time: '00:00', isMine: false, role: 'Backend', profileImage: 'https://placehold.co/30x30' },
	]

	return (
		<div className='bg-primary-50-light rounded-6 shadow-drop-neutral-1 h-[670px] flex items-start justify-center overflow-hidden relative'>
			{/* 채팅 영역 */}
			<div className='flex flex-col h-[670px] items-start overflow-hidden relative rounded-br-12 rounded-tr-12 shrink-0 w-[380px]'>
				{/* 헤더 */}
				<ChatHeader
					type={isSearchMode ? 'search' : 'room'}
					roomName={roomName}
					memberCount={memberCount}
					onBack={onClose}
					onSearchClick={() => setIsSearchMode(true)}
					onMenu={() => setIsMenuOpen(true)}
					onClose={() => setIsSearchMode(false)}
					onSearch={(query) => {
						console.log('검색:', query)
					}}
				/>

				{/* 메뉴 모달 */}
				{isMenuOpen && (
					<ChatMenu
						type="room"
						onClose={() => setIsMenuOpen(false)}
						onTurnOffNotification={() => {
							console.log('알림 끄기')
							setIsMenuOpen(false)
						}}
						onInviteContact={() => {
							console.log('대화상대 추가')
							setIsMenuOpen(false)
						}}
						onLeaveRoom={() => {
							console.log('채팅방 나가기')
							setIsMenuOpen(false)
						}}
					/>
				)}

				{/* 메시지 영역 */}
				<div className='flex flex-col gap-[6px] h-[512px] items-center overflow-y-auto overflow-x-hidden pb-3 px-3 relative shrink-0 w-full notification-scroll'>
					{messages.map((message: any, index: number) => {
						if (message.type === 'date') {
							return <ChatDateLine key={message.id} date={message.date} className='pt-2.5' />
						}
						if (message.type === 'read-line') {
							return <ChatReadLine key={message.id} />
						}
						// 첫 번째 실제 메시지 아이템에 pt-[10px] 추가
						const isFirstMessage = index > 0 && messages[index - 1]?.type === 'date'
						return (
							<div key={message.id} className={isFirstMessage ? 'pt-2.5 w-full' : 'w-full'}>
								<ChatRoomMessage
									senderName={message.senderName}
									content={message.content}
									time={message.time}
									isMine={message.isMine}
									readCount={message.readCount}
									role={message.role}
									profileImage={message.profileImage}
									fileAttachment={message.fileAttachment}
								/>
							</div>
						)
					})}
				</div>

				{/* 입력 필드 */}
				<div className='border-t border-neutral-200 shrink-0 w-full'>
					<ChatInput
						onSend={(message) => {
							console.log('메시지 전송:', message)
						}}
						onAttach={() => {
							console.log('파일 첨부')
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default NectChatRoom
