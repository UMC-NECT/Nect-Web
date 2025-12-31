interface SidebarMenuItemProps {
	icon: React.ComponentType<{ className?: string }>
	label: string
	isActive?: boolean
}

export const SidebarMenuItem = ({ icon: Icon, label, isActive = false }: SidebarMenuItemProps) => {
	return (
		<div
			className={`w-14 h-14 rounded-16 flex flex-col justify-center items-center gap-0.5 ${
				isActive ? 'bg-neutral-50 shadow-inner-neutral-2' : ''
			}`}
		>
			<div className='w-7 h-7 relative overflow-hidden'>
				<Icon className={`w-7 h-7 ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`} />
			</div>
			<div className={`w-12 text-center caption-1 font-medium ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`}>
				{label}
			</div>
		</div>
	)
}
