import type { GetTeamBoardOverviewResponse } from '@/types/api/team-board/overview'
import type { PostType } from '@/types/api/team-board/overview'
import type { GetCalendarMonthResponse } from '@/types/api/team-board/calendar'
import type { CreateScheduleRequest, CreateScheduleResponse } from '@/types/api/team-board/schedule'
import type { GetPostListResponse, CreatePostRequest, CreatePostResponse } from '@/types/api/team-board/posts'
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

/**
 * 캘린더 월간 인디케이터를 조회합니다.
 * @param projectId - 프로젝트 ID
 * @param year - 조회 연도
 * @param month - 조회 월 (1~12)
 * @returns 캘린더 월간 인디케이터 정보
 */
export const getCalendarMonth = async (
	projectId: number,
	year: number,
	month: number,
): Promise<GetCalendarMonthResponse> => {
	const url = `/api/v1/projects/${projectId}/boards/calendar/month?year=${year}&month=${month}`
	const { data } = await api.get(url)
	return data
}

/**
 * 팀 일정을 생성합니다.
 * @param projectId - 프로젝트 ID
 * @param scheduleData - 일정 데이터
 * @returns 생성 결과
 */
export const createSchedule = async (
	projectId: number,
	scheduleData: CreateScheduleRequest,
): Promise<CreateScheduleResponse> => {
	const { data } = await api.post(`/api/v1/projects/${projectId}/boards/schedules`, scheduleData)
	return data
}

/**
 * 게시글 목록을 조회합니다.
 * @param projectId - 프로젝트 ID
 * @param options - 옵션 파라미터
 * @returns 게시글 목록 및 페이지 정보
 */
export const getPostList = async (
	projectId: number,
	options?: {
		type?: PostType
		page?: number
	},
): Promise<GetPostListResponse> => {
	const params = new URLSearchParams()
	if (options?.type) params.append('type', options.type)
	if (options?.page !== undefined) params.append('page', options.page.toString())

	const queryString = params.toString()
	const url = `/api/v1/projects/${projectId}/boards/posts${queryString ? `?${queryString}` : ''}`

	const { data } = await api.get(url)
	return data
}

/**
 * 게시글을 생성합니다.
 * @param projectId - 프로젝트 ID
 * @param postData - 게시글 데이터
 * @returns 생성 결과
 */
export const createPost = async (
	projectId: number,
	postData: CreatePostRequest,
): Promise<CreatePostResponse> => {
	const { data } = await api.post(`/api/v1/projects/${projectId}/boards/posts`, postData)
	return data
}
