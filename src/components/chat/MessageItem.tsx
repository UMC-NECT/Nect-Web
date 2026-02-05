import { type ChatMessage } from '@/types/message'

interface MessageItemProps {
	message: ChatMessage
	isSelected?: boolean
	onClick?: () => void
}

export const MessageItem = ({ message, isSelected = false, onClick }: MessageItemProps) => {
	const isGroup = message.isGroup ?? (message.participants && message.participants.length > 1)
	const profileImage = message.profileImage || 'https://placehold.co/44x44'

	return (
		<div
			className={`flex flex-col items-center px-5 py-4 relative shrink-0 w-full cursor-pointer transition-colors ${
				isSelected ? 'bg-primary-100-light' : 'bg-neutral-000'
			}`}
			onClick={onClick}
		>
			<div className='flex gap-3 items-center justify-center min-w-[340px] relative shrink-0 w-full'>
				{/* 프로필 이미지 */}
				<div className='relative shrink-0 size-[44px]'>
					<div className='absolute flex inset-0 items-center justify-center'>
						<div className='size-[30px]'>
							<div className='relative size-full'>
								<div className='absolute inset-[-2.27%]'>
									<img
										alt={message.senderName}
										className='block max-w-none size-full rounded-full object-cover'
										src={isGroup ? message.participants?.[0] || 'https://placehold.co/44x44' : profileImage}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 메시지 정보 */}
				<div className='flex flex-1 items-center justify-between relative shrink-0 min-w-0'>
					{/* 왼쪽: 이름/역할, 마지막 메시지 */}
					<div className='flex flex-col gap-0.5 items-start relative shrink-0 w-[230px]'>
						<div className='flex gap-1 items-center relative shrink-0 w-full'>
							<span className='body-1 font-semibold text-neutral-900'>{message.senderName}</span>
							{isGroup && message.memberCount !== undefined && (
								<span className='body-2 font-medium text-neutral-500'>{message.memberCount}</span>
							)}
							{!isGroup && message.role && (
								<span className='body-2 font-medium text-neutral-500'>{message.role}</span>
							)}
						</div>
						<div
							className={`label font-medium overflow-hidden text-ellipsis w-full line-clamp-1 ${
								message.isRead ? 'text-neutral-500' : 'text-neutral-600'
							}`}
						>
							{message.content}
						</div>
					</div>

					{/* 오른쪽: 시간, 읽지 않은 메시지 수 */}
					<div className='flex flex-col gap-2.5 h-[44px] items-end pt-0.5 relative shrink-0'>
						<div className='h-3.5 text-right justify-center text-neutral-500 caption-1 font-regular w-[54px]'>
							{message.time}
						</div>
						{message.unreadCount && message.unreadCount > 0 && (
							<div className='bg-primary-600-normal flex items-center justify-center px-1.5 rounded-12 shrink-0 size-[18px]'>
								<span className='caption-1 font-medium text-neutral-000 text-center'>
									{message.unreadCount > 99 ? '99+' : message.unreadCount}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
