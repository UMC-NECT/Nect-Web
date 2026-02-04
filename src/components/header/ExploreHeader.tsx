import { useState, useEffect, useRef } from 'react'
import LogoIcon from '@/assets/icons/header/Logo.svg?react'
import BarIcon from '@/assets/icons/common/Bar.svg?react'
import MessageIcon from '@/assets/icons/common/message.svg?react'
import NotificationIcon from '@/assets/icons/common/notification.svg?react'
import ProfileIcon from '@/assets/icons/header/Profile.svg?react'
import PortfolioIcon from '@/assets/icons/header/Portfolio.svg?react'
import NotificationDropdown from '@/components/notification/NotificationDropdown'
import ProfileDropdown from '@/components/header/ProfileDropdown'
import { useClickOutside } from '@/hooks/useClickOutside'
import { Link, useNavigate } from 'react-router'

interface ExploreHeaderProps {
	onNavigate: () => void
}

const ExploreHeader = ({ onNavigate }: ExploreHeaderProps) => {
	const [activeSubMenu, setActiveSubMenu] = useState('프로젝트 찾기')
	const [showNotifications, setShowNotifications] = useState(false)
	const [showMessages, setShowMessages] = useState(false)
	const [showProfile, setShowProfile] = useState(false)
	const [isScrolled, setIsScrolled] = useState(false)
	const navigate = useNavigate()
	// 읽지 않은 알림 개수 (더미 데이터)
	const unreadNotifications = 3

	// 외부 클릭 감지를 위한 ref
	const notificationRef = useRef<HTMLDivElement>(null)
	const messageRef = useRef<HTMLDivElement>(null)
	const profileRef = useRef<HTMLDivElement>(null)

	// 외부 클릭 시 드롭다운 닫기
	useClickOutside(notificationRef, () => setShowNotifications(false), showNotifications)
	useClickOutside(messageRef, () => setShowMessages(false), showMessages)
	useClickOutside(profileRef, () => setShowProfile(false), showProfile)

	const subMenuItems = [
		{ name: '홈' },
		{ name: '프로젝트 찾기' },
		{ name: '팀원 찾기' },
		{ name: '출시 프로젝트' },
	]

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
						<button
							onClick={() => {
								onNavigate()
								navigate('/team-board')
							}}
							className='text-[18px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors'
						>
							팀 작업실
						</button>
					</nav>

					{/* 오른쪽 공간 */}
					<div className='flex-1' />

					{/* 오른쪽 아이콘들 */}
					<div className='flex items-center gap-4'>
						<div ref={notificationRef}>
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
									<div className='absolute top-2 right-2 w-[3.2px] h-[3.2px] bg-semantic-600 rounded-full'></div>
								)}
							</button>
							{showNotifications && <NotificationDropdown defaultTab='all' />}
						</div>

						<div ref={messageRef}>
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
							{showMessages && <NotificationDropdown defaultTab='messages' />}
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
