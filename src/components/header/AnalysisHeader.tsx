import LogoIcon from '@/assets/icons/header/Logo.svg?react'
import BarIcon from '@/assets/icons/common/Bar.svg?react'
import MessageIcon from '@/assets/icons/common/message.svg?react'
import NotificationIcon from '@/assets/icons/common/notification.svg?react'
import ProfileIcon from '@/assets/icons/header/Profile.svg?react'
import { useRef, useState } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import NotificationDropdown from '../notification/NotificationDropdown'
import MessageDropdown from '../chat/MessageDropdown'

interface AnalysisHeaderProps {
	onNavigate: () => void
}

const AnalysisHeader = ({ onNavigate }: AnalysisHeaderProps) => {
    const [showNotifications, setShowNotifications] = useState(false)
	const [showMessages, setShowMessages] = useState(false)

    const unreadNotifications = 3

    // 외부 클릭 감지를 위한 ref
	const notificationRef = useRef<HTMLDivElement>(null)
	const messageRef = useRef<HTMLDivElement>(null)

	// 외부 클릭 시 드롭다운 닫기
	useClickOutside(notificationRef, () => setShowNotifications(false), showNotifications)
	useClickOutside(messageRef, () => setShowMessages(false), showMessages)

    return (
        <div>
            {/* 상단 헤더 */}
			<div className='h-[66px] px-[92px]'>
				<div className='mx-auto flex h-full items-center gap-9 px-6 relative'>
					{/* 로고 */}
					<div className='flex items-center cursor-pointer'>
						<LogoIcon className='h-10 w-auto' />
					</div>

					{/* 네비게이션 */}
					<nav className='flex items-center gap-4'>
						<button className='text-[18px] font-medium text-neutral-900 transition-colors'>
							프로젝트ㆍ팀원 탐색
						</button>
						<BarIcon />
						<button
							onClick={onNavigate}
							className='text-[18px] font-medium text-neutral-400 hover:text-primary-500-normal transition-colors'
						>
							팀 작업실
						</button>
					</nav>

					{/* 오른쪽 공간 */}
					<div className='flex-1' />

					{/* 오른쪽 아이콘들 */}
					<div className='flex items-center gap-4'>
						<div ref={notificationRef} className='relative'>
							<button
								className={`flex w-10 h-10 items-center justify-center relative rounded-[14px] transition-colors ${
									showNotifications ? 'bg-neutral-100' : 'hover:bg-neutral-100'
								}`}
								aria-label='알림'
								onClick={() => {
									setShowNotifications(!showNotifications)
									setShowMessages(false)
								}}
							>
								<NotificationIcon className='h-6 w-6 text-neutral-700' />
								{unreadNotifications > 0 && (
									<div className='absolute top-2 right-2 w-[3.2px] h-[3.2px] bg-danger-600 rounded-full'></div>
								)}
							</button>
							{showNotifications && <NotificationDropdown defaultTab='team' />}
						</div>

						<div ref={messageRef} className='relative'>
							<button
								className={`flex w-10 h-10 items-center justify-center relative rounded-[14px] transition-colors ${
									showMessages ? 'bg-neutral-100' : 'hover:bg-neutral-100'
								}`}
								aria-label='채팅'
								onClick={() => {
									setShowMessages(!showMessages)
									setShowNotifications(false)
								}}
							>
								<MessageIcon className='h-6 w-6 text-neutral-700' />
							</button>
							{showMessages && <MessageDropdown defaultTab='team' />}
						</div>

						<button
							className='flex w-10 h-10 items-center justify-center hover:bg-neutral-100 rounded-[14px] transition-colors'
							aria-label='프로필'
						>
							<ProfileIcon className='h-6 w-6 text-neutral-700' />
						</button>
					</div>
				</div>
			</div>
        </div>
    )
}

export default AnalysisHeader