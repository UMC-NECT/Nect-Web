import { NotificationItem } from './NotificationItem'
import { type Notification } from '@/types/notification'

const SideNotificationModal = () => {
	const notifications: Notification[] = [
		{
			id: 1,
			category: 'NECT 플랫폼',
			title: 'PM 시루님이 다음에서 나를 @언급함',
			description: '"예원님 이거 수정사항 생겨서 여기에 첨리해두었어요!"',
			time: '25.11.26',
			isRead: false,
		},
		{
			id: 2,
			category: 'NECT 플랫폼',
			title: '새로운 위크 미션이 등록되었습니다.',
			description: '"Misson 2 온보딩 페이지 만들기"',
			time: '25.11.24',
			isRead: true,
		},
		{
			id: 3,
			category: 'NECT 플랫폼',
			title: '새로운 위크 미션이 등록되었습니다.',
			description: '"Misson 2 온보딩 페이지 만들기"',
			time: '25.11.24',
			isRead: true,
		},
		{
			id: 4,
			category: 'NECT 플랫폼',
			title: '새로운 위크 미션이 등록되었습니다.',
			description: '"Misson 2 온보딩 페이지 만들기"',
			time: '25.11.24',
			isRead: true,
		},
		{
			id: 5,
			category: 'NECT 플랫폼',
			title: '새로운 위크 미션이 등록되었습니다.',
			description: '"Misson 2 온보딩 페이지 만들기"',
			time: '25.11.24',
			isRead: true,
		},
		{
			id: 6,
			category: 'NECT 플랫폼',
			title: '새로운 위크 미션이 등록되었습니다.',
			description: '"Misson 2 온보딩 페이지 만들기"',
			time: '25.11.24',
			isRead: true,
		},
	]

	return (
		<div className='w-[360px] bg-white rounded-2xl border border-neutral-200 z-50 overflow-hidden shadow-drop-neutral-1'>
			<div className='notification-scrollbar h-[500px] overflow-y-auto pl-4'>
				{notifications.map(notification => (
					<NotificationItem key={notification.id} notification={notification} />
				))}
			</div>
		</div>
	)
}

export default SideNotificationModal
