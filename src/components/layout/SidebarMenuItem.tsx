import { cn } from '@/utils/cn'

interface SidebarMenuItemProps {
	icon: React.ComponentType<{ className?: string }>
	label: string
	isActive?: boolean
	alwaysDark?: boolean
	shadowType?: 'neutral-1' | 'neutral-2'
	hasBadge?: boolean
}

export const SidebarMenuItem = ({
	icon: Icon,
	label,
	isActive = false,
	alwaysDark = false,
	shadowType,
	hasBadge = false,
}: SidebarMenuItemProps) => {
	const textColor = alwaysDark ? 'text-neutral-900' : isActive ? 'text-neutral-900' : 'text-neutral-500'

	const shadowClass =
		shadowType === 'neutral-1'
			? isActive
				? ''
				: 'hover:bg-neutral-50 hover:shadow-inner-neutral-1'
			: shadowType === 'neutral-2' && isActive
				? 'bg-neutral-50 shadow-inner-neutral-2'
				: ''

	return (
		<div className={cn('w-14 h-14 rounded-16 flex flex-col justify-center items-center gap-0.5', shadowClass)}>
			<div className='w-7 h-7 relative'>
				<Icon className={cn('w-7 h-7', textColor)} />
				{hasBadge && <div className='bg-primary-500-normal absolute top-px right-px w-1 h-1 rounded-full' />}
			</div>
			<div className={cn('w-12 text-center caption-1 font-medium', textColor)}>{label}</div>
		</div>
	)
}
