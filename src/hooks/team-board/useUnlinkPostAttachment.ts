import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unlinkPostAttachment } from '@/api/team-board/boards'

/**
 * 게시글 첨부파일을 해제하는 hook
 * @param projectId - 프로젝트 ID
 * @param postId - 게시글 ID
 */
export const useUnlinkPostAttachmentMutation = (projectId: number, postId: number | null) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (documentId: number) => {
			if (!postId) {
				throw new Error('Post ID is required')
			}
			return unlinkPostAttachment(projectId, postId, documentId)
		},
		onSuccess: () => {
			// 첨부 해제 후 관련 데이터 refetch
			if (postId) {
				queryClient.invalidateQueries({ queryKey: ['postDetail', projectId, postId] })
			}
			queryClient.invalidateQueries({ queryKey: ['postList', projectId] })
		},
	})
}
