import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePost } from '@/api/team-board/boards'
import type { UpdatePostRequest } from '@/types/api/team-board/posts'

/**
 * 게시글을 수정하는 hook
 * @param projectId - 프로젝트 ID
 * @param postId - 게시글 ID
 */
export const useUpdatePostMutation = (projectId: number, postId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (postData: UpdatePostRequest) => updatePost(projectId, postId, postData),
		onSuccess: () => {
			// 게시글 수정 성공 시 관련 데이터 refetch
			queryClient.invalidateQueries({ queryKey: ['postList', projectId] })
			queryClient.invalidateQueries({ queryKey: ['postDetail', projectId, postId] })
			queryClient.invalidateQueries({ queryKey: ['teamBoardOverview', projectId] })
		},
	})
}
