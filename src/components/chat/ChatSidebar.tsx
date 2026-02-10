import { useState } from 'react'
import MessageIcon from '@/assets/icons/sidebar/message.svg?react'
import CloudIcon from '@/assets/icons/sidebar/cloud.svg?react'
import SettingIcon from '@/assets/icons/sidebar/setting.svg?react'

interface ChatSidebarProps {
	unreadCount?: number
	onMessageClick?: () => void
	onCloudClick?: () => void
	onSettingsClick?: () => void
}

const ChatSidebar = ({ unreadCount = 0, onMessageClick, onCloudClick, onSettingsClick }: ChatSidebarProps) => {
	const [selectedIcon, setSelectedIcon] = useState<'message' | 'cloud'>('message')

	const handleMessageClick = () => {
		setSelectedIcon('message')
		onMessageClick?.()
	}

	const handleCloudClick = () => {
		setSelectedIcon('cloud')
		onCloudClick?.()
	}

	return (
		<div className="w-[50px] h-full px-[10px] pt-[58px] pb-[9px] bg-[#747482] rounded-tl-xl rounded-bl-xl flex items-center">
			<div className="self-stretch flex flex-col justify-between items-start h-full">
				{/* 상단 아이콘들 */}
				<div className="flex flex-col gap-[20px] items-start">
					{/* 메시지 아이콘 (알림 배지 있음) */}
					<button
						onClick={handleMessageClick}
						className="w-[30px] h-[30px] relative flex justify-center items-center"
					>
						<MessageIcon
							className={`w-[30px] h-[30px] ${
								selectedIcon === 'message' ? 'text-neutral-000' : 'text-status-info-neutral'
							}`}
						/>
						{unreadCount > 0 && (
							<div className="h-[13px] px-1 left-[16.5px] top-[14.5px] absolute bg-primary-600-normal rounded-xl flex justify-center items-center">
								<span className="text-center text-neutral-000 caption-3 font-medium leading-normal">
									{unreadCount > 99 ? '99+' : unreadCount}
								</span>
							</div>
						)}
					</button>

					{/* 클라우드 아이콘 */}
					<button
						onClick={handleCloudClick}
						className="w-[30px] h-[30px] relative flex justify-center items-center"
					>
						<CloudIcon
							className={`w-[30px] h-[30px] ${
								selectedIcon === 'cloud' ? 'text-neutral-000' : 'text-status-info-neutral'
							}`}
						/>
					</button>
				</div>

				{/* 하단 설정 아이콘 */}
				<button
					onClick={onSettingsClick}
					className="w-[30px] h-[30px] relative flex justify-center items-center"
				>
					<div className="w-[30px] h-[30px] rounded-lg" />
					{/* 설정 아이콘 SVG */}
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 p-[1.25px] flex items-center justify-center">
					</div>
				</button>
			</div>
		</div>
	)
}

export default ChatSidebar
