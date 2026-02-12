import type { CommonResponse } from '@/types/api/commonResponse'
import type {
	ResponseMypageProfileDto,
	RequestMypageProfileSaveDto,
	ResponseProjectUsers,
	ResponseAnalysisDto,
	ResponseDeleteAnalysisDto,
	ResponseProfileAnalysisDto,
	RequestMypageProjectFieldDto,
	ResponseMypageProjectRecruitments,
	RequestMypageRecruitmentCreateDto,
	ResponseMypageRecruitments,
	RequestMypageRecruitmentUpdateDto,
	ResponseMypageRecruitmentUpdateDto,
	ResponseMypageTeamRoles,
	ResponseGetProfileProjectsDto,
	ResponseProjectPurpose,
	ResponseProjectPlanFileDto,
	ProjectPlanFileRequest,
	ResponseProjectUsersListDto,
	RequestTeamRoleEditDto,
	RequestMemberFieldChangeDto,
	ResponseMemberFieldChangeDto,
	ResponseMemberKickDto,
	RequestMemberTypeChangeDto,
	ResponseMemberTypeChangeDto,
	RequestTeamRoleCreateDto,
	ResponseTeamRoleCreateDto,
	RequestTeamRoleUpdateDto,
	ResponseTeamRoleUpdateDto,
	RequestProjectUsersReorderDto,
	ResponseTeamRolesDto,
} from '@/types/api/mypage'
import { api } from '@/utils/AxiosInstance'

// === 내 프로필 설정 ==========================================================
// (내 프로필 설정) 프로필 조회
export const getMypageProfile = async (): Promise<ResponseMypageProfileDto> => {
	const { data } = await api.get('/api/v1/mypage/profile')

	return data
}

// (내 프로필 설정) 프로필 수정
export const patchMypageProfileSave = async (body: RequestMypageProfileSaveDto): Promise<CommonResponse> => {
	const { data } = await api.patch('/api/v1/mypage/profile/save', body)

	return data
}

// === 나의 아이디어 분석 ==========================================================
// (나의 아이디어 분석) 분석서 페이징 조회
export const getAnalysis = async (page: string): Promise<ResponseAnalysisDto> => {
	const { data } = await api.get('/api/v1/analysis', { params: { page } })

	return data
}

// (나의 아이디어 분석) 분석서 삭제
export const deleteAnalysis = async (analysisId: number): Promise<ResponseDeleteAnalysisDto> => {
	const { data } = await api.delete(`/api/v1/analysis/${analysisId}`)

	return data
}

// === 나의 프로필 분석 ==========================================================
// (나의 프로필 분석) 프로필 AI 분석 조회
export const getProfileAnalysis = async (): Promise<ResponseProfileAnalysisDto> => {
	const { data } = await api.get('/api/v1/users/profile/analysis')

	return data
}

// === 진행중인 프로젝트 (프로젝트 설정) ==========================================================
// 섹션 01. 프로젝트 분야 - 조회
export const getMypageProjectField = async (projectId: string): Promise<ResponseGetProfileProjectsDto> => {
	const { data } = await api.get(`/api/v1/mypage/projects/${projectId}/project-field`)

	return data
}

// 섹션 01. 프로젝트 분야 - 수정
export const patchMypageProjectField = async ({ projectId, field }: RequestMypageProjectFieldDto): Promise<CommonResponse> => {
	const { data } = await api.patch(`/api/v1/mypage/projects/${projectId}/project-field`, null, { params: { field } })

	return data
}

// /api/v1/mypage/{projectId}/recruitments
// 섹션 02. 프로젝트 모집정보 - 조회
export const getMypageProjectRecruiments = async (projectId: string): Promise<ResponseMypageProjectRecruitments> => {
	const { data } = await api.get(`/api/v1/mypage/${projectId}/recruitments`)

	return data
}

// 섹션 02. 프로젝트 모집정보 - 생성
export const postMypageRecruitments = async (
	projectId: string,
	body: RequestMypageRecruitmentCreateDto
): Promise<ResponseMypageRecruitments> => {
	const { data } = await api.post(`/api/v1/mypage/${projectId}/recruitments`, body)

	return data
}
// 섹션 02. 프로젝트 모집정보 - 수정 (리더만 가능)
export const putMypageRecruitments = async (
	projectId: string,
	recruitmentId: string,
	body: RequestMypageRecruitmentUpdateDto
): Promise<ResponseMypageRecruitmentUpdateDto> => {
	const { data } = await api.put(`/api/v1/mypage/${projectId}/recruitments/${recruitmentId}`, body)

	return data
}

