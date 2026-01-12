import { type Notification } from '@/types/notification'

interface NotificationItemProps {
	notification: Notification
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
	return (
		<div
			className={`mb-2 px-4 py-3 rounded-[6px] cursor-pointer ${
				!notification.isRead ? 'bg-neutral-100' : 'bg-neutral-000'
			}`}
		>
			{/* 알림 상단 (카테고리, 시간, 읽음 표시) */}
			<div className='flex items-start justify-between mb-1.5'>
				{/* 카테고리 */}
				<span className='text-[11px] text-neutral-400'>{notification.category}</span>

				{/* 시간 및 읽음 표시 */}
				<div className='flex items-center gap-1.5'>
					<span className='text-[11px] text-neutral-400'>{notification.time}</span>
					{/* 안 읽은 알림 표시 점 */}
					{!notification.isRead && <div className='w-1.5 h-1.5 bg-primary-500-normal rounded-full'></div>}
				</div>
			</div>

			{/* 알림 제목 */}
			{notification.title && (
				<p className='text-[13px] font-medium text-neutral-900 mb-1 leading-tight'>{notification.title}</p>
			)}

			{/* 알림 설명 */}
			{notification.description && (
				<p className='text-[12px] text-neutral-600 line-clamp-2 leading-relaxed'>{notification.description}</p>
			)}
		</div>
	)
}

