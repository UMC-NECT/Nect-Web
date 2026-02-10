import { useQuery } from '@tanstack/react-query'
import { getTeamBoardOverview } from '@/api/team-board/boards'
import type { PostType } from '@/types/api/team-board/overview'

interface UseTeamBoardOverviewOptions {
	year?: number
	month?: number
	from?: string
	scheduleLimit?: number
	docsLimit?: number
	postsLimit?: number
	postType?: PostType
}

/**
 * 팀보드 통합 정보를 조회하는 hook
 * @param projectId - 프로젝트 ID
 * @param options - 옵션 파라미터
 */
export const useTeamBoardOverview = (projectId: number | null, options?: UseTeamBoardOverviewOptions) => {
	return useQuery({
		queryKey: ['teamBoardOverview', projectId, options],
		queryFn: () => getTeamBoardOverview(projectId!, options),
		enabled: projectId !== null,
	})
}
