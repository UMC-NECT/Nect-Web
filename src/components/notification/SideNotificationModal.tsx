import { useMemo } from 'react'
import { NotificationItem } from './NotificationItem'
import { type Notification } from '@/types/notification'
import { useNotificationList } from '@/hooks/notification/useNotificationList'
import type { NotificationDto } from '@/types/api/notification'
import { groupNotificationsByDate, flattenGroupedNotifications } from '@/utils/notificationUtils'

/**
 * API 응답의 NotificationDto를 UI용 Notification 타입으로 변환
 */
const convertNotificationDtoToNotification = (dto: NotificationDto): Notification => {
	// classification을 category로 사용, 없으면 기본값
	const category = dto.classification || '알림'
	
	// mainMessage를 title로 사용
	const title = dto.mainMessage
	
	// contentMessage를 description으로 사용
	const description = dto.contentMessage || ''

	return {
		id: dto.noticeId,
		category,
		title,
		description,
		time: dto.createdDate,
		isRead: dto.isRead,
	}
}

const SideNotificationModal = () => {
	// WORKSPACE_ONLY 필터로 알림 목록 조회 (사이드바 알림 모달용)
	const { data: notificationResponse, isLoading } = useNotificationList({
		filter: 'WORKSPACE_ONLY',
		size: 20,
	})

	const notifications: Notification[] = notificationResponse?.body?.notifications
		? notificationResponse.body.notifications.map(convertNotificationDtoToNotification)
		: []

	// 날짜별로 그룹화된 알림을 렌더링용 배열로 변환
	const flattenedNotifications = useMemo(() => {
		const grouped = groupNotificationsByDate(notifications)
		return flattenGroupedNotifications(grouped)
	}, [notifications])

	return (
		<div className='w-[380px] bg-white flex flex-col items-start justify-start pt-6 rounded-md shadow-drop-neutral-1 overflow-hidden z-50'>
			{/* 헤더 */}
			<div className='flex flex-col items-start px-[22px] py-0.5 relative shrink-0 w-full mb-[18px]'>
				<div className='flex items-center px-0.5 relative shrink-0 w-full'>
					<h2 className='title-2 font-semibold text-neutral-900'>최근 알림</h2>
				</div>
			</div>

			{/* 알림 리스트 - 스크롤 영역 */}
			<div className='flex flex-col gap-0 h-[556px] items-center relative shrink-0 w-full rounded-md overflow-y-auto notification-scroll'>
				{isLoading ? (
					<div className='flex items-center justify-center h-full text-neutral-500'>
						알림을 불러오는 중...
					</div>
				) : flattenedNotifications.length === 0 ? (
					<div className='flex items-center justify-center h-full text-neutral-500'>
						알림이 없습니다.
					</div>
				) : (
					<div className='flex flex-col items-start relative shrink-0 w-full'>
						{flattenedNotifications.map((item, index) => {
							if (item.type === 'divider') {
								return (
									<div key={`divider-${index}`} className='flex flex-col items-center justify-center relative shrink-0 w-full my-0'>
										<div className='relative w-full h-0'>
											<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[343px] h-px'>
												<div className='absolute inset-0 border-t border-neutral-200' />
											</div>
										</div>
										<div className='bg-white flex items-center px-2 py-1 relative -mt-3'>
											<span className='caption-1 text-neutral-400 font-medium'>{item.label}</span>
										</div>
									</div>
								)
							}
							return (
								<div key={item.notification.id} className='w-full'>
									<NotificationItem notification={item.notification} />
								</div>
							)
						})}
					</div>
				)}
			</div>

			{/* 하단 그라데이션 페이드 */}
			<div className='absolute bottom-0 left-0 right-0 h-[112px] pointer-events-none'>
				<div className='absolute inset-0 bg-linear-to-t from-white to-transparent' />
			</div>
		</div>
	)
}

export default SideNotificationModal
