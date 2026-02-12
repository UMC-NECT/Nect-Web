import { useQuery } from '@tanstack/react-query'
import { getPostList } from '@/api/team-board/boards'
import type { PostType } from '@/types/api/team-board/overview'

/**
 * 게시글 목록을 조회하는 hook
 * @param projectId - 프로젝트 ID
 * @param options - 쿼리 옵션 (type, page)
 */
export const usePostList = (
	projectId: number | null,
	options?: {
		type?: PostType
		page?: number
	},
) => {
	return useQuery({
		queryKey: ['postList', projectId, options],
		queryFn: () => getPostList(projectId!, options),
		enabled: projectId !== null,
	})
}
