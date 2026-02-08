import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	postProcess,
	getProcessPart,
	getProcessWeek,
	getProcessDetail,
	getProgressSummary,
	deleteProcess,
	patchProcess,
	patchProcessOrder,
	patchProcessStatus,
	getProcessHistory,
} from '@/api/process/process'
import type {
	RequestProcessOrderPatchDto,
	RequestProcessPatchDto,
	RequestProcessPostDto,
	RequestProcessStatusPatchDto,
} from '@/types/api/process/process'
import { QUERY_KEY } from '@/constants/key'

/** 파트(분야)별 작업 현황 조회 */
export const useProcessPartQuery = (projectId: string, fieldId?: string) => {
	return useQuery({
		queryKey: QUERY_KEY.process.part(projectId, fieldId),
		queryFn: () => getProcessPart(projectId, fieldId),
		enabled: !!projectId,
	})
}

/** 주차 기준 프로세스 조회 */
export const useProcessWeekQuery = (projectId: string, startDate?: string) => {
	return useQuery({
		queryKey: QUERY_KEY.process.week(projectId, startDate),
		queryFn: () => getProcessWeek(projectId, startDate),
		enabled: !!projectId,
	})
}

/** 프로세스(카드) 상세 조회 */
export const useProcessDetailQuery = (projectId: string, processId: string) => {
	return useQuery({
		queryKey: QUERY_KEY.process.detail(projectId, processId),
		queryFn: () => getProcessDetail(projectId, processId),
		enabled: !!projectId && !!processId,
	})
}

/** 레인별 프로세스 진행률 요약 조회 (PLANNING / IN_PROGRESS / DONE) */
export const useProgressSummaryQuery = (projectId: string) => {
	return useQuery({
		queryKey: QUERY_KEY.process.progressSummary(projectId),
		queryFn: () => getProgressSummary(projectId),
		enabled: !!projectId,
	})
}

/** 프로세스(카드) 생성 */
export const usePostProcessMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ projectId, body }: { projectId: number; body: RequestProcessPostDto }) =>
			postProcess(projectId, body),
		onSuccess: (_, { projectId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(String(projectId)) })
		},
	})
}

/** 프로세스(카드) 삭제 */
export const useDeleteProcessMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ projectId, processId }: { projectId: string; processId: string }) =>
			deleteProcess(projectId, processId),
		onSuccess: (_, { projectId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
		},
	})
}

/** 프로세스(카드) 기본 정보 수정 */
export const usePatchProcessMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			body,
		}: {
			projectId: string
			processId: string
			body: RequestProcessPatchDto
		}) => patchProcess(projectId, processId, body),
		onSuccess: (_, { projectId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
		},
	})
}

/** 프로세스 정렬/이동 저장 */
export const usePatchProcessOrderMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			body,
		}: {
			projectId: string
			processId: string
			body: RequestProcessOrderPatchDto
		}) => patchProcessOrder(projectId, processId, body),
		onSuccess: (_, { projectId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
		},
	})
}

/** 프로세스 작업 상태 변경 */
export const usePatchProcessStatusMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			body,
		}: {
			projectId: string
			processId: string
			body: RequestProcessStatusPatchDto
		}) => patchProcessStatus(projectId, processId, body),
		onSuccess: (_, { projectId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
		},
	})
}

/** 프로젝트의 히스토리를 조회합니다. */
export const useProcessHistoryQuery = (projectId: string, cursor?: number) => {
	return useQuery({
		queryKey: QUERY_KEY.process.history(projectId, cursor),
		queryFn: () => getProcessHistory(projectId, cursor),
		enabled: !!projectId,
	})
}
