import LogoIcon from '@/assets/icons/header/Logo.svg?react'
import BarIcon from '@/assets/icons/common/Bar.svg?react'
import MessageIcon from '@/assets/icons/common/message.svg?react'
import NotificationIcon from '@/assets/icons/common/notification.svg?react'
import ProfileIcon from '@/assets/icons/header/Profile.svg?react'
import { useRef, useState, useMemo } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import NotificationDropdown from '../notification/NotificationDropdown'
import MessageDropdown from '../chat/MessageDropdown'
import { Link } from 'react-router'
import ProfileDropdown from './ProfileDropdown'
import { useNotificationList } from '@/hooks/notification/useNotificationList'

const AnalysisHeader = () => {
    const [showNotifications, setShowNotifications] = useState(false)
	const [showMessages, setShowMessages] = useState(false)
	const [showProfile, setShowProfile] = useState(false)

	// 알림 목록 조회 (읽지 않은 알림 확인용)
	const { data: notificationResponse } = useNotificationList({
		filter: 'WORKSPACES',
		size: 20,
	})

	// 읽지 않은 알림이 있는지 확인
	const hasUnreadNotifications = useMemo(() => {
		const notifications = notificationResponse?.body?.notifications || []
		return notifications.some(notification => !notification.isRead)
	}, [notificationResponse])

    // 외부 클릭 감지를 위한 ref
	const notificationRef = useRef<HTMLDivElement>(null)
	const messageRef = useRef<HTMLDivElement>(null)
	const profileRef = useRef<HTMLDivElement>(null)

	// 외부 클릭 시 드롭다운 닫기
	useClickOutside(notificationRef, () => setShowNotifications(false), showNotifications)
	useClickOutside(messageRef, () => setShowMessages(false), showMessages)
	useClickOutside(profileRef, () => setShowProfile(false), showProfile)

    return (
        <div>
            {/* 상단 헤더 */}
			<div className='h-[66px] px-[92px]'>
				<div className='mx-auto flex h-full items-center gap-9 px-6 relative'>
					{/* 로고 */}
					<Link to='/' className='flex items-center cursor-pointer'>
						<LogoIcon className='h-10 w-auto' />
					</Link>

					{/* 네비게이션 */}
					<nav className='flex items-center gap-4'>
						<Link to='/explore' className='text-[18px] font-medium text-neutral-900 transition-colors'>
							프로젝트ㆍ팀원 탐색
						</Link>
						<BarIcon />
						<Link to='/team-board' className='text-[18px] font-medium text-neutral-400 hover:text-primary-500-normal transition-colors'>
							팀 작업실
						</Link>
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
									setShowProfile(false)
								}}
							>
								<div className='relative'>
									<NotificationIcon className='h-6 w-6 text-neutral-700' />
									{hasUnreadNotifications && (
										<div className='bg-primary-500-normal absolute top-px right-px w-1 h-1 rounded-full' />
									)}
								</div>
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
									setShowProfile(false)
								}}
							>
								<MessageIcon className='h-6 w-6 text-neutral-700' />
							</button>
							{showMessages && <MessageDropdown defaultTab='team' />}
						</div>

						<div ref={profileRef} className='relative'>
							<button
								className={`flex w-10 h-10 items-center justify-center relative rounded-[14px] transition-colors ${
									showProfile ? 'bg-neutral-100' : 'hover:bg-neutral-100'
								}`}
								aria-label='프로필'
								onClick={() => {
									setShowProfile(!showProfile)
									setShowNotifications(false)
									setShowMessages(false)
								}}
							>
								<ProfileIcon className='h-6 w-6 text-neutral-700' />
							</button>
							<ProfileDropdown isOpen={showProfile} onClose={() => setShowProfile(false)} />
						</div>
					</div>
				</div>
			</div>
        </div>
    )
}

export default AnalysisHeader