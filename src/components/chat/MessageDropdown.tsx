import { useState, useMemo, useEffect } from 'react'
import SegmentsBarLg from '@/components/common/SegmentsBarLg'
import { MessageItem } from './MessageItem'
import { ChatMessageItem } from './ChatMessageItem'
import { type ChatMessage } from '@/types/message'
import NectChatRoom from './NectChatRoom'
import ChatRoom from './ChatRoom'
import { useQuery } from '@tanstack/react-query'
import { getDMRooms, getChatRooms } from '@/api/chat'
import useGetProjectUsers from '@/hooks/project-users/useGetProjectUsers'
import useFilteredWorkspaceItems from '@/hooks/project-users/useFilteredWorkspaceItems'
import type { ChatRoomListDto } from '@/types/api/chat'

interface MessageDropdownProps {
	defaultTab?: 'matching' | 'team'
}

const MessageDropdown = ({ defaultTab = 'team' }: MessageDropdownProps) => {
	const [activeTab, setActiveTab] = useState<'matching' | 'team'>(defaultTab)
	const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null)
	const [showChatRoom, setShowChatRoom] = useState(false)
	const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null)
	const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
	const [selectedRoom, setSelectedRoom] = useState<ChatRoomListDto | null>(null)
	
	// 프로젝트 목록 조회
	const projectData = useGetProjectUsers()
	
	// 필터링된 프로젝트 목록 (최대 2개)
	const filteredProjects = useFilteredWorkspaceItems(projectData, { maxCount: 2 })
	
	// 선택된 프로젝트 ID (첫 번째 프로젝트를 기본값으로)
	const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(
		filteredProjects[0]?.projectId
	)
	
	// 프로젝트 목록이 변경되면 첫 번째 프로젝트를 기본 선택
	useEffect(() => {
		if (filteredProjects.length > 0 && !selectedProjectId) {
			setSelectedProjectId(filteredProjects[0].projectId)
		}
	}, [filteredProjects, selectedProjectId])

	// DM 채팅방 목록 조회 (매칭 요청 탭)
	const { data: dmRoomsData, isLoading: isLoadingDM } = useQuery({
		queryKey: ['dmRooms'],
		queryFn: () => getDMRooms({ size: 20 }),
		enabled: activeTab === 'matching',
	})

	// 채팅방 목록 조회 (팀 작업실 탭)
	const { data: chatRoomsData, isLoading: isLoadingTeam } = useQuery({
		queryKey: ['chatRooms', selectedProjectId],
		queryFn: () => getChatRooms(selectedProjectId!),
		enabled: activeTab === 'team' && !!selectedProjectId,
	})

	// DM 채팅방 데이터를 ChatMessage 형식으로 변환
	const dmMessages: ChatMessage[] = useMemo(() => {
		if (!dmRoomsData?.body?.messages) return []
		
		return dmRoomsData.body.messages.map((dm) => ({
			id: dm.other_user_id,
			senderName: dm.other_user_name,
			content: dm.last_message || '',
			time: dm.last_message_at || '',
			isRead: dm.is_read,
			profileImage: dm.other_user_image_url || undefined,
			role: dm.other_user_role_field || undefined,
			isGroup: false,
		}))
	}, [dmRoomsData])

	// 채팅방 목록을 ChatMessage 형식으로 변환 (팀 작업실 탭)
	const teamMessages: ChatMessage[] = useMemo(() => {
		if (!chatRoomsData?.body) return []
		
		return chatRoomsData.body.map((room) => {
			const roomId = (room as any).room_id || room.roomId
			const roomName = (room as any).room_name || room.roomName
			const lastMessage = (room as any).last_message || room.lastMessage
			const lastMessageTime = (room as any).last_message_time || room.lastMessageTime
			const unreadCount = (room as any).unread_count || room.unreadCount
			
			return {
				id: roomId,
				senderName: roomName || '',
				content: lastMessage || '',
				time: lastMessageTime
					? new Date(lastMessageTime).toLocaleTimeString('ko-KR', {
							hour: '2-digit',
							minute: '2-digit',
						})
					: '',
				isRead: unreadCount === 0,
				memberCount: undefined,
				unreadCount: unreadCount || 0,
				isGroup: true,
				roomId: roomId,
				roomData: room,
			}
		})
	}, [chatRoomsData])

	// 팀 작업실 탭에서 채팅방이 열려있으면 ChatRoom 표시
	if (activeTab === 'team' && selectedRoomId && selectedRoom) {
		const roomName = (selectedRoom as any).room_name || selectedRoom.roomName || ''
		const unreadCount = (selectedRoom as any).unread_count || selectedRoom.unreadCount || 0
		
		return (
			<div className='absolute top-full -right-[74px] mt-2 z-50'>
				<ChatRoom
					roomId={selectedRoomId}
					roomName={roomName}
					unreadCount={unreadCount}
					projectId={selectedProjectId}
					hideSidebar={true}
					height="h-[656px]"
					onClose={() => {
						setSelectedRoomId(null)
						setSelectedRoom(null)
					}}
				/>
			</div>
		)
	}

	// 매칭 요청 탭에서 채팅방이 열려있으면 NectChatRoom 표시
	if (activeTab === 'matching' && showChatRoom && selectedMessage) {
		return (
			<div className='absolute top-full -right-[74px] mt-2 z-50'>
				<NectChatRoom
					roomName={selectedMessage.senderName}
					memberCount={selectedMessage.memberCount}
					onClose={() => {
						setShowChatRoom(false)
						setSelectedMessage(null)
					}}
				/>
			</div>
		)
	}

	return (
		<div className='absolute top-full -right-[74px] mt-2 bg-white flex flex-col items-start justify-start pt-6 rounded-6 shadow-drop-neutral-1 w-[380px] h-[656px] overflow-hidden z-50'>
			{/* 헤더 */}
			<div className='flex flex-col items-start py-0.5 relative shrink-0 w-[336px] px-[22px] mb-[18px]'>
				<div className='flex items-center px-0.5 relative shrink-0 w-full'>
					<h2 className='title-2 font-semibold text-neutral-900'>메세지함</h2>
				</div>
			</div>

			{/* 세그먼트 바 및 필터 버튼 */}
			<div className='flex flex-col gap-[12px] items-center relative shrink-0 w-full px-[22px] mb-[10px]'>
				{/* 세그먼트 바 */}
				<div className='flex items-center relative shrink-0 w-full'>
					<SegmentsBarLg
						segments={['매칭 요청', '팀 작업실']}
						defaultValue={activeTab === 'matching' ? '매칭 요청' : '팀 작업실'}
						onChange={value => {
							setActiveTab(value === '매칭 요청' ? 'matching' : 'team')
						}}
					/>
				</div>

				{/* 필터 버튼 - 팀 작업실 탭에서만 표시, 프로젝트가 있을 때만 표시 */}
				{activeTab === 'team' && filteredProjects.length > 0 && (
					<div className='flex gap-1 items-center relative shrink-0 w-[340px]'>
						{filteredProjects.map((project) => (
							<button
								key={project.projectId}
								onClick={() => setSelectedProjectId(project.projectId)}
								className={`px-[14px] py-1 body-1 font-medium rounded-100 transition-colors ${
									selectedProjectId === project.projectId
										? 'bg-primary-150-light border-[1.5px] border-primary-200-light text-primary-500-normal'
										: 'bg-neutral-000 border border-neutral-200 text-neutral-900'
								}`}
							>
								{project.name}
							</button>
						))}
					</div>
				)}
			</div>

			{/* 메시지 리스트 - 스크롤 영역 */}
			<div className='flex flex-col gap-[12px] items-start relative shrink-0 w-full overflow-y-auto notification-scroll flex-1'>
				{activeTab === 'matching' ? (
					isLoadingDM ? (
						<div className='flex items-center justify-center w-full py-8 text-neutral-500'>
							메시지를 불러오는 중...
						</div>
					) : dmMessages.length === 0 ? (
						<div className='flex items-center justify-center w-full py-8 text-neutral-500'>
							메시지가 없습니다.
						</div>
					) : (
						dmMessages.map(message => (
							<MessageItem
								key={message.id}
								message={message}
								isSelected={selectedMessageId === message.id}
								onClick={() => {
									setSelectedMessageId(message.id)
									setSelectedMessage(message)
									setShowChatRoom(true)
								}}
							/>
						))
					)
				) : (
					isLoadingTeam ? (
						<div className='flex items-center justify-center w-full py-8 text-neutral-500'>
							메시지를 불러오는 중...
						</div>
					) : teamMessages.length === 0 ? (
						<div className='flex items-center justify-center w-full py-8 text-neutral-500'>
							메시지가 없습니다.
						</div>
					) : (
						teamMessages.map((message, index) => {
							if (message.roomId) {
								const roomData = message.roomData as any
								const roomId = roomData?.room_id || roomData?.roomId || message.roomId
								const roomName = roomData?.room_name || roomData?.roomName || message.senderName
								const unreadCount = roomData?.unread_count || roomData?.unreadCount || message.unreadCount || 0
								
								return (
									<ChatMessageItem
										key={message.id}
										message={message}
										showDivider={index === 0}
										onClick={() => {
											setSelectedRoomId(roomId)
											setSelectedRoom({
												roomId: roomId,
												roomName: roomName,
												lastMessage: message.content,
												lastMessageTime: message.time,
												unreadCount: unreadCount,
											})
										}}
									/>
								)
							}
							return null
						})
					)
				)}
			</div>

			{/* 하단 그라데이션 페이드 */}
			<div className='absolute bottom-0 left-0 right-0 h-[112px] pointer-events-none'>
				<div className='absolute inset-0 bg-linear-to-t from-white to-transparent' />
			</div>
		</div>
	)
}

export default MessageDropdown
