import { useState } from 'react'
import { SidebarMenuItem } from './SidebarMenuItem'
import { type BottomMenuId, TOP_MENU_ITEMS, BOTTOM_MENU_ITEMS } from '@/constants/sidebar'

export const Sidebar = () => {
	const [activeBottomMenu, setActiveBottomMenu] = useState<BottomMenuId | null>('team-board')

	const handleTopMenuClick = () => {}

	const handleBottomMenuClick = (menuId: BottomMenuId) => {
		setActiveBottomMenu(menuId)
	}

	return (
		<div className='w-16 h-[890px] px-1.5 py-5 bg-white shadow-[0px_-4px_16px_0px_rgba(23,23,20,0.04)] inline-flex justify-center items-start'>
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
								onClick={handleTopMenuClick}
							>
								<SidebarMenuItem icon={menu.icon} label={menu.label} isActive={false} alwaysDark={true} />
							</div>
						))}
					</div>

					<div className='w-12 h-0 opacity-40 outline outline-offset-[-0.50px] outline-neutral-300' />

					<div className='self-stretch flex flex-col justify-start items-start gap-2.5'>
						{BOTTOM_MENU_ITEMS.map(menu => (
							<div
								key={menu.id}
								className='cursor-pointer'
								onClick={() => handleBottomMenuClick(menu.id as BottomMenuId)}
							>
								<SidebarMenuItem icon={menu.icon} label={menu.label} isActive={activeBottomMenu === menu.id} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
