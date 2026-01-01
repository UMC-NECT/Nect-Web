import MissonPart_Title from '@/components/week-mission/MissonPart_Title'
import SegmentsBar from '@/components/week-mission/SegmentsBar'
import PlanTag from '@/components/common/PlanTag'
import MissionCard from '@/components/week-mission/MissionCard'
import WeekSelector from '@/components/week-mission/WeekSelector'
import WeekDates from '@/components/week-mission/WeekDates'

const MainPage = () => {
	return (
		<div>
			<MissonPart_Title title='프로젝트 목표' isGoal />
			<MissonPart_Title title='기획' />
			<SegmentsBar segments={['Week', 'Month', 'Year']} />
			<SegmentsBar segments={['Week', 'Month', 'Year']} editable />
			<div className='flex flex-col items-start gap-2'>
				<PlanTag state='planning' />
				<PlanTag state='in_progress' />
				<PlanTag state='completed' />
			</div>
			<MissionCard
				isGoal
				missionNumber={1}
				title='Mission 1'
				progress={0}
				createdAt='2025.11.17'
				dueDate='2025.11.30'
				daysRemaining={13}
				status='planning'
			/>
			<MissionCard
				missionNumber={2}
				title='Mission 2'
				progress={1}
				createdAt='2025.11.17'
				dueDate='2025.11.30'
				daysRemaining={13}
				status='in_progress'
			/>
			<WeekSelector />
			<WeekDates />
		</div>
	)
}

export default MainPage
