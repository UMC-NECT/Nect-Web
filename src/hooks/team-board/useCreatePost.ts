import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '@/api/team-board/boards'
import type { CreatePostRequest } from '@/types/api/team-board/posts'

/**
 * 게시글을 생성하는 hook
 * @param projectId - 프로젝트 ID
 */
export const useCreatePostMutation = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (postData: CreatePostRequest) => createPost(projectId, postData),
		onSuccess: () => {
			// 게시글 생성 후 관련 데이터 refetch
			queryClient.invalidateQueries({ queryKey: ['postList', projectId] })
			queryClient.invalidateQueries({ queryKey: ['teamBoardOverview', projectId] })
		},
	})
}
