import type { MissionStatus } from '@/types/missionStatus'
import { STATUS } from '@/constants/status'
import { useLocation } from 'react-router'
import { cn } from '@/utils/cn'

interface StatusChipProps {
	state: MissionStatus
	gridColumnSize?: number
	onClick?: () => void
}

const StatusChip = ({ state, gridColumnSize, onClick }: StatusChipProps) => {
	const location = useLocation()
	const isWorkStatus = location.pathname === '/work-status'
	const isCircular = gridColumnSize && gridColumnSize < 3

	const config = STATUS[state as keyof typeof STATUS]

	return (
		<div
			className={cn(
				'flex items-center justify-center gap-[4px] py-[3px] bg-neutral-000 shadow-[0_0_4px_0_rgba(154,92,235,0.2)] border border-neutral-000',
				isCircular ? 'rounded-full px-[3px]' : 'rounded-[12px] pl-[9px] pr-[11px]',
				isWorkStatus ? '' : 'cursor-pointer hover:border-neutral-200 transition-all duration-300'
			)}
			onClick={onClick}
		>
			<div className={cn('w-[10px] h-[10px] rounded-full shrink-0', config.dotColor)} />
			{!isCircular && <p className='body-2 text-neutral-700 font-medium text-center whitespace-nowrap'>{config.text}</p>}
		</div>
	)
}

export default StatusChip