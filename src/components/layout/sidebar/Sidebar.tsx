import { useState, useRef } from 'react'
import { SidebarMenuItem } from './SidebarMenuItem'
import { type TopMenuId, type BottomMenuId, TOP_MENU_ITEMS, BOTTOM_MENU_ITEMS } from '@/constants/sidebar'
import SideNotificationModal from '@/components/notification/SideNotificationModal'
import SideChatModal from '@/components/chat/SideChatModal'
import { useClickOutside } from '@/hooks/useClickOutside'

export const Sidebar = () => {
	const [activeTopMenu, setActiveTopMenu] = useState<TopMenuId | null>(null)
	const [activeBottomMenu, setActiveBottomMenu] = useState<BottomMenuId | null>('team-board')
	const [showNotificationModal, setShowNotificationModal] = useState(false)
	const [showChatModal, setShowChatModal] = useState(false)

	const notificationModalRef = useRef<HTMLDivElement>(null)
	const chatModalRef = useRef<HTMLDivElement>(null)

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
	}

	return (
		<>
			<div className='w-16 h-[890px] mt-[66px] px-1.5 py-5 bg-white border-r border-neutral-100 fixed top-0 left-0 justify-center items-start'>
				<div className='w-14 inline-flex flex-col justify-start items-center gap-5'>
					<div className='w-10 h-10 relative'>
						<img
							className='w-10 h-10 left-0 top-0 absolute rounded-full outline outline-neutral-200'
							src='https://placehold.co/40x40'
							alt='프로필'
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
										hasBadge={menu.id === 'notification'}
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
				<div ref={notificationModalRef} className='fixed top-[148px] left-16 z-40'>
					<SideNotificationModal />
				</div>
			)}
			{showChatModal && (
				<div ref={chatModalRef} className='fixed top-[148px] left-16 z-40'>
					<SideChatModal />
				</div>
			)}
		</>
	)
}
