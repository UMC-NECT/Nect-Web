import type { GetTeamBoardOverviewResponse } from '@/types/api/team-board/overview'
import type { PostType } from '@/types/api/team-board/overview'
import type { GetCalendarMonthResponse } from '@/types/api/team-board/calendar'
import type { CreateScheduleRequest, CreateScheduleResponse, UpdateScheduleRequest, UpdateScheduleResponse } from '@/types/api/team-board/schedule'
import type { GetPostListResponse, CreatePostRequest, CreatePostResponse, GetPostDetailResponse, UploadPostFileResponse, UpdatePostRequest, UpdatePostResponse } from '@/types/api/team-board/posts'
import type { GetSharedDocumentListResponse, DocumentType, SortOption, UpdateSharedDocumentNameRequest, UpdateSharedDocumentNameResponse, UploadSharedDocumentFileResponse, CreateSharedDocumentLinkRequest, CreateSharedDocumentLinkResponse } from '@/types/api/team-board/sharedDocuments'
import type { CommonResponse } from '@/types/api/commonResponse'
import { api } from '@/utils/AxiosInstance'

// 팀보드 기본 정보 수정 요청 타입
interface UpdateTeamBoardBasicInfoRequest {
	notice_text?: string
	regular_meeting_text?: string
}

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
 * 팀보드 기본 정보를 수정합니다. (공지, 정기회의 문구 등)
 * @param projectId - 프로젝트 ID
 * @param basicInfoData - 수정할 기본 정보 (notice_text, regular_meeting_text)
 */
