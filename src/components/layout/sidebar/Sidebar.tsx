import { useState, useRef, useMemo, useEffect } from 'react'
import { SidebarMenuItem } from './SidebarMenuItem'
import { type TopMenuId, type BottomMenuId, TOP_MENU_ITEMS, BOTTOM_MENU_ITEMS } from '@/constants/sidebar'
import SideNotificationModal from '@/components/notification/SideNotificationModal'
import ChatModal from '@/components/chat/ChatModal'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useNavigate, useParams, useLocation } from 'react-router'
import { useNotificationList } from '@/hooks/notification/useNotificationList'
import { useGetProfileQuery } from '@/hooks/auth/useUsersApi'
import DefaultProfileImage from '@/assets/Default_Profile.svg'

// 프로필 이미지 파일명을 전체 URL로 변환하는 함수
const getProfileImageUrl = (profileImage: string | null | undefined): string | undefined => {
	if (!profileImage || profileImage.trim() === '') return undefined
	
	const trimmed = profileImage.trim()
	
	// 이미 전체 URL인 경우 그대로 반환
	if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
		return trimmed
	}
	
	// 파일명만 있는 경우 전체 URL로 변환
	const baseUrl = 'https://76122aff7b2ca633a0966c21a51c956d.r2.cloudflarestorage.com/nect-server/nect-server'
	return `${baseUrl}/${encodeURIComponent(trimmed)}`
}

export const Sidebar = () => {
	const [activeTopMenu, setActiveTopMenu] = useState<TopMenuId | null>(null)
	const [activeBottomMenu, setActiveBottomMenu] = useState<BottomMenuId | null>('team-board')
	const [showNotificationModal, setShowNotificationModal] = useState(false)
	const [showChatModal, setShowChatModal] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()
	const params = useParams<{ projectId?: string }>()
	const projectId = params.projectId ? parseInt(params.projectId, 10) : undefined

	// 프로필 정보 조회
	const { data: profileData } = useGetProfileQuery()
	const profileImageUrl = useMemo(() => {
		const imageUrl = profileData?.body?.imageUrl
		return getProfileImageUrl(imageUrl) || DefaultProfileImage
	}, [profileData?.body?.imageUrl])

	// URL과 동기화해 하단 메뉴 활성 표시 (새로고침/직접 URL 시)
	useEffect(() => {
		const pathBase = location.pathname.split('/').filter(Boolean)[0]
		if (pathBase && BOTTOM_MENU_ITEMS.some(m => m.id === pathBase)) {
			setActiveBottomMenu(pathBase as BottomMenuId)
		}
	}, [location.pathname])

	const notificationModalRef = useRef<HTMLDivElement>(null)
	const chatModalRef = useRef<HTMLDivElement>(null)

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

	useClickOutside(
		notificationModalRef,
		() => {
			setShowNotificationModal(false)
			setActiveTopMenu(null)
		},
		showNotificationModal
	)

	useClickOutside(
		chatModalRef,
		() => {
			setShowChatModal(false)
			setActiveTopMenu(null)
		},
		showChatModal
	)

	const handleTopMenuClick = (menuId: TopMenuId) => {
		if (menuId === 'notification') {
			setShowNotificationModal(!showNotificationModal)
			setShowChatModal(false)
			setActiveTopMenu(showNotificationModal ? null : menuId)
		} else if (menuId === 'message') {
			setShowChatModal(!showChatModal)
			setShowNotificationModal(false)
			setActiveTopMenu(showChatModal ? null : menuId)
		} else {
			setActiveTopMenu(menuId)
			setShowNotificationModal(false)
			setShowChatModal(false)
		}
	}

	const handleBottomMenuClick = (menuId: BottomMenuId) => {
		setActiveBottomMenu(menuId)
		const projectId = params.projectId
		navigate(projectId ? `/${menuId}/${projectId}` : `/${menuId}`)
	}

	return (
		<>
			<div className='w-[70px] h-[890px] mt-[66px] px-1.5 py-5 bg-white border-r border-neutral-100 fixed top-0 left-0 justify-center items-start'>
				<div className='w-14 inline-flex flex-col justify-start items-center gap-5'>
					<div className='w-10 h-10 relative'>
						<img
							className='w-10 h-10 left-0 top-0 absolute rounded-full outline outline-neutral-200 object-cover'
							src={profileImageUrl}
							alt='프로필'
							onError={(e) => {
								const target = e.target as HTMLImageElement
								target.src = DefaultProfileImage
							}}
						/>
					</div>

					<div className='self-stretch flex flex-col justify-start items-center gap-5'>
						<div className='self-stretch flex flex-col justify-start items-start gap-2.5'>
							{TOP_MENU_ITEMS.map(menu => (
								<div
									key={menu.id}
									className='self-stretch h-14 rounded-16 inline-flex justify-center items-center gap-2.5 overflow-hidden cursor-pointer'
									onClick={() => handleTopMenuClick(menu.id as TopMenuId)}
								>
									<SidebarMenuItem
										icon={menu.icon}
										label={menu.label}
										isActive={activeTopMenu === menu.id}
										alwaysDark={true}
										shadowType='neutral-1'
										hasBadge={menu.id === 'notification' && hasUnreadNotifications}
									/>
								</div>
							))}
						</div>

						<div className='w-[50px] h-px bg-neutral-300 opacity-40' />

						<div className='self-stretch flex flex-col justify-start items-start gap-2.5'>
							{BOTTOM_MENU_ITEMS.map(menu => (
								<div
									key={menu.id}
									className='cursor-pointer'
									onClick={() => handleBottomMenuClick(menu.id as BottomMenuId)}
								>
									<SidebarMenuItem
										icon={menu.icon}
										label={menu.label}
										isActive={activeBottomMenu === menu.id}
										shadowType='neutral-2'
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			{showNotificationModal && (
				<div ref={notificationModalRef} className='fixed top-[148px] left-[70px] z-40'>
					<SideNotificationModal />
				</div>
			)}
			{showChatModal && (
				<div ref={chatModalRef} className='fixed top-[130px] left-[70px] z-40 h-[calc(100vh-130px-20px)]'>
					<ChatModal projectId={projectId} />
				</div>
			)}
		</>
	)
}
