import WeekSelector from '@/components/week-mission/WeekSelector'
import MissionBoard from '@/components/week-mission/MissionBoard'
import { useMissionStore } from '@/stores/missionStore'
import { useTeamStore, getRoleDisplayName } from '@/stores/teamStore'
import { useWeekStore } from '@/stores/weekStore'
import StudioTitle from '@/components/common/StudioTitle'
import ScheduleAddIcon from '@/assets/icons/week-mission/schedule-add.svg?react'
import { useMissionModalStore } from '@/stores/mission-modal/missionModalStore'
import { useWorkspaceProjectId } from '@/hooks/useWorkspaceProjectId'
import { useProcessWeekQuery } from '@/hooks/process/useProcessApi'
import { useWeekMissionQuery } from '@/hooks/process/useWeekMissionApi'
import type { WeekMissionItem } from '@/types/api/process/weekMission'
import type {
	ProcessWeekProcessItem,
	ProcessWeekWeekItem,
	RequestProcessOrderPatchDto,
} from '@/types/api/process/process'
import { getMissionList } from '@/api/process/weekMission'
import { useDeleteProcessMutation, usePatchProcessMutation, usePatchProcessOrderMutation, usePatchProcessStatusMutation } from '@/hooks/process/useProcessApi'
import { usePartsQuery, useUsersQuery } from '@/hooks/project/useProjectApi'
import { useGetProfileQuery } from '@/hooks/auth/useUsersApi'
import { useProjectLeaderStore } from '@/stores/projectLeaderStore'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import type { Mission } from '@/types/mission'
import type { Assignees } from '@/types/api/assignees'
import type { StatusType } from '@/types/api/status'
import { QUERY_KEY } from '@/constants/key'
import LoadingModal from '@/components/splash/LoadingModal'

/** API 날짜(YYYY-MM-DD) → 보드 표시(YYYY.MM.DD) */
const formatDateForBoard = (dateStr: string) => (dateStr ? dateStr.replace(/-/g, '.') : '')

/** 보드 날짜(YYYY.MM.DD) → API(YYYY-MM-DD) */
const formatDateToApi = (dateStr: string) => (dateStr ? dateStr.replace(/\./g, '-') : '')

/** 위크미션 조회 body.missions → Mission[] (전부 위크미션 Task 행, sectionIndex 0) */
function buildMissionsFromWeekMission(missionsFromApi: WeekMissionItem[]): Mission[] {
	return missionsFromApi.map((m): Mission => {
		const assigneeList: Assignees[] =
			m.assignee != null
				? [
						{
							user_id: m.assignee.user_id,
							name: m.assignee.nickname,
							nickname: m.assignee.nickname,
							profile_image_url: m.assignee.profile_image_url ?? '',
						},
					]
				: []
		return {
			process_id: m.process_id,
			mission_number: m.mission_number,
			title: m.title ?? '',
			start_date: formatDateForBoard(m.start_date),
			dead_line: formatDateForBoard(m.dead_line),
			left_day: m.left_day ?? 0,
			status: (m.status as StatusType) ?? 'PLANNING',
			progressCompleted: m.done_count ?? 0,
			progressTotal: m.total_count ?? 0,
			sectionIndex: 0,
			task: true,
			assignee: assigneeList.length > 0 ? assigneeList : undefined,
		}
	})
}

/** 프로세스 week API body.weeks → Mission[] (common_lane=0행, by_field=field_name으로 행 매핑) */
function buildMissionsFromProcessWeeks(
	weeks: ProcessWeekWeekItem[],
	sections: { id: number; title: string; role_field: string | null }[]
): Mission[] {
	const missions: Mission[] = []
	const toMission = (item: ProcessWeekProcessItem, sectionIndex: number): Mission => {
		const raw = item.assignee
		const assignees: Assignees[] =
			raw != null
				? (Array.isArray(raw)
						? raw.map(a => ({
								user_id: a.user_id,
								name: a.user_name ?? a.nickname,
								nickname: a.nickname,
								profile_image_url: a.user_image ?? '',
							}))
						: [])
				: []
		return {
			process_id: item.process_id,
			title: item.title ?? '',
			start_date: formatDateForBoard(item.start_date),
			dead_line: formatDateForBoard(item.dead_line),
			status: (item.process_status as StatusType) ?? 'PLANNING',
			mission_number: item.mission_number ?? 0,
			progressCompleted: item.complete_check_list ?? 0,
			progressTotal: item.whole_check_list ?? 0,
			left_day: item.left_day ?? 0,
			sectionIndex,
			task: sectionIndex === 0,
			assignee: assignees.length > 0 ? assignees : undefined,
		}
	}
	weeks.forEach(week => {
		;(week.common_lane ?? []).forEach(item => missions.push(toMission(item, 0)))
		;(week.by_field ?? []).forEach(fieldGroup => {
			const partIndex = sections.findIndex(
				s =>
					s.role_field === fieldGroup.field_name ||
					s.role_field === fieldGroup.field_id.replace(/^ROLE:/, '')
			)
			const sectionIndex = partIndex >= 0 ? partIndex + 1 : 0
			fieldGroup.processes.forEach(item => missions.push(toMission(item, sectionIndex)))
		})
	})
	return missions
}

