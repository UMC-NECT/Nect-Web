import { useState } from 'react'
import WeekSelector from '@/components/week-mission/WeekSelector'
import SegmentsBar from '@/components/week-mission/SegmentsBar'
import MissionBoard from '@/components/week-mission/MissionBoard'
import { useMissionStore } from '@/stores/missionStore'
import StudioTitle from '@/components/common/StudioTitle'
import ScheduleAddIcon from '@/assets/icons/week-mission/schedule-add.svg?react'
import { TIME_SEGMENT } from '@/constants/TIME_SEGMENT'

const WeekMissionPage = () => {
	const { missions, updateMission } = useMissionStore()
	const [timeView, setTimeView] = useState(TIME_SEGMENT[0])

	// 섹션 데이터 (기본값)
	const sections = [
		{ id: 1, title: '기획' },
		{ id: 2, title: '디자인' },
		{ id: 3, title: '개발' },
	]

	return (
		<div className='flex flex-col py-8 pb-20'>
			{/* 페이지 타이틀 영역 */}
			<StudioTitle title='위크 미션 (Week Misson)' description='주간 미션을 설정하고 프로젝트 완주를 돕는 팀 스페이스' />

			{/* 주차 선택 및 뷰 타입 선택 영역 */}
			<div className='flex items-center justify-between pl-[72px] mt-8'>
				<WeekSelector />
				<div className='flex items-center gap-4'>
					{/* 일정 추가 버튼 */}
					<button className='flex items-center justify-center p-1 bg-neutral-50 shadow-[inset_-1px_2.5px_4px_0px_rgba(228,228,228,0.20)] rounded-[14px] w-10 h-10 hover:bg-neutral-100 transition-colors'>
						<ScheduleAddIcon className='w-6 h-6' />
					</button>
					{/* SegmentsBar */}
					<SegmentsBar
						segments={TIME_SEGMENT}
						defaultValue={timeView}
						onChange={value => setTimeView(value)}
					/>
				</div>
			</div>

			{/* MissionBoard */}
			<div className='w-full mt-6'>
				<MissionBoard missions={missions} sections={sections} onMissionUpdate={updateMission} />
			</div>
		</div>
	)
}

export default WeekMissionPage