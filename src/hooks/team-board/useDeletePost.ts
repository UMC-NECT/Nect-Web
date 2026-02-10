import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost } from '@/api/team-board/boards'

/**
 * 게시글을 삭제하는 hook
 * @param projectId - 프로젝트 ID
 */
export const useDeletePostMutation = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (postId: number) => deletePost(projectId, postId),
		onSuccess: () => {
			// 게시글 삭제 성공 시 관련 데이터 refetch
			queryClient.invalidateQueries({ queryKey: ['postList', projectId] })
			queryClient.invalidateQueries({ queryKey: ['teamBoardOverview', projectId] })
		},
	})
}
