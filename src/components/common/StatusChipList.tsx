import StatusChip from './StatusChip'
import { MISSION_STATUSES, type MissionStatus } from '@/types/missionStatus'

interface StatusChipListProps {
	onStatusChange?: (status: MissionStatus) => void
}

const StatusChipList = ({ onStatusChange }: StatusChipListProps) => {
	const handleWheel = (e: React.WheelEvent) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation()
	}

	const handleStatusClick = (status: MissionStatus) => {
		if (onStatusChange) {
			onStatusChange(status)
		}
	}

	return (
		<div
			className='bg-neutral-000 border border-neutral-200 rounded-[6px] shadow-[0px_6px_20px_0px_#e4e4e4] w-[102px] pb-[12px] pt-[10px] px-[14px]'
			onWheel={handleWheel}
			onMouseDown={handleMouseDown}
		>
			<div className='flex flex-col gap-[8px] items-start w-[74px]'>
				<p className='caption-1 text-neutral-500 font-medium'>상태 변경</p>
				<div className='flex flex-col gap-[10px] items-start w-full'>
					{MISSION_STATUSES.map((status, index) => (
						<StatusChip key={index} state={status} hover={true} onClick={() => handleStatusClick(status)} />
					))}
				</div>
			</div>
		</div>
	)
}

export default StatusChipList