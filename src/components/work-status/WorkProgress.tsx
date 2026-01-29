import type { Progress } from '@/types/progress'

interface WorkProgressProps {
	title: string
	progress: Progress
}

const WorkProgress = ({ title, progress }: WorkProgressProps) => {
	const { planning, inProgress, completed } = progress
	const total = planning + inProgress + completed

	// 각 상태별 비율 계산
	const planningRatio = total > 0 ? planning / total : 0
	const inProgressRatio = total > 0 ? inProgress / total : 0
	const completedRatio = total > 0 ? completed / total : 0

	return (
		<div className='flex flex-col gap-1.5 items-start relative w-full'>
			{/* 제목 */}
			<p className='body-1 font-semibold text-neutral-900 relative shrink-0'>{title}</p>

			{/* 프로그레스 바 */}
			<div className='flex w-full h-[8px] gap-0 items-start relative rounded-[20px] overflow-hidden'>
                {/* Completed (완료) */}
                {completed > 0 && (
                    <div
                    className='h-full bg-primary-500-normal'
                    style={{ width: `${completedRatio * 100}%` }}
                    />
                )}
                {/* In Progress (진행 중) */}
                {inProgress > 0 && (
                    <div
                        className='h-full bg-primary-300-light'
                        style={{ width: `${inProgressRatio * 100}%` }}
                    />
                )}

                {/* Planning (진행 전) */}
				{planning > 0 && (
					<div
						className='h-full bg-primary-150-light'
						style={{ width: `${planningRatio * 100}%` }}
					/>
				)}
			</div>
		</div>
	)
}

export default WorkProgress