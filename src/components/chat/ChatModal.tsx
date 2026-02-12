import { useState } from 'react'
import { ChatMessageItem } from './ChatMessageItem'
import ChatRoom from './ChatRoom'
import ChatMemberSelectModal from './ChatMemberSelectModal'
import ChatRoomInfoModal from './ChatRoomInfoModal'
import ChatHeader from './ChatHeader'
import ChatSidebar from './ChatSidebar'
import ChatCloudView from './ChatCloudView'
import { getChatRooms, createGroupChatRoom } from '@/api/chat'
import type { ChatRoomListDto } from '@/types/api/chat'
import { useQuery } from '@tanstack/react-query'

type ModalView = 'list' | 'roomInfo' | 'selectContact' | 'room' | 'cloud'

interface ChatModalProps {
	projectId?: number
}

	const ChatModal = ({ projectId = 1 }: ChatModalProps) => {
	const [view, setView] = useState<ModalView>('list')
	const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
	const [selectedRoom, setSelectedRoom] = useState<ChatRoomListDto | null>(null)
	const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([])
	const [selectedMembers, setSelectedMembers] = useState<Array<{ id: number; name: string; profileImage?: string }>>([])

	// 채팅방 목록 조회
	const { data: chatRoomsData, isLoading, refetch } = useQuery({
		queryKey: ['chatRooms', projectId],
		queryFn: () => getChatRooms(projectId),
		enabled: !!projectId,
	})

	const chatRooms = chatRoomsData?.body || []

	// 채팅방 목록을 메시지 아이템 형식으로 변환
	const messages = chatRooms.map((room) => {
		const roomId = (room as any).room_id || room.roomId
		const roomName = (room as any).room_name || room.roomName
		const lastMessage = (room as any).last_message || room.lastMessage
		const lastMessageTime = (room as any).last_message_time || room.lastMessageTime
		const unreadCount = (room as any).unread_count || room.unreadCount
		const memberCount = (room as any).member_count || (room as any).memberCount
		const profileImages = (room as any).profile_images || (room as any).profileImages || []
		
		return {
			id: roomId,
			senderName: roomName,
			content: lastMessage || '',
			time: lastMessageTime
				? new Date(lastMessageTime).toLocaleTimeString('ko-KR', {
						hour: '2-digit',
						minute: '2-digit',
					})
				: '',
			isRead: unreadCount === 0,
			memberCount: memberCount,
			participants: profileImages, // 프로필 이미지 배열
			unreadCount: unreadCount,
			isGroup: true,
			roomId: roomId,
			roomData: room,
		}
	})

	if (view === 'room' && selectedRoomId && selectedRoom) {
		const roomName = (selectedRoom as any).room_name || selectedRoom.roomName || ''
		const unreadCount = (selectedRoom as any).unread_count || selectedRoom.unreadCount || 0
		
		return (
			<ChatRoom
				roomId={selectedRoomId}
				roomName={roomName}
				unreadCount={unreadCount}
				projectId={projectId}
				onClose={() => {
					setView('list')
					setSelectedRoomId(null)
					setSelectedRoom(null)
					refetch() // 채팅방 목록 새로고침
				}}
			/>
		)
	}

	if (view === 'selectContact') {
		return (
			<ChatMemberSelectModal
				projectId={projectId}
				onClose={() => {
					setSelectedMemberIds([])
					setSelectedMembers([])
					setView('list')
				}}
			onConfirm={async (selectedContacts) => {
				// 선택한 멤버 ID 저장
				const memberIds = selectedContacts.map((c) => c.id)
				
				// 멤버가 1명이면 바로 채팅방 생성
				if (memberIds.length === 1) {
					try {
						// 1:1 채팅방은 상대방 이름을 방 이름으로 사용
						const memberName = selectedContacts[0]?.name || '채팅방'
						const response = await createGroupChatRoom({
							projectId,
							roomName: memberName,
							memberIds: memberIds,
						})
						if (response.body) {
							refetch()
							setSelectedMemberIds([])
							setView('list')
						}
					} catch (error) {
						console.error('채팅방 생성 실패:', error)
						alert('채팅방 생성에 실패했습니다.')
					}
				} else {
					// 멤버가 2명 이상이면 방 정보 설정으로 이동
					setSelectedMemberIds(memberIds)
					setSelectedMembers(selectedContacts.map(c => ({
						id: c.id,
						name: c.name,
						profileImage: c.profileImage,
					})))
					setView('roomInfo')
				}
			}}
			/>
		)
	}

	if (view === 'roomInfo') {
		return (
			<ChatRoomInfoModal
				selectedMembers={selectedMembers}
				onClose={() => {
					setSelectedMemberIds([])
					setSelectedMembers([])
					setView('list')
				}}
				onConfirm={async (roomName, selectedAvatar) => {
					// 현재는 선택한 아바타를 사용하지 않지만, 추후 확장을 위해 파라미터를 유지합니다.
					void selectedAvatar
					try {
						if (selectedMemberIds.length === 0) {
							alert('최소 1명 이상의 멤버를 선택해주세요.')
							return
						}

						const response = await createGroupChatRoom({
							projectId,
							roomName,
							memberIds: selectedMemberIds,
						})
						if (response.body) {
							// 채팅방 생성 성공 시 목록 새로고침
							refetch()
							setSelectedMemberIds([])
							setSelectedMembers([])
							setView('list')
						}
					} catch (error) {
						console.error('채팅방 생성 실패:', error)
						alert('채팅방 생성에 실패했습니다.')
					}
				}}
			/>
		)
	}

	if (view === 'cloud') {
		return (
			<ChatCloudView
				onBack={() => setView('list')}
				projectId={projectId}
			/>
		)
	}

	// view가 'cloud'가 아닌 경우이므로 항상 'message'
	const selectedView: 'message' | 'cloud' = 'message'

	return (
		<div className='flex items-start h-full'>
			{/* 사이드바 */}
			<ChatSidebar
				unreadCount={messages.filter(m => !m.isRead).length}
				selectedView={selectedView}
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
					{isLoading ? (
						<div className='flex justify-center items-center py-8'>
							<span className='text-neutral-500'>채팅방 목록을 불러오는 중...</span>
						</div>
					) : messages.length === 0 ? (
						<div className='flex justify-center items-center py-8'>
							<span className='text-neutral-500'>채팅방이 없습니다.</span>
						</div>
					) : (
						messages.map((message, index) => (
							<ChatMessageItem
								key={message.id}
								message={message}
								showDivider={index === 0}
								projectId={projectId}
								onClick={() => {
									if (message.roomId) {
										const roomData = message.roomData as any
										const roomId = roomData?.room_id || roomData?.roomId || message.roomId
										const roomName = roomData?.room_name || roomData?.roomName || message.senderName
										const unreadCount = roomData?.unread_count || roomData?.unreadCount || message.unreadCount || 0
										
										setSelectedRoomId(roomId)
										setSelectedRoom({
											roomId: roomId,
											roomName: roomName,
											lastMessage: message.content,
											lastMessageTime: message.time,
											unreadCount: unreadCount,
										})
										setView('room')
									}
								}}
							/>
						))
					)}
				</div>
				
			</div>
		</div>
	)
}

export default ChatModal