// 섹션 03. 프로젝트 파트/팀원 구성 - 조회
export const getMypageTeamRoles = async (projectId: string): Promise<ResponseMypageTeamRoles> => {
	const { data } = await api.get(`/api/v1/mypage/${projectId}/team-roles`)

	return data
}

// 섹션 04. 프로젝트 목표 - 조회
export const getProjectPurposes = async (projectId: string): Promise<ResponseProjectPurpose> => {
	const { data } = await api.get(`/api/v1/mypage/projects/${projectId}/purposes`)

	return data
}

// 섹션 04. 프로젝트 목표 - 수정/생성
export const patchProjectPurposes = async (projectId: string, body: { contents: string[] }): Promise<CommonResponse> => {
	const { data } = await api.patch(`/api/v1/mypage/projects/${projectId}/purposes`, body)

	return data
}

// 섹션 05. 주요 내용 - 조회
export const getProjectsFunctions = async (projectId: string): Promise<ResponseProjectPurpose> => {
	const { data } = await api.get(`/api/v1/mypage/projects/${projectId}/functions`)

	return data
}

// 섹션 05. 주요 내용 - 수정/생성
export const patchProjectsFunctions = async (projectId: string, body: { contents: string[] }): Promise<CommonResponse> => {
	const { data } = await api.patch(`/api/v1/mypage/projects/${projectId}/functions`, body)

	return data
}

// 섹션 06. 서비스 사용자 - 조회
export const getProjectsServiceUsers = async (projectId: string): Promise<ResponseProjectPurpose> => {
	const { data } = await api.get(`/api/v1/mypage/projects/${projectId}/service-users`)

	return data
}

// 섹션 06. 서비스 사용자 - 수정/생성
export const patchProjectsServiceUsers = async (projectId: string, body: { contents: string[] }): Promise<CommonResponse> => {
	const { data } = await api.patch(`/api/v1/mypage/projects/${projectId}/service-users`, body)

	return data
}

const buildPlanFileFormData = (payload: ProjectPlanFileRequest): FormData => {
	const formData = new FormData()
	formData.append('name', payload.name)

	// planFileType을 application/json Content-Type으로 전송
	const planFileTypeBlob = new Blob([JSON.stringify(payload.planFileType)], { type: 'application/json' })
	formData.append('planFileType', planFileTypeBlob)

	if (payload.planFileType === 'FILE') {
		const fileName = payload.file instanceof File ? payload.file.name : 'file'
		formData.append('file', payload.file, fileName)
	} else {
		formData.append('link', payload.link)
	}
	return formData
}

// 섹션 07. 프로젝트 세부 기획 파일 - 조회
export const getProjectPlanFile = async (projectId: string): Promise<ResponseProjectPlanFileDto> => {
	const { data } = await api.get(`/api/v1/mypage/projects/${projectId}/plan-file`)

	return data
}

// 섹션 07. 프로젝트 세부 기획 파일 - 생성 (파일/링크 모두 POST 사용)
export const postProjectPlanFile = async (projectId: string, body: ProjectPlanFileRequest): Promise<CommonResponse> => {
	const formData = buildPlanFileFormData(body)
	const { data } = await api.post(`/api/v1/mypage/projects/${projectId}/plan-file`, formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})

	return data
}
// 섹션 07. 프로젝트 세부 기획 파일 - 수정
export const patchProjectPlanFile = async (
	projectId: string,
	planFileId: string,
	body: ProjectPlanFileRequest
): Promise<CommonResponse> => {
	const formData = buildPlanFileFormData(body)
	const { data } = await api.patch(`/api/v1/mypage/projects/${projectId}/plan-file/${planFileId}`, formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})

	return data
}

// 섹션 07. 프로젝트 세부 기획 파일 - 삭제
export const deleteProjectPlanFile = async (projectId: string, planFileId: string): Promise<CommonResponse> => {
	const { data } = await api.delete(`/api/v1/mypage/projects/${projectId}/plan-file/${planFileId}`)

	return data
}