export const updateTeamBoardBasicInfo = async (
	projectId: number,
	basicInfoData: UpdateTeamBoardBasicInfoRequest,
): Promise<CommonResponse> => {
	const { data } = await api.patch(
		`/api/v1/projects/${projectId}/boards/basic-info`,
		basicInfoData,
	)
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
 * 팀 일정을 수정합니다.
 * @param projectId - 프로젝트 ID
 * @param scheduleId - 일정 ID
 * @param scheduleData - 일정 수정 데이터
 * @returns 수정 결과
 */
export const updateSchedule = async (
	projectId: number,
	scheduleId: number,
	scheduleData: UpdateScheduleRequest,
): Promise<UpdateScheduleResponse> => {
	const { data } = await api.patch(`/api/v1/projects/${projectId}/boards/schedules/${scheduleId}`, scheduleData)
	return data
}

/**
 * 팀 일정을 삭제합니다.
 * @param projectId - 프로젝트 ID
 * @param scheduleId - 일정 ID
 * @returns 삭제 결과
 */
export const deleteSchedule = async (
	projectId: number,
	scheduleId: number,
): Promise<CommonResponse> => {
	const { data } = await api.delete(`/api/v1/projects/${projectId}/boards/schedules/${scheduleId}`)
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

/**
 * 게시글 상세 정보를 조회합니다.
 * @param projectId - 프로젝트 ID
 * @param postId - 게시글 ID
 * @returns 게시글 상세 정보
 */
export const getPostDetail = async (
	projectId: number,
	postId: number,
): Promise<GetPostDetailResponse> => {
	const { data } = await api.get(`/api/v1/projects/${projectId}/boards/posts/${postId}`)
	return data
}

/**
 * 게시글에 파일을 업로드하고 첨부합니다.
 * @param projectId - 프로젝트 ID
 * @param postId - 게시글 ID
 * @param file - 업로드할 파일
 * @returns 업로드된 파일 정보
 */
export const uploadPostFile = async (
	projectId: number,
	postId: number,
	file: File,
): Promise<UploadPostFileResponse> => {
	const formData = new FormData()
	formData.append('file', file)

	const { data } = await api.post(
		`/api/v1/projects/${projectId}/boards/posts/${postId}/attachments/files`,
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
	)
	return data
}

/**
 * 게시글을 수정합니다.
 * @param projectId - 프로젝트 ID
 * @param postId - 게시글 ID
 * @param postData - 게시글 수정 데이터
 * @returns 수정 결과
 */
export const updatePost = async (
	projectId: number,
	postId: number,
	postData: UpdatePostRequest,
): Promise<UpdatePostResponse> => {
	const { data } = await api.patch(`/api/v1/projects/${projectId}/boards/posts/${postId}`, postData)
	return data
}

/**
 * 게시글을 삭제합니다 (soft delete).
 * 작성자만 삭제할 수 있습니다.
 * @param projectId - 프로젝트 ID
 * @param postId - 게시글 ID
 * @returns 삭제 결과
 */
export const deletePost = async (
	projectId: number,
	postId: number,
): Promise<CommonResponse> => {
	const { data } = await api.delete(
		`/api/v1/projects/${projectId}/boards/posts/${postId}`,
	)
	return data
}

/**
 * 게시글에 첨부된 문서를 해제합니다.
 * @param projectId - 프로젝트 ID
 * @param postId - 게시글 ID
 * @param documentId - 문서 ID (SharedDocument ID)
 * @returns 해제 결과
 */
export const unlinkPostAttachment = async (
	projectId: number,
	postId: number,
	documentId: number,
): Promise<CommonResponse> => {
	const { data } = await api.delete(
		`/api/v1/projects/${projectId}/boards/posts/${postId}/attachments/${documentId}`,
	)
	return data
}

/**
 * 공유 문서함 목록을 조회합니다.
 * @param projectId - 프로젝트 ID
 * @param options - 옵션 파라미터 (page, size, type, sort)
 * @returns 공유 문서함 목록 및 페이지 정보
 */
export const getSharedDocumentList = async (
	projectId: number,
	options?: {
		page?: number
		size?: number
		type?: DocumentType
		sort?: SortOption
	},
): Promise<GetSharedDocumentListResponse> => {
	const params = new URLSearchParams()
	if (options?.page !== undefined) params.append('page', options.page.toString())
	if (options?.size !== undefined) params.append('size', options.size.toString())
	if (options?.type) params.append('type', options.type)
	if (options?.sort) params.append('sort', options.sort)

	const queryString = params.toString()
	const url = `/api/v1/projects/${projectId}/boards/shared-documents${queryString ? `?${queryString}` : ''}`

	const { data } = await api.get(url)
	return data
}

/**
 * 공유 문서의 표시명(title)을 변경합니다.
 * @param projectId - 프로젝트 ID
 * @param documentId - 문서 ID
 * @param nameData - 이름 변경 데이터
 * @returns 변경 결과
 */
export const updateSharedDocumentName = async (
	projectId: number,
	documentId: number,
	nameData: UpdateSharedDocumentNameRequest,
): Promise<UpdateSharedDocumentNameResponse> => {
	const { data } = await api.patch(
		`/api/v1/projects/${projectId}/boards/shared-documents/${documentId}/name`,
		nameData,
	)
	return data
}

/**
 * 공유 문서를 삭제합니다 (소프트 삭제).
 * @param projectId - 프로젝트 ID
 * @param documentId - 문서 ID
 * @returns 삭제 결과
 */
export const deleteSharedDocument = async (
	projectId: number,
	documentId: number,
): Promise<CommonResponse> => {
	const { data } = await api.delete(`/api/v1/projects/${projectId}/boards/shared-documents/${documentId}`)
	return data
}

/**
 * 공유 문서함에 파일을 업로드합니다.
 * R2 업로드 + SharedDocument(FILE) 생성
 * @param projectId - 프로젝트 ID
 * @param file - 업로드할 파일
 * @returns 업로드된 문서 정보
 */
export const uploadSharedDocumentFile = async (
	projectId: number,
	file: File,
): Promise<UploadSharedDocumentFileResponse> => {
	const formData = new FormData()
	formData.append('file', file)

	const { data } = await api.post(
		`/api/v1/projects/${projectId}/boards/shared-documents/files`,
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
	)
	return data
}

/**
 * 공유 문서함에 링크를 생성합니다.
 * SharedDocument(LINK) 생성
 * @param projectId - 프로젝트 ID
 * @param linkData - 링크 데이터 (title, link_url)
 * @returns 생성된 링크 문서 정보
 */
export const createSharedDocumentLink = async (
	projectId: number,
	linkData: CreateSharedDocumentLinkRequest,
): Promise<CreateSharedDocumentLinkResponse> => {
	const { data } = await api.post(
		`/api/v1/projects/${projectId}/boards/shared-documents/links`,
		linkData,
	)
	return data
}

/**
 * 팀보드에서 작업 타이머를 시작합니다.
 * @param projectId - 프로젝트 ID
 * @returns 작업 시작 결과
 */
export const startWork = async (
	projectId: number,
): Promise<CommonResponse> => {
	const { data } = await api.post(`/api/v1/projects/${projectId}/boards/work/start`)
	return data
}

/**
 * 팀보드에서 작업 타이머를 정지합니다.
 * @param projectId - 프로젝트 ID
 * @returns 작업 정지 결과
 */
export const stopWork = async (
	projectId: number,
): Promise<CommonResponse> => {
	const { data } = await api.post(`/api/v1/projects/${projectId}/boards/work/stop`)
	return data
}
