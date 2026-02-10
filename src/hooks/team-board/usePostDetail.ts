import { useQuery } from '@tanstack/react-query'
import { getPostDetail } from '@/api/team-board/boards'

/**
 * 게시글 상세 정보를 조회하는 hook
 * @param projectId - 프로젝트 ID
 * @param postId - 게시글 ID
 */
export const usePostDetail = (projectId: number | null, postId: number | null) => {
	return useQuery({
		queryKey: ['postDetail', projectId, postId],
		queryFn: () => getPostDetail(projectId!, postId!),
		enabled: projectId !== null && postId !== null,
	})
}
