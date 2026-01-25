import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { MYPAGE_MENU, type MyPageMenuItemId } from '@/constants/mypage'

interface MyPageSidebarProps {
	userName?: string
	userRole?: string
	userEmail?: string
	profileImage?: string
	isPro?: boolean
	matchingWaitCount?: number
	receivedRequestCount?: number
}

export const MyPageSidebar = ({
	userName = '이방토',
	userRole = '디자이너',
	userEmail = 'ellaelia2@hanyang.ac.kr',
	profileImage = 'https://placehold.co/80x80',
	isPro = true,
	matchingWaitCount = 10,
	receivedRequestCount = 5,
}: MyPageSidebarProps) => {
	const navigate = useNavigate()
	const location = useLocation()
	const [activeItem, setActiveItem] = useState<MyPageMenuItemId>('profile-settings')

	const handleMenuClick = (itemId: MyPageMenuItemId, path: string) => {
		setActiveItem(itemId)
		navigate(path)
	}

	const isActive = (itemId: string) => {
		return activeItem === itemId || location.pathname.includes(itemId.replace('-', '/'))
	}

	return (
		<aside className='w-48 min-h-screen flex flex-col pt-4'>
			{/* 프로필 섹션 */}
			<div className='flex flex-col items-start px-4 py-2.5 gap-4 mb-3'>
				{/* 프사 */}
				<img src={profileImage} alt='프로필' className='w-20 h-20 rounded-full overflow-hidden object-cover' />

				<div className='flex flex-col items-start gap-0.5'>
					{/* 이름 */}
					<div className='w-25 h-7 flex items-center gap-1.5'>
						<span className='title-2 font-bold text-neutral-900'>{userName}</span>
						{isPro && (
							<span className='text-primary-500-normal text-[13px] font-bold px-2 py-0.5 rounded-100 bg-primary-200-light leading-[130%] tracking-[-0.5px]'>
								PRO
							</span>
						)}
					</div>

					{/* 소개 */}
					<span className='button-1 font-semibold text-primary-500-normal'>{userRole}</span>
					<span className='caption-2 text-neutral-500'>{userEmail}</span>
				</div>
			</div>

			{/* 매칭 현황 섹션 */}
			<div className='flex justify-start gap-3.5 px-1 mb-18'>
				<div className='w-17.5 h-12 flex flex-col items-center'>
					<span className='heading-3 font-bold text-neutral-900'>{matchingWaitCount}</span>
					<span className='caption-1 font-semibold text-neutral-500'>매칭 대기 중</span>
				</div>
				<div className='w-17.5 h-12 flex flex-col items-center'>
					<span className='heading-3 font-bold text-neutral-900'>{receivedRequestCount}</span>
					<span className='caption-1 font-semibold text-neutral-500'>나에게 온 신청</span>
				</div>
			</div>

			{/* 메뉴 섹션 */}
			<nav className='flex flex-col pl-2.5 gap-8'>
				{MYPAGE_MENU.map(section => (
					<div key={section.id}>
						<h3 className='title-2 font-bold text-neutral-900 mb-3'>{section.title}</h3>
						<ul className='flex flex-col gap-1'>
							{section.items.map(item => (
								<li key={item.id}>
									<button
										type='button'
										onClick={() => handleMenuClick(item.id as MyPageMenuItemId, item.path)}
										className={`w-45.5 h-7.25 text-left body-2 p-1 hover:text-primary-600-normal duration-200 ease-in-out ${
											isActive(item.id) ? 'text-primary-600-normal font-bold' : 'text-neutral-600'
										}`}
									>
										{item.label}
									</button>
								</li>
							))}
						</ul>
					</div>
				))}
			</nav>
		</aside>
	)
}
