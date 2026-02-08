import type { GetTeamBoardOverviewResponse } from '@/types/api/team-board/overview'
import type { PostType } from '@/types/api/team-board/overview'
import { api } from '@/utils/AxiosInstance'

/**
 * 팀보드 화면에 필요한 카드들을 한 번에 조회합니다.
 * @param projectId - 프로젝트 ID
 * @param options - 옵션 파라미터
 * @returns 팀보드 통합 정보
 */
export const getTeamBoardOverview = async (
	projectId: number,
	options?: {
		year?: number
		month?: number
		from?: string
		scheduleLimit?: number
		docsLimit?: number
		postsLimit?: number
		postType?: PostType
	}
): Promise<GetTeamBoardOverviewResponse> => {
	const params = new URLSearchParams()
	if (options?.year) params.append('year', options.year.toString())
	if (options?.month) params.append('month', options.month.toString())
	if (options?.from) params.append('from', options.from)
	if (options?.scheduleLimit) params.append('scheduleLimit', options.scheduleLimit.toString())
	if (options?.docsLimit) params.append('docsLimit', options.docsLimit.toString())
	if (options?.postsLimit) params.append('postsLimit', options.postsLimit.toString())
	if (options?.postType) params.append('postType', options.postType)

	const queryString = params.toString()
	const url = `/api/v1/projects/${projectId}/boards/overview${queryString ? `?${queryString}` : ''}`

	const { data } = await api.get(url)
	return data
}
