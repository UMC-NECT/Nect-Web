import WeekSelector from '@/components/week-mission/WeekSelector'
import MissionBoard from '@/components/week-mission/MissionBoard'
import { useMissionStore } from '@/stores/missionStore'
import { useTeamStore } from '@/stores/teamStore'
import StudioTitle from '@/components/common/StudioTitle'
import ScheduleAddIcon from '@/assets/icons/week-mission/schedule-add.svg?react'
import { useMissionModalStore } from '@/stores/mission-modal/missionModalStore'

const WeekMissionPage = () => {
	const { missions, updateMission } = useMissionStore()
	const { openMissionModal } = useMissionModalStore()
	const { roles } = useTeamStore()

	// 섹션 데이터 (teamStore의 roles 사용)
	const sections = roles.map(role => ({
		id: role.id,
		title: role.name,
	}))

	return (
		<div className='flex flex-col pt-16 pb-20'>
			{/* 페이지 타이틀 영역 */}
			<StudioTitle title='위크 미션 (Week Misson)' description='주간 미션을 설정하고 프로젝트 완주를 돕는 팀 스페이스' />

			{/* 주차 선택 및 뷰 타입 선택 영역 */}
			<div className='flex items-center justify-between pl-[72px] mt-[31px]'>
				<WeekSelector />
				<div className='flex items-center gap-4'>
					{/* 일정 추가 버튼 */}
					<button className='flex items-center justify-center p-1 bg-neutral-50 shadow-inner-neutral-2 rounded-[14px] w-10 h-10 hover:bg-neutral-100 transition-colors' onClick={() => openMissionModal()}>
						<ScheduleAddIcon className='w-6 h-6' />
					</button>
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