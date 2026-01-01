interface SidebarMenuItemProps {
	icon: React.ComponentType<{ className?: string }>
	label: string
	isActive?: boolean
	alwaysDark?: boolean
}

export const SidebarMenuItem = ({ icon: Icon, label, isActive = false, alwaysDark = false }: SidebarMenuItemProps) => {
	const textColor = alwaysDark ? 'text-neutral-900' : isActive ? 'text-neutral-900' : 'text-neutral-500'

	return (
		<div
			className={`w-14 h-14 rounded-16 flex flex-col justify-center items-center gap-0.5 ${
				isActive ? 'bg-neutral-50 shadow-inner-neutral-2' : ''
			}`}
		>
			<div className='w-7 h-7 relative overflow-hidden'>
				<Icon className={`w-7 h-7 ${textColor}`} />
			</div>
			<div className={`w-12 text-center caption-1 font-medium ${textColor}`}>{label}</div>
		</div>
	)
}
