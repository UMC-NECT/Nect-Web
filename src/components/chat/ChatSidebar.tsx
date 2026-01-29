import MessageIcon from '@/assets/icons/common/message.svg?react'
import SettingIcon from '@/assets/icons/sidebar/setting.svg?react'

interface ChatSidebarProps {
	unreadCount?: number
	onMessageClick?: () => void
	onCloudClick?: () => void
	onSettingsClick?: () => void
}

const ChatSidebar = ({ unreadCount = 0, onMessageClick, onCloudClick, onSettingsClick }: ChatSidebarProps) => {
	return (
		<div className="w-[50px] h-full px-[10px] pt-[58px] pb-[9px] bg-[#747482] rounded-tl-xl rounded-bl-xl flex items-center">
			<div className="self-stretch flex flex-col justify-between items-start h-full">
				{/* 상단 아이콘들 */}
				<div className="flex flex-col gap-[20px] items-start">
					{/* 메시지 아이콘 (알림 배지 있음) */}
					<button
						onClick={onMessageClick}
						className="w-[30px] h-[30px] p-[3px] relative flex justify-center items-center"
					>
						<MessageIcon className="w-6 h-6 text-status-info-light" />
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
						onClick={onCloudClick}
						className="w-[30px] h-[30px] relative flex justify-center items-center"
					>
						{/* 클라우드 SVG */}
						<svg className="w-[30px] h-[30px]" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
							{/* 클라우드 본체 */}
							<path
								d="M7.5 15C7.5 12.2386 9.73858 10 12.5 10C13 10 13.5 10.1 14 10.3C15 8.5 17 7 19.5 7C22.8137 7 25.5 9.68629 25.5 13C25.5 13.5 25.4 14 25.3 14.5C27 15.5 28 17.5 28 20C28 23.5 25 26.5 21.5 26.5H7.5C5 26.5 3 24.5 3 22C3 19.5 5 17.5 7.5 17.5C7.7 17.5 7.9 17.5 8.1 17.6C7.7 16.5 7.5 15.3 7.5 15Z"
								fill="#ADADBB"
							/>
							{/* 클라우드 선 */}
							<line
								x1="13.5"
								y1="16"
								x2="13.5"
								y2="18.5"
								stroke="#71717F"
								strokeWidth="2"
							/>
							{/* 클라우드 화살표 */}
							<path
								d="M17 16L19.5 18.5L17 21"
								stroke="#71717F"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
							/>
						</svg>
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
						<SettingIcon className="w-5 h-5" />
					</div>
				</button>
			</div>
		</div>
	)
}

export default ChatSidebar
