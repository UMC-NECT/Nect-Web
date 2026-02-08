import ChevronDownIcon from '@/assets/icons/common/chevron-down.svg?react'
import ChevronUpIcon from '@/assets/icons/common/chevron-up.svg?react'
import type { AnalysisType } from '@/types/api/mypage'

interface Section04RoadmapProps {
	analysisData: AnalysisType
	openWeeks: number[]
	toggleWeek: (weekNumber: number) => void
}

const Section04Roadmap = ({ analysisData, openWeeks, toggleWeek }: Section04RoadmapProps) => {
	return (
		<div className='flex flex-col gap-4.5 w-full'>
			{/* 타이틀 */}
			<div className='flex items-center gap-3 w-full'>
				<span className='heading-3 font-bold text-neutral-900 text-center w-9.5'>04</span>
				<span className='title-2 font-bold text-primary-600-normal h-7.5 w-full'>주차별 로드맵을 생성했어요!</span>
			</div>

			<div className='flex flex-col pl-12.5 w-full'>
				{analysisData.weekly_roadmap.map((plan, index) => {
					const isOpen = openWeeks.includes(plan.week_number)
					const isLast = index === analysisData.weekly_roadmap.length - 1

					return (
						<div key={plan.week_number} className='flex gap-3.5'>
							{/* n주차 */}
							<div className='flex flex-col items-center'>
								{index === 0 ? (
									<div className='min-h-3.5' />
								) : (
									<div className='w-0 min-h-3.5 border-l-2 border-dashed border-primary-300-light' />
								)}
								<div className='flex items-center justify-center bg-primary-500-normal rounded-6 px-2.5 py-1 min-w-10 shadow-drop-neutral-3'>
									<span className='body-1 font-medium text-neutral-000 text-center whitespace-nowrap'>
										{plan.week_number}
										<span className='ml-0.5'>주차</span>
									</span>
								</div>
								{!isLast && (
									<div className='w-0 flex-1 border-l-2 border-dashed border-primary-300-light min-h-[24px]' />
								)}
							</div>

							{/* 컨텐츠 */}
							<div className='flex flex-col flex-1 pb-4'>
								<button
									type='button'
									onClick={() => toggleWeek(plan.week_number)}
									className={`flex items-center justify-between bg-neutral-000 px-5.5 py-4 w-full ${
										isOpen ? 'rounded-t-12' : 'rounded-12'
									}`}
								>
									<span className='title-3 font-semibold text-neutral-900'>{plan.week_title}</span>
									<div className='flex items-center justify-center w-7 h-7'>
										{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
									</div>
								</button>
								{isOpen && (
									<div className='flex flex-col bg-primary-50-light border border-primary-200-light rounded-b-12 px-5.5 py-4 w-full gap-2'>
										{plan.role_tasks.map((task, taskIndex) => (
											<div key={taskIndex} className='flex gap-1 font-semibold text-[16px] tracking-[180%]'>
												<span className='text-primary-500-normal'>{task.role_field_display_name}</span>
												&nbsp;
												<span className='text-neutral-800'>{task.tasks}</span>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Section04Roadmap
