import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postFeedback, deleteFeedback, patchFeedback } from '@/api/process/feedback'
import type { RequestFeedbackPatchDto, RequestFeedbackPostDto } from '@/types/api/process/feedback'
import { QUERY_KEY } from '@/constants/key'

/** 프로세스(카드)에 피드백 생성 */
export const usePostFeedbackMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			body,
		}: {
			projectId: string
			processId: string
			body: RequestFeedbackPostDto
		}) => postFeedback(projectId, processId, body),
		onSuccess: (_, { projectId, processId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.detail(projectId, processId) })
		},
	})
}

/** 피드백 삭제 */
export const useDeleteFeedbackMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			feedbackId,
		}: {
			projectId: string
			processId: string
			feedbackId: string
		}) => deleteFeedback(projectId, processId, feedbackId),
		onSuccess: (_, { projectId, processId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.detail(projectId, processId) })
		},
	})
}

/** 피드백 내용 수정 */
export const usePatchFeedbackMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			feedbackId,
			body,
		}: {
			projectId: string
			processId: string
			feedbackId: string
			body: RequestFeedbackPatchDto
		}) => patchFeedback(projectId, processId, feedbackId, body),
		onSuccess: (_, { projectId, processId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.detail(projectId, processId) })
		},
	})
}
