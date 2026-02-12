import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useMypageProfileQuery } from '@/hooks/mypage/useMypageApi'
import { useMatchingCountQuery } from '@/hooks/mypage/useMatchingApi'
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'
import { MYPAGE_MENU } from '@/constants/mypage'
import { getRoleLabel } from '@/utils/enumUtils'
import ProfileImageIcon from '@/assets/icons/mypage/profile-image.svg?react'

export const MyPageSidebar = () => {
	const { data: profileData } = useMypageProfileQuery()
	const { data: countData } = useMatchingCountQuery()

	const matchingWaitCount = countData?.body?.sentCount ?? 0
	const receivedRequestCount = countData?.body?.receivedCount ?? 0
	const profile = profileData?.body
	const { roles, roleFields } = useOnboardingEnums()
	const roleLabel = useMemo(
		() => getRoleLabel(profile?.role ?? '', roles, roleFields),
		[profile?.role, roles, roleFields]
	)
	const navigate = useNavigate()
	const location = useLocation()

	const handleMenuClick = (path: string) => {
		navigate(path)
	}

	const isActive = (path: string): boolean => {
		// /mypage 인덱스 라우트일 때 프로필 설정 메뉴 활성화
		if (location.pathname === '/mypage' && path === '/mypage/profile') {
			return true
		}
		return location.pathname === path || location.pathname.startsWith(path + '/')
	}

	return (
		<aside className='w-48 min-h-screen flex flex-col pt-4'>
			{/* 프로필 섹션 */}
			<div className='flex flex-col items-start px-4 py-2.5 gap-4 mb-3'>
				{/* 프사 */}
				{profile?.profileImageUrl ? (
					<img
						src={profile.profileImageUrl}
						alt='프로필'
						className='w-20 h-20 rounded-full overflow-hidden object-cover border border-neutral-100'
					/>
				) : (
					<ProfileImageIcon className='w-20 h-20' />
				)}

				<div className='flex flex-col items-start gap-0.5'>
					{/* 이름 */}
					<div className='w-fit h-7 flex items-center gap-1.5'>
						<span className='title-2 font-bold text-neutral-900'>{profile?.nickname}</span>
					</div>

					{/* 소개 */}
					<span className='button-1 font-semibold text-primary-500-normal'>{roleLabel}</span>
					<span className='caption-2 text-neutral-500'>{profile?.email}</span>
				</div>
			</div>

			{/* 매칭 현황 */}
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
										onClick={() => handleMenuClick(item.path)}
										className={`w-45.5 h-7.25 text-left body-2 p-1 hover:text-primary-600-normal duration-200 ease-in-out ${
											isActive(item.path) ? 'text-primary-600-normal font-bold' : 'text-neutral-600'
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
