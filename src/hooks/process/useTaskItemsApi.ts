import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	postTaskItems,
	patchTaskItemsOrder,
	deleteTaskItems,
	patchTaskItems,
} from '@/api/process/taskItems'
import type {
	RequestTaskItemsOrderPatchDto,
	RequestTaskItemsPatchDto,
	RequestTaskItemsPostDto,
} from '@/types/api/process/taskItems'
import { QUERY_KEY } from '@/constants/key'

/** 프로세스(카드)에 업무 항목(TaskItem) 생성 */
export const usePostTaskItemsMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			body,
		}: {
			projectId: string
			processId: string
			body: RequestTaskItemsPostDto
		}) => postTaskItems(projectId, processId, body),
		onSuccess: (_, { projectId, processId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.detail(projectId, processId) })
		},
	})
}

/** 업무 항목 정렬 순서 저장 (드래그&드롭 결과) */
export const usePatchTaskItemsOrderMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			body,
		}: {
			projectId: string
			processId: string
			body: RequestTaskItemsOrderPatchDto
		}) => patchTaskItemsOrder(projectId, processId, body),
		onSuccess: (_, { projectId, processId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.detail(projectId, processId) })
		},
	})
}

/** 업무 항목(TaskItem) 삭제 */
export const useDeleteTaskItemsMutation = () => {
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
		}) => deleteTaskItems(projectId, processId, taskItemId),
		onSuccess: (_, { projectId, processId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.detail(projectId, processId) })
		},
	})
}

/** 업무 항목(TaskItem) 내용/완료여부/정렬순서 수정 */
export const usePatchTaskItemsMutation = () => {
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
			body: RequestTaskItemsPatchDto
		}) => patchTaskItems(projectId, processId, taskItemId, body),
		onSuccess: (_, { projectId, processId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.detail(projectId, processId) })
		},
	})
}