const WeekMissionPage = () => {
	const { missions, updateMission, setMissions, removeMission } = useMissionStore()
	const { openMissionModal } = useMissionModalStore()
	const { roles, setRoles, setPersons } = useTeamStore()
	const { projectIdStr } = useWorkspaceProjectId({ redirectIfMissing: true })
	const { weekInfo } = useWeekStore()
	const queryClient = useQueryClient()

	// weekStore 기준일(선택한 주의 월요일)에서 2주 전을 start_date로 사용, weeks 6으로 요청
	const baseDate = weekInfo?.dates?.[0] ? new Date(weekInfo.dates[0]) : new Date()
	baseDate.setDate(baseDate.getDate() - 14)
	const processWeekStartDate = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}-${String(baseDate.getDate()).padStart(2, '0')}`

	const { data: processWeekData, isLoading: isProcessWeekLoading, isFetching: isProcessWeekFetching } = useProcessWeekQuery(
		projectIdStr,
		processWeekStartDate,
		'6'
	)
	const { data: weekMissionData, isLoading: isWeekMissionLoading, isFetching: isWeekMissionFetching } = useWeekMissionQuery(
		projectIdStr,
		'6',
		processWeekStartDate
	)

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
	const { data: profileData } = useGetProfileQuery()
	const isLeader = useProjectLeaderStore(s => s.isLeader)
	const setIsLeader = useProjectLeaderStore(s => s.setIsLeader)
	const patchProcessStatusMutation = usePatchProcessStatusMutation()
	const patchProcessMutation = usePatchProcessMutation()
	const patchProcessOrderMutation = usePatchProcessOrderMutation()
	const deleteProcessMutation = useDeleteProcessMutation()

	// 위크미션 API + 프로세스 week API 둘 다 반영해서 미션 보드 렌더링
	useEffect(() => {
		const fromWeekMission = buildMissionsFromWeekMission(
			weekMissionData?.body?.missions ?? []
		)
		const sectionList = roles.map(r => ({
			id: r.part_id,
			title: getRoleDisplayName(r),
			role_field: r.role_field ?? r.custom_role_field_name ?? null,
		}))
		const fromProcessWeek = buildMissionsFromProcessWeeks(
			processWeekData?.body?.weeks ?? [],
			sectionList
		)
		const combined = [...fromWeekMission, ...fromProcessWeek]
		setMissions(combined)
	}, [
		weekMissionData?.body?.missions,
		processWeekData?.body?.weeks,
		roles,
		setMissions,
	])

	useEffect(() => {
		if (partsData?.body?.parts?.length) setRoles(partsData.body.parts)
	}, [partsData?.body?.parts, setRoles])

	// 현재 유저가 프로젝트 멤버이며 member_type이 LEADER인지 체크하여 store에 설정
	useEffect(() => {
		const myUserId = profileData?.body?.userId
		const users = usersData?.body?.users ?? []
		if (myUserId == null || users.length === 0) {
			setIsLeader(false)
			return
		}
		const me = users.find(u => u.user_id === myUserId)
		setIsLeader(me?.member_type === 'LEADER')
	}, [profileData?.body?.userId, usersData?.body?.users, setIsLeader])

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
		role_field: role.role_field ?? null,
		required_count: role.required_count ?? 0,
	}))

	// 상태 변경 / 드래그·리사이즈(날짜 변경) 시 API 호출 후 로컬 반영
	const handleMissionUpdate = useCallback(
		(missionId: number, updates: { start_date?: string; dead_line?: string; sectionIndex?: number; status?: StatusType }) => {
			if (updates.status !== undefined) {
				patchProcessStatusMutation.mutate(
					{
						projectId: projectIdStr,
						processId: String(missionId),
						body: { status: updates.status },
					},
					{
						onSuccess: () => {
							queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.weekMission.all(projectIdStr) })
							updateMission(missionId, updates)
						},
					}
				)
				return
			}
			// 드래그(블록 이동) 시 order API 사용 — sectionIndex가 넘어오면 드래그로 간주
			if (updates.sectionIndex !== undefined && (updates.start_date !== undefined || updates.dead_line !== undefined)) {
				const mission = missions.find(m => m.process_id === missionId)
				if (!mission) return

				const destSectionIndex = updates.sectionIndex
				const isSameLane = mission.sectionIndex === destSectionIndex

				// lane_key = 드롭한 목적지 레인
				const laneKey =
					destSectionIndex === 0
						? 'COMMON'
						: roles[destSectionIndex - 1]?.role_field
							? `ROLE:${roles[destSectionIndex - 1].role_field}`
							: roles[destSectionIndex - 1]?.custom_role_field_name
								? `CUSTOM:${roles[destSectionIndex - 1].custom_role_field_name}`
								: 'COMMON'

				const startDate = updates.start_date ?? mission.start_date
				const deadLine = updates.dead_line ?? mission.dead_line

				// ordered_process_ids = 목적지 레인 전체 리스트(이동한 카드 포함, start_date 기준 정렬)
				const otherInSection = missions.filter(
					m => m.sectionIndex === destSectionIndex && m.process_id !== missionId
				)
				const withMoved = [
					...otherInSection.map(m => ({ process_id: m.process_id, start_date: m.start_date })),
					{ process_id: missionId, start_date: startDate },
				]
				withMoved.sort((a, b) => (a.start_date < b.start_date ? -1 : a.start_date > b.start_date ? 1 : 0))
				const ordered_process_ids = withMoved.map(m => m.process_id)

				const destPart = destSectionIndex >= 1 ? roles[destSectionIndex - 1] : null
				const body: RequestProcessOrderPatchDto = {
					status: mission.status,
					lane_key: laneKey,
					ordered_process_ids,
					mission_number: mission.mission_number,
					start_date: formatDateToApi(startDate),
					dead_line: formatDateToApi(deadLine),
				}
				// B) 레인 간 이동 시에만 role_fields/custom_fields 목적지 레인에 맞게 전달. A) 같은 레인 내 순서만 변경 시 미전송
				if (!isSameLane && destPart) {
					body.role_fields = destPart.role_field != null && destPart.role_field !== '' ? [destPart.role_field] : []
					body.custom_fields = destPart.custom_role_field_name != null && destPart.custom_role_field_name !== '' ? [destPart.custom_role_field_name] : []
				}

				patchProcessOrderMutation.mutate(
					{
						projectId: projectIdStr,
						processId: String(missionId),
						body,
					},
					{
						onSuccess: () => {
							queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.weekMission.all(projectIdStr) })
							queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectIdStr) })
							updateMission(missionId, updates)
						},
					}
				)
				return
			}

			// 리사이즈(기간만 변경) 시 기존 PATCH
			if (updates.start_date !== undefined || updates.dead_line !== undefined) {
				const mission = missions.find(m => m.process_id === missionId)
				if (!mission) return

				const body: { start_date?: string; dead_line?: string } = {}
				if (updates.start_date !== undefined) body.start_date = formatDateToApi(updates.start_date)
				if (updates.dead_line !== undefined) body.dead_line = formatDateToApi(updates.dead_line)
				if (Object.keys(body).length === 0) return

				patchProcessMutation.mutate(
					{
						projectId: projectIdStr,
						processId: String(missionId),
						body,
					},
					{
						onSuccess: () => {
							queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.weekMission.all(projectIdStr) })
							queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectIdStr) })
							updateMission(missionId, updates)
						},
					}
				)
				return
			}
			updateMission(missionId, updates)
		},
		[
			projectIdStr,
			missions,
			roles,
			queryClient,
			patchProcessStatusMutation,
			patchProcessMutation,
			patchProcessOrderMutation,
			updateMission,
		]
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
	const isLoading = isProcessWeekLoading || isWeekMissionLoading
	const isFetchingWeek = isProcessWeekFetching || isWeekMissionFetching

	return (
		<div className='flex flex-col pt-16 px-13.5'>
			{isLoading && <LoadingModal />}
			{/* 페이지 타이틀 영역 */}
			<StudioTitle title='위크 미션 (Week Misson)' description='주간 미션을 설정하고 프로젝트 완주를 돕는 팀 스페이스' />

			{/* 주차 선택 및 뷰 타입 선택 영역 */}
			<div className='flex items-center justify-between pl-[72px] mt-[31px]'>
				<div className='flex items-center gap-2'>
					<WeekSelector />
					{isFetchingWeek && !isLoading && (
						<span className='inline-block w-4 h-4 border-2 border-neutral-300 border-t-primary-500-normal rounded-full animate-spin' aria-hidden />
					)}
				</div>
				<div className='flex items-center gap-4'>
					{/* 일정 추가 버튼 (리더만 표시) */}
					{isLeader && (
						<button
							className='flex items-center justify-center p-1 bg-neutral-50 shadow-inner-neutral-2 rounded-[14px] w-10 h-10 hover:bg-neutral-100 transition-colors'
							onClick={() => openMissionModal()}
						>
							<ScheduleAddIcon className='w-6 h-6' />
						</button>
					)}
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
				isTaskEditable={isLeader}
			/>
			</div>
		</div>
	)
}

export default WeekMissionPage