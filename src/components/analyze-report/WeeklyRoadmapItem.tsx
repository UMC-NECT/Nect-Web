import arrowUp from '@/assets/icons/common/chevron-up.svg'
import arrowDown from '@/assets/icons/common/chevron-down.svg'
import type { WeeklyRoadmapRoleTask } from '@/types/api/analysis'

interface WeeklyRoadmapItemProps {
	title: string
	role_tasks: WeeklyRoadmapRoleTask[]
	isExpanded: boolean
	onToggle: () => void
}

const WeeklyRoadmapItem = ({ title, role_tasks, isExpanded, onToggle }: WeeklyRoadmapItemProps) => {
	return (
		<>
			<button
				onClick={onToggle}
				className={`bg-white p-4 flex items-center justify-between cursor-pointer w-full h-[60px] transition-all duration-300 ${
					isExpanded ? 'rounded-t-xl ' : 'rounded-xl'
				}`}
			>
				<span className='title-3 font-semibold text-neutral-900'>{title}</span>
				<img src={isExpanded ? arrowUp : arrowDown} alt='toggle' className='w-5 h-5' />
			</button>
			<div
				className='overflow-hidden transition-all duration-300 ease-in-out'
				style={{ maxHeight: isExpanded ? 500 : 0, opacity: isExpanded ? 1 : 0 }}
			>
				<div className='flex flex-col gap-2 bg-primary-50-light border border-primary-200-light rounded-b-xl py-4 px-5.5 shadow-inner-neutral-1'>
					{role_tasks.map(task => (
						<div key={task.role_field} className='flex gap-1'>
							<span className='body-1 font-semibold text-primary-500-normal'>[{task.role_field_display_name}]</span>
							<span className='body-1 font-medium text-neutral-800'>{task.tasks}</span>
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default WeeklyRoadmapItem;