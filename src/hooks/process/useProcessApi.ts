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
import { postFile } from '@/api/process/file'
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

/** 주차 기준 프로세스 조회 (날짜 변경 시 이전 데이터 유지해 깜빡임 방지) */
export const useProcessWeekQuery = (projectId: string, startDate?: string, weeks?: string) => {
	return useQuery({
		queryKey: QUERY_KEY.process.week(projectId, startDate, weeks),
		queryFn: () => getProcessWeek(projectId, startDate, weeks),
		enabled: !!projectId,
		placeholderData: (previousData) => previousData,
	})
}

/** 프로세스(카드) 상세 조회 */
export const useProcessDetailQuery = (
	projectId: string,
	processId: string,
	options?: { enabled?: boolean }
) => {
	return useQuery({
		queryKey: QUERY_KEY.process.detail(projectId, processId),
		queryFn: () => getProcessDetail(projectId, processId),
		enabled: (options?.enabled !== false) && !!projectId && !!processId,
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

/** 프로젝트 파일 업로드 (프로세스 생성 시 첨부용) */
export const usePostFileMutation = () => {
	return useMutation({
		mutationFn: ({ projectId, body }: { projectId: string; body: FormData }) =>
			postFile(projectId, body),
	})
}

/** 프로세스(카드) 생성 */
export const usePostProcessMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ projectId, body }: { projectId: number; body: RequestProcessPostDto }) =>
			postProcess(projectId, body),
		onSuccess: (_, { projectId }) => {
			const pid = String(projectId)
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(pid) })
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.weekMission.all(pid) })
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
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.weekMission.all(projectId) })
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
