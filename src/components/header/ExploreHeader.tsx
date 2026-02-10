import { useState, useEffect, useRef, useMemo } from 'react'
import LogoIcon from '@/assets/icons/header/Logo.svg?react'
import BarIcon from '@/assets/icons/common/Bar.svg?react'
import MessageIcon from '@/assets/icons/common/message.svg?react'
import NotificationIcon from '@/assets/icons/common/notification.svg?react'
import ProfileIcon from '@/assets/icons/header/Profile.svg?react'
import PortfolioIcon from '@/assets/icons/header/Portfolio.svg?react'
import NotificationDropdown from '@/components/notification/NotificationDropdown'
import MessageDropdown from '@/components/chat/MessageDropdown'
import ProfileDropdown from '@/components/header/ProfileDropdown'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { LOCAL_STORAGE_KEY } from '@/constants/key'
import { Link, useNavigate } from 'react-router'
import useGetProjectUsers from '@/hooks/project-users/useGetProjectUsers'
import { useProjectIdStore } from '@/stores/useProjectIdStroe'
import { useNotificationList } from '@/hooks/notification/useNotificationList'

interface ExploreHeaderProps {
	onNavigate: () => void
}

const ExploreHeader = ({ onNavigate }: ExploreHeaderProps) => {
	const [activeSubMenu, setActiveSubMenu] = useState('프로젝트 찾기')
	const [showNotifications, setShowNotifications] = useState(false)
	const [showMessages, setShowMessages] = useState(false)
	const [showProfile, setShowProfile] = useState(false)
	const [isScrolled, setIsScrolled] = useState(false)
	const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
	const navigate = useNavigate()
	const projectData = useGetProjectUsers()
	const { setProjectId } = useProjectIdStore()
	const { getItem: getAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)

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

	const subMenuItems = [{ name: '홈' }, { name: '프로젝트 찾기' }, { name: '팀원 찾기' }, { name: '출시 프로젝트' }]
	const workspaceMenuItems = [
        {projectId: projectData?.[0]?.projectId, name: `${projectData?.[0]?.projectTitle}` },
        {projectId: projectData?.[1]?.projectId, name: `${projectData?.[1]?.projectTitle}` },
    ];

	// 스크롤 이벤트 핸들러
	useEffect(() => {
		let lastScrollY = window.scrollY

		const handleScroll = () => {
			const currentScrollY = window.scrollY

			if (currentScrollY > 66 && currentScrollY > lastScrollY) {
				// 아래로 스크롤 중이고, 66px 이상 내려갔을 때
				setIsScrolled(true)
			} else if (currentScrollY < lastScrollY) {
				// 위로 스크롤 중일 때
				setIsScrolled(false)
			}

			lastScrollY = currentScrollY
		}

		window.addEventListener('scroll', handleScroll, { passive: true })

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	const isLoggedIn = getAccessToken()

	return (
		<header
			className='fixed top-0 left-0 right-0 bg-white z-50 shadow-[0px_4px_20px_0px_rgba(25,25,25,0.02)] transition-transform duration-300'
			style={{ transform: isScrolled ? 'translateY(-66px)' : 'translateY(0)' }}
		>
			{/* 상단 헤더 */}
			<div className='h-[66px] px-[92px]'>
				<div className='mx-auto flex h-full items-center gap-9 px-6 relative'>
					{/* 로고 */}
					<Link to='/' className='flex items-center cursor-pointer'>
						<LogoIcon className='h-10 w-auto' />
					</Link>

					{/* 네비게이션 */}
					<nav className='flex items-center gap-4'>
						<button className='text-[18px] font-medium text-neutral-900 transition-colors'>
							프로젝트ㆍ팀원 탐색
						</button>
						<BarIcon />
						<div className='relative'>
							<button
								onClick={() => {
									onNavigate()
									setProjectId(projectData?.[0]?.projectId ?? null)
									navigate('/team-board')
								}}
								onMouseEnter={() => setShowWorkspaceMenu(true)}
								className='text-[18px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors'
							>
								팀 작업실
							</button>
							{/* 팀 작업실 드롭다운 */}

							{showWorkspaceMenu && (
									<div
										className="absolute top-[46px] left-[-20px] w-[160px] bg-white rounded-12 border border-neutral-200 overflow-hidden z-50 shadow-[0px_4px_20px_0px_rgba(25,25,25,0.04)]"
										onMouseEnter={() => setShowWorkspaceMenu(true)}
										onMouseLeave={() => setShowWorkspaceMenu(false)}
									>
										{workspaceMenuItems.map((item, index) => (
											<div key={item.name}>
												<button
													className="w-full h-[54px] px-4 text-left text-[16px] font-medium text-neutral-900 hover:bg-neutral-50 transition-colors flex items-center"
													onClick={() => {
														setProjectId(item.projectId ?? null)
														navigate('/team-board')
													}}
												>
													{item.name}
												</button>
												{index < workspaceMenuItems.length - 1 && (
													<div className="border-b border-neutral-200"></div>
												)}
											</div>
										))}
									</div>
								)}
						</div>
					</nav>

					{/* 오른쪽 공간 */}
					<div className='flex-1' />

					{isLoggedIn ? (
						<>
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
											const accessToken = getAccessToken()
											if (!accessToken) {
												navigate('/login')
											}
										}}
									>
										<ProfileIcon className='h-6 w-6 text-neutral-700' />
									</button>
									<ProfileDropdown isOpen={showProfile} onClose={() => setShowProfile(false)} />
								</div>
							</div>
						</>
					) : (
						<>
							<Link to='/login' className='text-[16px] font-medium text-neutral-600 hover:text-primary-600-normal pointer-cursor'>
								로그인/회원가입
							</Link>
						</>
					)}
				</div>
			</div>

			{/* 하단 서브메뉴 */}
			<div className='h-[66px] px-[92px]'>
				<div className='mx-auto flex h-full items-center px-6'>
					{/* 왼쪽 메뉴 영역 */}
					<div className='w-[690px] flex items-center'>
						{subMenuItems.map(item => (
							<button
								key={item.name}
								onClick={() => setActiveSubMenu(item.name)}
								className={`px-4 py-2 text-[16px] font-medium rounded-xl transition-colors mr-[10px] ${
									activeSubMenu === item.name
										? 'text-neutral-900 bg-neutral-100'
										: 'text-neutral-700 hover:bg-neutral-50'
								}`}
							>
								{item.name}
							</button>
						))}
					</div>

					{/* 오른쪽 공간 */}
					<div className='flex-1' />

					{/* 오른쪽 버튼들 */}
					<div className='flex items-center gap-3'>
						<button className='px-4 py-2 text-[16px] font-semibold text-primary-800-dark bg-primary-50-light border border-primary-200-light hover:bg-primary-100-light hover:border-primary-100-light rounded-xl transition-colors'>
							AI 프로젝트 등록
						</button>
						<button className='px-4 py-2 text-[16px] font-semibold text-primary-800-dark bg-primary-50-light border border-primary-200-light hover:bg-primary-100-light hover:border-primary-100-light rounded-xl transition-colors flex items-center gap-2'>
							<PortfolioIcon className='h-[14px] w-[14px] text-primary-800-dark' />
							NECT 리포트
						</button>
					</div>
				</div>
			</div>
		</header>
	)
}

export default ExploreHeader
