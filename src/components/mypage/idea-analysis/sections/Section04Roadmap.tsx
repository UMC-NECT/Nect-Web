import type { AnalysisType } from '@/types/api/mypage'
import WeeklyRoadmapSection from '@/components/common/WeeklyRoadmapSection'

interface Section04RoadmapProps {
	analysisData: AnalysisType
}

const Section04Roadmap = ({ analysisData }: Section04RoadmapProps) => {
	const roadmapItems = analysisData.weekly_roadmap.map(plan => ({
		week: String(plan.week_number),
		title: plan.week_title,
		role_tasks: plan.role_tasks,
	}))

	return (
		<div className='flex flex-col gap-4.5 w-full'>
			{/* 타이틀 */}
			<div className='flex items-center gap-3 w-full'>
				<span className='heading-3 font-bold text-neutral-900 text-center w-9.5'>04</span>
				<span className='title-2 font-bold text-primary-600-normal h-7.5 w-full'>주차별 로드맵을 생성했어요!</span>
			</div>

			<div className='pl-12.5 w-full'>
				<WeeklyRoadmapSection roadmapItems={roadmapItems} />
			</div>
		</div>
	)
}

export default Section04Roadmap