// 프로젝트 삭제
export const deleteProject = async (projectId: string): Promise<CommonResponse> => {
	const { data } = await api.delete(`/api/v1/mypage/${projectId}`)

	return data
}

// 프로젝트 썸네일 이미지 업로드
export const postMypageProjectImage = async (
	projectId: string,
	image: File
): Promise<CommonResponse> => {
	const formData = new FormData()
	formData.append('image', image)
	const { data } = await api.post(`/api/v1/mypage/${projectId}/image`, formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})
	return data
}

// 섹션 08. 리더 프로필

// === 진행중인 프로젝트 (팀원 관리) ==========================================================
// (멤버 조회) 마이페이지 전용 프로젝트 유저 목록 조회
export const getMypageProjectUsers = async (projectId: string): Promise<ResponseProjectUsersListDto> => {
	const { data } = await api.get(`/api/v1/mypage/projects/${projectId}/users`)

	return data
}

// (팀 구성 편집) 프로젝트 팀 구성 편집 - 인원 수 설정
export const postMypageTeamRoleEdit = async (projectId: string, body: RequestTeamRoleEditDto): Promise<CommonResponse> => {
	const { data } = await api.post(`/api/v1/mypage/${projectId}/team-roles`, body)

	return data
}

// (멤버 관리) 파트 변경 (ex. 디자인, 프론트, 백엔드 등)
export const patchMemberField = async (
	projectUserId: string,
	body: RequestMemberFieldChangeDto
): Promise<ResponseMemberFieldChangeDto> => {
	const { data } = await api.patch(`/api/v1/mypage/${projectUserId}/field`, body)

	return data
}

// (멤버 관리) 강퇴
export const patchMemberKick = async (projectUserId: string): Promise<ResponseMemberKickDto> => {
	const { data } = await api.patch(`/api/v1/mypage/${projectUserId}/kick`)

	return data
}

// (멤버 관리) 멤버 타입 변경 (리더 | 리드 | 멤버)
export const patchMemberType = async (
	projectUserId: string,
	body: RequestMemberTypeChangeDto
): Promise<ResponseMemberTypeChangeDto> => {
	const { data } = await api.patch(`/api/v1/mypage/${projectUserId}/type`, body)

	return data
}

// (역할 추가) 팀 파트 생성 (리더만 가능)
export const postTeamRoleCreate = async (
	projectId: string,
	body: RequestTeamRoleCreateDto
): Promise<ResponseTeamRoleCreateDto> => {
	const { data } = await api.post(`/api/v1/mypage/projects/${projectId}/team-roles`, body)

	return data
}

export const getTeamRoles = async (projectId: string): Promise<ResponseTeamRolesDto> => {
	const { data } = await api.get(`/api/v1/mypage/projects/${projectId}/team-roles`)

	return data
}

// (역할 수정) 마이페이지 팀 파트 수정 (CUSTOM만 가능, 리더만 가능)
export const patchTeamRoleUpdate = async (
	projectId: string,
	userTeamRoleId: string,
	body: RequestTeamRoleUpdateDto
): Promise<ResponseTeamRoleUpdateDto> => {
	const { data } = await api.patch(`/api/v1/mypage/projects/${projectId}/team-roles/${userTeamRoleId}`, body)

	return data
}

// (유저 순서 재정렬) 프로젝트 멤버들의 정렬 순서 지정
export const postProjectUsersReorder = async (
	projectId: string,
	body: RequestProjectUsersReorderDto
): Promise<CommonResponse> => {
	const { data } = await api.post(`/api/v1/mypage/projects/${projectId}/users/reorder`, body)

	return data
}

// 프로젝트 모집 상태 변경
export const patchProjectRecruitmentStatus = async (projectId: string, status: string): Promise<CommonResponse> => {
	const { data } = await api.patch(`/api/v1/mypage/projects/${projectId}`, null, { params: { status } })

	return data
}

// === 모든 프로젝트 ==========================================================
// (모든 프로젝트) 현재 참여중인 프로젝트 조회
export const getMypageProjects = async (): Promise<ResponseProjectUsers> => {
	const { data } = await api.get('/api/v1/mypage/projects')

	return data
}
