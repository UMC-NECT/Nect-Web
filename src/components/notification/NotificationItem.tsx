import { type Notification } from '@/types/notification'

interface NotificationItemProps {
	notification: Notification
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
	return (
		<div className='flex flex-col items-center min-h-[79px] pt-4 px-[26px] relative shrink-0 w-full'>
			<div className='flex flex-col gap-5 items-center relative shrink-0 w-full'>
				<div className='flex flex-col gap-1 items-start relative shrink-0 w-full'>
					{/* 알림 상단 (카테고리, 시간, 읽음 표시) */}
					<div className='flex items-center justify-between relative shrink-0 w-full'>
						{/* 카테고리 */}
						<span className='caption-1 text-neutral-400 font-medium'>{notification.category}</span>

						{/* 시간 및 읽음 표시 */}
						<div className='flex items-center gap-1.5 relative shrink-0'>
							<span className='caption-1 text-neutral-400 font-medium'>{notification.time}</span>
							{/* 안 읽은 알림 표시 점 */}
							{!notification.isRead && (
								<div className='w-1.5 h-1.5 bg-primary-500-normal rounded-full shrink-0' />
							)}
						</div>
					</div>

					{/* 알림 내용 */}
					<div
						className={`body-2 font-regular overflow-hidden relative shrink-0 w-full line-clamp-2 ${
							notification.isRead ? 'text-neutral-400' : 'text-neutral-900'
						}`}
					>
						{notification.title && <p className='mb-0 leading-normal'>{notification.title}</p>}
						{notification.description && (
							<p className='mb-0 leading-normal'>{notification.description}</p>
						)}
					</div>
				</div>

				{/* 구분선 */}
				<div className='h-0 relative shrink-0 w-full'>
					<div className='absolute inset-0 border-t border-neutral-200' />
				</div>
			</div>
		</div>
	)
}

