import { useState, useMemo } from 'react'
import SegmentsBarLg from '@/components/common/SegmentsBarLg'
import { MessageItem } from './MessageItem'
import { type ChatMessage } from '@/types/message'
import NectChatRoom from './NectChatRoom'
import { useQuery } from '@tanstack/react-query'
import { getDMRooms } from '@/api/chat'

interface MessageDropdownProps {
	defaultTab?: 'matching' | 'team'
}

const MessageDropdown = ({ defaultTab = 'team' }: MessageDropdownProps) => {
	const [activeTab, setActiveTab] = useState<'matching' | 'team'>(defaultTab)
	const [selectedFilter, setSelectedFilter] = useState<'nect' | 'triple'>('nect')
	const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null)
	const [showChatRoom, setShowChatRoom] = useState(false)
	const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null)

	// DM 채팅방 목록 조회 (매칭 요청 탭)
	const { data: dmRoomsData, isLoading: isLoadingDM } = useQuery({
		queryKey: ['dmRooms'],
		queryFn: () => getDMRooms({ size: 20 }),
		enabled: activeTab === 'matching',
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

	const teamMessages: ChatMessage[] = [
		{
			id: 1,
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
			id: 2,
			senderName: 'Nect 전체',
			content: '컴퍼넌트 수정사항 체크해주세요 ~',
			time: '00:00',
			isRead: false,
			participants: ['https://placehold.co/20x20', 'https://placehold.co/20x20'],
			memberCount: 14,
			unreadCount: 8,
			isGroup: true,
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
			senderName: '세인트',
			content: '마지막으로 보낸 메세지',
			time: '1월 27일',
			isRead: true,
			profileImage: 'https://placehold.co/44x44',
			role: 'Part',
			isGroup: false,
		},
		{
			id: 5,
			senderName: '웬디',
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

	// 채팅방이 열려있으면 채팅방만 표시
	if (showChatRoom && selectedMessage) {
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

				{/* 필터 버튼 - 팀 작업실 탭에서만 표시 */}
				{activeTab === 'team' && (
					<div className='flex gap-1 items-center relative shrink-0 w-[340px]'>
						<button
							onClick={() => setSelectedFilter('nect')}
							className={`px-[14px] py-1 body-1 font-medium rounded-100 transition-colors ${
								selectedFilter === 'nect'
									? 'bg-primary-150-light border-[1.5px] border-primary-200-light text-primary-500-normal'
									: 'bg-neutral-000 border border-neutral-200 text-neutral-900'
							}`}
						>
							넥트
						</button>
						<button
							onClick={() => setSelectedFilter('triple')}
							className={`px-[14px] py-1 body-1 font-medium rounded-100 transition-colors ${
								selectedFilter === 'triple'
									? 'bg-primary-150-light border-[1.5px] border-primary-200-light text-primary-500-normal'
									: 'bg-neutral-000 border border-neutral-200 text-neutral-900'
							}`}
						>
							트리플
						</button>
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
					teamMessages.map(message => (
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
