import StatusChip from './StatusChip'
import { MISSION_STATUSES } from '@/types/missionStatus'

const StatusChipList = () => {
	return (
		<div className='bg-neutral-000 border border-neutral-200 rounded-[6px] shadow-[0px_6px_20px_0px_#e4e4e4] w-[102px] pb-[12px] pt-[10px] px-[14px]'>
			<div className='flex flex-col gap-[8px] items-start w-[74px]'>
				<p className='caption-1 text-neutral-500 font-medium'>:: 상태 변경</p>
				<div className='flex flex-col gap-[10px] items-start w-full'>
					{MISSION_STATUSES.map((status, index) => (
						<StatusChip key={index} state={status} />
					))}
				</div>
			</div>
		</div>
	)
}

export default StatusChipList