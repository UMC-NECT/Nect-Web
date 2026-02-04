import { useState } from 'react'
import { NotificationItem } from './NotificationItem'
import { type Notification } from '@/types/notification'
import SegmentsBarLg from '@/components/common/SegmentsBarLg'

interface NotificationDropdownProps {
	defaultTab?: 'nect' | 'team'
}

const NotificationDropdown = ({ defaultTab = 'team' }: NotificationDropdownProps) => {
	const [activeTab, setActiveTab] = useState<'nect' | 'team'>(defaultTab)

	const notifications: Notification[] = [
		{
			id: 1,
			category: '넥트(NECT)',
			title: 'PM 시루님이 나를 @언급함',
			description: '"예원님 이거 수정사항 생겨서 여기에 정리해두었어요!"',
			time: '오늘 16:00',
			isRead: false,
		},
		{
			id: 2,
			category: '넥트(NECT)',
			title: '새로운 위크 미션이 등록되었습니다.',
			description: '"Misson 2 온보딩 페이지 만들기" (교체필요 큰 위크미션등록 X)',
			time: '어제 16:00',
			isRead: true,
		},
		{
			id: 3,
			category: '넥트(NECT)',
			title: '위크 미션에 Design 업무가 등록되었습니다.',
			description: '"Misson 2 온보딩 페이지 UI 구현"',
			time: '1월 26일',
			isRead: false,
		},
		{
			id: 4,
			category: '넥트(NECT)',
			title: '패',
			description: '',
			time: '1월 27일',
			isRead: true,
		},
		{
			id: 5,
			category: '넥트(NECT)',
			title: '매',
			description: '',
			time: '1월 1일',
			isRead: true,
		},
		{
			id: 6,
			category: '넥트(NECT)',
			title: '우',
			description: '',
			time: '2025.12.26',
			isRead: false,
		},
		{
			id: 7,
			category: '마이 매칭',
			title: '우디님과의 매칭이 자동 거절되었습니다.',
			description: '',
			time: '오늘 16:00',
			isRead: false,
		},
	]

	// 지난주 구분선 위치 (id 5 이후)
	const lastWeekDividerIndex = 4

	return (
		<div className='absolute top-full -right-[128px] mt-2 bg-white flex flex-col gap-4 items-start justify-start pt-6 rounded-6 shadow-drop-neutral-1 w-[380px] h-[682px] overflow-hidden z-50'>
			{/* 헤더 */}
			<div className='flex flex-col items-start px-[22px] py-0.5 relative shrink-0 w-full'>
				<div className='flex items-center px-0.5 relative shrink-0 w-full'>
					<h2 className='title-2 font-semibold text-neutral-900'>최근 알림</h2>
				</div>
			</div>

			{/* 세그먼트 바 */}
			<div className='flex items-center justify-center px-[22px] relative shrink-0 w-full'>
				<SegmentsBarLg
					segments={['NECT 탐색', '팀 작업실']}
					defaultValue={activeTab === 'nect' ? 'NECT 탐색' : '팀 작업실'}
					onChange={value => {
						setActiveTab(value === 'NECT 탐색' ? 'nect' : 'team')
					}}
				/>
			</div>

			{/* 알림 리스트 - 스크롤 영역 */}
			<div className='flex flex-col gap-0 h-[556px] items-center relative shrink-0 w-full overflow-y-auto notification-scroll'>
				<div className='flex flex-col items-start relative shrink-0 w-full'>
					{notifications.map((notification, index) => (
						<div key={notification.id} className='w-full'>
							<NotificationItem notification={notification} />
							{/* 지난주 구분선 */}
							{index === lastWeekDividerIndex && (
								<div className='flex flex-col items-center justify-center relative shrink-0 w-full my-0'>
									<div className='relative w-full h-0'>
										<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[343px] h-px'>
											<div className='absolute inset-0 border-t border-neutral-200' />
										</div>
									</div>
									<div className='bg-white flex items-center px-2 py-1 relative -mt-3'>
										<span className='caption-1 text-neutral-400'>지난주</span>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* 하단 그라데이션 페이드 */}
			<div className='absolute bottom-0 left-0 right-0 h-[112px] pointer-events-none'>
				<div className='absolute inset-0 bg-linear-to-t from-white to-transparent' />
			</div>
		</div>
	)
}

export default NotificationDropdown

