import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	postAttachmentFile,
	postAttachmentLinks,
	postUploadAttachmentFile,
	deleteAttachmentFile,
	deleteAttachmentLink,
} from '@/api/process/attachment'
import type {
	RequestAttachmentFilePostDto,
	RequestAttachmentLinksPostDto,
	RequestUploadAttachment,
} from '@/types/api/process/attachment'
import { QUERY_KEY } from '@/constants/key'

/** 프로세스(카드)에 파일 첨부 */
export const usePostAttachmentFileMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			body,
		}: {
			projectId: string
			processId: string
			body: RequestAttachmentFilePostDto
		}) => postAttachmentFile(projectId, processId, body),
		onSuccess: (_, { projectId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
		},
	})
}

/** 프로세스(카드)에 링크 추가 */
export const usePostAttachmentLinksMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			body,
		}: {
			projectId: string
			processId: string
			body: RequestAttachmentLinksPostDto
		}) => postAttachmentLinks(projectId, processId, body),
		onSuccess: (_, { projectId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
		},
	})
}

/** 프로세스(카드) 모달에서 파일 업로드 후 즉시 첨부 */
export const usePostUploadAttachmentFileMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			body,
		}: {
			projectId: string
			processId: string
			body: RequestUploadAttachment
		}) => postUploadAttachmentFile(projectId, processId, body),
		onSuccess: (_, { projectId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
		},
	})
}

/** 프로세스(카드) 첨부 파일 해제 */
export const useDeleteAttachmentFileMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			fileId,
		}: {
			projectId: string
			processId: string
			fileId: number
		}) => deleteAttachmentFile(projectId, processId, fileId),
		onSuccess: (_, { projectId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
		},
	})
}

/** 프로세스(카드) 등록 링크 삭제 */
export const useDeleteAttachmentLinkMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			projectId,
			processId,
			linkId,
		}: {
			projectId: string
			processId: string
			linkId: number
		}) => deleteAttachmentLink(projectId, processId, linkId),
		onSuccess: (_, { projectId }) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.process.list(projectId) })
		},
	})
}
