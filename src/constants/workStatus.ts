export interface WorkStatusConfig {
	key: 'beforeProgress' | 'inProgress' | 'completed'
	label: string
	color: string
}

export const WORK_STATUS_CONFIG: WorkStatusConfig[] = [
	{
		key: 'beforeProgress',
		label: '진행 전',
		color: 'bg-status-complete',
	},
	{
		key: 'inProgress',
		label: '진행 중',
		color: 'bg-status-progress',
	},
	{
		key: 'completed',
		label: '완료',
		color: 'bg-status-success',
	},
] as const
