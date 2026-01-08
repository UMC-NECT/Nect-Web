import type { MissionStatus } from '@/types/missionStatus'

interface StatusChipProps {
	state: MissionStatus
	gridColumnSize?: number
	onClick?: () => void
}

const StatusChip = ({ state, gridColumnSize, onClick }: StatusChipProps) => {
	const isCircular = gridColumnSize && gridColumnSize < 3
	const stateConfig = {
		planning: {
			text: '진행 전',
			dotColor: 'bg-[#2883DE]', // 파란색
		},
		in_progress: {
			text: '진행 중',
			dotColor: 'bg-[#FFEB63]', // 노란색
		},
		completed: {
			text: '완료',
			dotColor: 'bg-[#009444]', // 초록색
		},
		backlog: {
			text: '백로그',
			dotColor: 'bg-[#767676]', // 회색
		},
	}

	const config = stateConfig[state]

	return (
		<div
			className={`flex items-center justify-center gap-[4px] py-[3px] bg-neutral-000 shadow-[0_0_4px_0_rgba(154,92,235,0.2)] ${isCircular ? 'rounded-full px-[3px]' : 'rounded-[12px] pl-[9px] pr-[11px]'} border border-neutral-000 hover:border-primary-300-light transition-all duration-300`}
			onClick={onClick}
		>
			<div className={`w-[10px] h-[10px] rounded-full shrink-0 ${config.dotColor}`} />
			{!isCircular && <p className='body-2 text-neutral-700 font-medium text-center whitespace-nowrap'>{config.text}</p>}
		</div>
	)
}

export default StatusChip
