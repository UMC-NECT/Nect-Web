import WeekSelector from '@/components/week-mission/WeekSelector'
import MissionBoard from '@/components/week-mission/MissionBoard'
import { useMissionStore } from '@/stores/missionStore'
import { useTeamStore, getRoleDisplayName } from '@/stores/teamStore'
import { useWeekStore } from '@/stores/weekStore'
import StudioTitle from '@/components/common/StudioTitle'
import ScheduleAddIcon from '@/assets/icons/week-mission/schedule-add.svg?react'
import { useMissionModalStore } from '@/stores/mission-modal/missionModalStore'
import { useProjectIdStore } from '@/stores/useProjectIdStroe'
import { useProcessWeekQuery } from '@/hooks/process/useProcessApi'
import { useWeekMissionQuery, usePatchMissionStatusMutation } from '@/hooks/process/useWeekMissionApi'
import { getMissionList } from '@/api/process/weekMission'
import { useDeleteProcessMutation } from '@/hooks/process/useProcessApi'
import { usePartsQuery, useUsersQuery } from '@/hooks/project/useProjectApi'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import type { Mission } from '@/types/mission'
import type { Assignees } from '@/types/api/assignees'
import type { StatusType } from '@/types/api/status'
import { QUERY_KEY } from '@/constants/key'

const WeekMissionPage = () => {
	const { missions, updateMission, setMissions, removeMission } = useMissionStore()
	const { openMissionModal } = useMissionModalStore()
	const { roles, setRoles, setPersons } = useTeamStore()
	const { projectId } = useProjectIdStore()
	const { weekInfo } = useWeekStore()
	const queryClient = useQueryClient()
	const projectIdStr = projectId?.toString() ?? ''

	// weekStore 기준일(선택한 주의 월요일)에서 2주 전을 start_date로 사용, weeks 6으로 요청
	const baseDate = weekInfo?.dates?.[0] ? new Date(weekInfo.dates[0]) : new Date()
	baseDate.setDate(baseDate.getDate() - 14)
	const processWeekStartDate = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}-${String(baseDate.getDate()).padStart(2, '0')}`

	useProcessWeekQuery(projectIdStr, processWeekStartDate, '6')
	const { data: weekMission } = useWeekMissionQuery(projectIdStr, '6', processWeekStartDate)

	// 미션 모달 드롭다운용 리스트 미리 로드 (모달 열 때 캐시 사용)
	useEffect(() => {
		if (!projectIdStr) return
		queryClient.prefetchQuery({
			queryKey: QUERY_KEY.process.weekMission.missionList(projectIdStr),
			queryFn: () => getMissionList(projectIdStr),
		})
	}, [projectIdStr, queryClient])
	const { data: partsData } = usePartsQuery(projectIdStr)
	const { data: usersData } = useUsersQuery(projectIdStr)
	const patchStatusMutation = usePatchMissionStatusMutation()
	const deleteProcessMutation = useDeleteProcessMutation()

	useEffect(() => {
		if (!weekMission?.body?.missions?.length) return
		const list = weekMission.body.missions as (Mission & { assignee?: Assignees | Assignees[] })[]
		setMissions(
			list.map(m => ({
				...m,
				sectionIndex: 0,
				task: true,
				assignee: m.assignee != null ? (Array.isArray(m.assignee) ? m.assignee : [m.assignee]) : undefined,
			}))
		)
	}, [weekMission, setMissions])

	useEffect(() => {
		if (partsData?.body?.parts?.length) setRoles(partsData.body.parts)
	}, [partsData?.body?.parts, setRoles])

	useEffect(() => {
		if (!usersData?.body?.users?.length) return
		const storeRoles = useTeamStore.getState().roles
		const persons = usersData.body.users.map(u => {
			const roleId =
				storeRoles.find(
					r => r.part_label === u.part_label || r.custom_role_field_name === u.custom_role_field_name
				)?.part_id ?? 0
			return {
				id: u.user_id,
				name: u.name,
				roleId,
				image: u.profile_image_url ?? '',
			}
		})
		setPersons(persons)
	}, [usersData?.body?.users, setPersons])

	// 섹션 데이터 (teamStore의 roles = 파트 API 결과)
	const sections = roles.map(role => ({
		id: role.part_id,
		title: getRoleDisplayName(role),
	}))

	// 상태 변경 시 API 호출 후 로컬 반영
	const handleMissionUpdate = useCallback(
		(missionId: number, updates: { start_date?: string; dead_line?: string; sectionIndex?: number; status?: StatusType }) => {
			if (updates.status !== undefined) {
				patchStatusMutation.mutate(
					{
						projectId: projectIdStr,
						processId: String(missionId),
						body: { status: updates.status },
					},
					{
						onSuccess: () => {
							updateMission(missionId, updates)
						},
					}
				)
			} else {
				updateMission(missionId, updates)
			}
		},
		[projectIdStr, patchStatusMutation, updateMission]
	)

	// 삭제 시 API 호출 후 캐시 무효화 및 로컬 제거
	const handleDeleteMission = useCallback(
		(processId: number) => {
			deleteProcessMutation.mutate(
				{ projectId: projectIdStr, processId: String(processId) },
				{
					onSuccess: () => {
						queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.weekMission.all(projectIdStr) })
						removeMission(processId)
					},
				}
			)
		},
		[projectIdStr, deleteProcessMutation, queryClient, removeMission]
	)

	return (
		<div className='flex flex-col pt-16 pb-20'>
			{/* 페이지 타이틀 영역 */}
			<StudioTitle title='위크 미션 (Week Misson)' description='주간 미션을 설정하고 프로젝트 완주를 돕는 팀 스페이스' />

			{/* 주차 선택 및 뷰 타입 선택 영역 */}
			<div className='flex items-center justify-between pl-[72px] mt-[31px]'>
				<WeekSelector />
				<div className='flex items-center gap-4'>
					{/* 일정 추가 버튼 */}
					<button
						className='flex items-center justify-center p-1 bg-neutral-50 shadow-inner-neutral-2 rounded-[14px] w-10 h-10 hover:bg-neutral-100 transition-colors'
						onClick={() => openMissionModal()}
					>
						<ScheduleAddIcon className='w-6 h-6' />
					</button>
				</div>
			</div>

			{/* MissionBoard - useGetProjectUsers의 projectId로 기존 미션(processId) 클릭 시 모달에 상세 데이터 채움 */}
			<div className='w-full mt-6'>
				<MissionBoard
				missions={missions}
				sections={sections}
				projectId={projectIdStr}
				onMissionUpdate={handleMissionUpdate}
				onDeleteMission={handleDeleteMission}
			/>
			</div>
		</div>
	)
}

export default WeekMissionPage