import { STATUS } from '@/constants/status'
import PlusIcon from '@/assets/icons/week-mission/plus.svg?react'
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'
import { useMissionModalStore } from '@/stores/mission-modal/missionModalStore'

interface TodoSectionProps {
	status: string
	children?: ReactNode
}

const TodoSection = ({ status, children }: TodoSectionProps) => {
	const colorConfig = STATUS[status as keyof typeof STATUS]
	const { openMissionModal } = useMissionModalStore()

	return (
		<div className={cn('flex flex-col gap-2 p-2', colorConfig.bgColor, 'rounded-16 w-full')}>
			{children}
			<button className='bg-[rgba(250,250,250,0.2)] border border-neutral-200 rounded-12 px-[12px] py-[10px] flex items-center gap-[6px] relative shadow-inner-neutral-2' onClick={() => {openMissionModal()}}>
				<PlusIcon className='w-4 h-4 shrink-0 stroke-neutral-700' />
				<p className='body-1 font-semibold text-neutral-900 whitespace-nowrap'>새 프로세스</p>
			</button>
		</div>
	)
}

export default TodoSection