import { useState } from 'react'
import SegmentsBarLg from '@/components/common/SegmentsBarLg'
import { MessageItem } from './MessageItem'
import { type ChatMessage } from '@/types/message'

interface MessageDropdownProps {
	defaultTab?: 'matching' | 'team'
}

const MessageDropdown = ({ defaultTab = 'team' }: MessageDropdownProps) => {
	const [activeTab, setActiveTab] = useState<'matching' | 'team'>(defaultTab)
	const [selectedFilter, setSelectedFilter] = useState<'nect' | 'triple'>('nect')
	const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null)

	const messages: ChatMessage[] = [
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

				{/* 필터 버튼 */}
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
			</div>

			{/* 메시지 리스트 - 스크롤 영역 */}
			<div className='flex flex-col gap-[12px] items-start relative shrink-0 w-full overflow-y-auto notification-scroll flex-1'>
				{messages.map(message => (
					<MessageItem
						key={message.id}
						message={message}
						isSelected={selectedMessageId === message.id}
						onClick={() => setSelectedMessageId(message.id)}
					/>
				))}
			</div>

			{/* 하단 그라데이션 페이드 */}
			<div className='absolute bottom-0 left-0 right-0 h-[112px] pointer-events-none'>
				<div className='absolute inset-0 bg-linear-to-t from-white to-transparent' />
			</div>
		</div>
	)
}

export default MessageDropdown
