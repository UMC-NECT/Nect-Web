import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	getWeekMission,
	getMissionList,
	getMissionDetail,
	patchMissionStatus,
	patchTaskItem,
	deleteTaskItem,
	patchTaskItemsReorder,
} from '@/api/process/weekMission'
import type { RequestStatusPatchDto, RequestTaskPatchDto, RequestTaskItemsReorderPatchDto } from '@/types/api/process/weekMission'
import { QUERY_KEY } from '@/constants/key'

/** start_date 기준 위크미션 주차 목록 조회 (날짜 변경 시 이전 데이터 유지해 깜빡임 방지) */
export const useWeekMissionQuery = (projectId: string, weeks: string, startDate?: string) => {
	return useQuery({
		queryKey: QUERY_KEY.process.weekMission.week(projectId, startDate, weeks),
		queryFn: () => getWeekMission(projectId, weeks, startDate),
		enabled: !!projectId,
		placeholderData: (previousData) => previousData,
	})
}

/** 멤버형 모달용 미션(주차) 드롭다운 목록 조회 */
const MISSION_LIST_STALE_MS = 5 * 60 * 1000 // 5분

export const useMissionListQuery = (projectId: string) => {
	return useQuery({
		queryKey: QUERY_KEY.process.weekMission.missionList(projectId),
		queryFn: () => getMissionList(projectId),
		enabled: !!projectId,
		staleTime: MISSION_LIST_STALE_MS,
	})
}

/** 위크미션(프로세스) 상세 조회 (체크리스트 포함) */
export const useMissionDetailQuery = (
	projectId: string,
	processId: string,
	options?: { enabled?: boolean }
) => {
	return useQuery({
		queryKey: QUERY_KEY.process.weekMission.detail(projectId, processId),
		queryFn: () => getMissionDetail(projectId, processId),
		enabled: (options?.enabled !== false) && !!projectId && !!processId,
	})
}

/** 위크미션 프로세스 상태 변경 */
export const usePatchMissionStatusMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			body,
		}: {
			projectId: string
			processId: string
			body: RequestStatusPatchDto
		}) => patchMissionStatus(projectId, processId, body),
		onSuccess: (_, { projectId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.weekMission.all(projectId) })
		},
	})
}

/** 위크미션 TaskItem 수정 */
export const usePatchTaskItemMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			taskItemId,
			body,
		}: {
			projectId: string
			processId: string
			taskItemId: string
			body: RequestTaskPatchDto
		}) => patchTaskItem(projectId, processId, taskItemId, body),
		onSuccess: (_, { projectId, processId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.weekMission.all(projectId) })
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.weekMission.detail(projectId, processId) })
		},
	})
}

/** 위크미션 TaskItem 삭제 */
export const useDeleteTaskItemMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			taskItemId,
		}: {
			projectId: string
			processId: string
			taskItemId: string
		}) => deleteTaskItem(projectId, processId, taskItemId),
		onSuccess: (_, { projectId, processId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.weekMission.all(projectId) })
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.weekMission.detail(projectId, processId) })
		},
	})
}

/** 위크미션 TaskItem 정렬 순서 수정 */
export const usePatchTaskItemsReorderMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			body,
		}: {
			projectId: string
			processId: string
			body: RequestTaskItemsReorderPatchDto
		}) => patchTaskItemsReorder(projectId, processId, body),
		onSuccess: (_, { projectId, processId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.weekMission.all(projectId) })
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.weekMission.detail(projectId, processId) })
		},
	})
}