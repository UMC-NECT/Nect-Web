interface PlanTagProps {
	state: 'planning' | 'in_progress' | 'completed'
}

const PlanTag = ({ state }: PlanTagProps) => {
	const stateConfig = {
		planning: {
			text: '계획 중',
			dotColor: 'bg-[#3B82F6]', // 파란색
		},
		in_progress: {
			text: '진행 중',
			dotColor: 'bg-[#FBBF24]', // 노란색
		},
		completed: {
			text: '완료',
			dotColor: 'bg-[#10B981]', // 초록색
		},
	}

	const config = stateConfig[state]

	return (
		<div className="flex items-center justify-center gap-1 pl-[9px] pr-[11px] py-[3px] bg-neutral-000 border border-primary-300-light rounded-[12px]">
			<div className={`w-[10px] h-[10px] rounded-full shrink-0 ${config.dotColor}`} />
			<p className="body-2 text-neutral-700 font-medium text-center whitespace-nowrap">
				{config.text}
			</p>
		</div>
	)
}

export default PlanTag