import type { CommonResponse } from './commonResponse'

type RoleType = 'BACKEND' | 'FRONTEND' | 'DESIGNER' | string

// === 내 프로필 설정 ==========================================================

// (내 프로필 설정) 스킬들
type SkillType = {
	skill: string
	skillLabel: string
	isSelected: boolean
}
export type UserSkillType = {
	category: string
	categoryLabel: string
	skills: SkillType[]
}

// (내 프로필 설정) 주요 이력/경력 - 성과
export type CareerAchievementType = {
	title: string
	content: string
}

// (내 프로필 설정) 주요 이력/경력
export type CareerType = {
	projectName: string
	industryField: string
	startDate: string
	endDate: string
	isOngoing: boolean
	role: string
	achievements: CareerAchievementType[]
}

// (내 프로필 설정) 포트폴리오 링크 및 파일
export type PortfolioType = {
	title: string
	link: string | null
	fileUrl: string | null
}

// (내 프로필 설정) 프로젝트 히스토리
export type MyHistoryType = {
	projectName: string
	projectImage: string | null
	projectDescription: string
	startYearMonth: string
	endYearMonth: string
}

// (내 프로필 설정) 프로필 조회
export type ResponseMypageProfileDto = CommonResponse<{
	userId: number
	name: string
	nickname: string
	email: string
	role: string
	profileImageUrl: string
	bio: string
	coreCompetencies: string
	userStatus: string
	isPublicMatching: boolean
	careerDuration: string
	interestedJob: string
	interestedField: string
	careers: CareerType[]
	portfolios: PortfolioType[]
	projectHistories: MyHistoryType[]
	skills: UserSkillType[]
	profileType: string
	tags: string[]
}>

// (내 프로필 설정) 프로필 수정
export type RequestMypageProfileSaveDto = {
	profileImageUrl: string
	bio: string
	coreCompetencies: string
	userStatus: string
	isPublicMatching: boolean
	careerDuration: string
	interestedJob: string
	interestedField: string
	careers: CareerType[]
	portfolios: PortfolioType[]
	projectHistories: MyHistoryType[]
}

// === 나의 아이디어 분석 ==========================================================
// (나의 아이디어 분석) 분석서에 쓰일 팀 구성정보
export type TeamCompositionType = {
	role_field: string
	role_field_display_name: string
	required_count: number
}
// (나의 아이디어 분석) 프로젝트 보완할 점을 발견했어요!
export type ImprovementPointsType = {
	order: number
	title: string
	description: string
}

// (나의 아이디어 분석) 주차별 로드맵에 쓰일 역할별 할일
export type RoleTasksType = {
	role_field: string
	role_field_display_name: string
	tasks: string
}

// (나의 아이디어 분석) 주차별 로드맵
export type WeeklyRoadmapType = {
	week_number: number
	week_title: string
	week_start_date: string
	week_end_date: string
	week_period: string
	role_tasks: RoleTasksType[]
}

// (나의 아이디어 분석) 분석서 타입
export type AnalysisType = {
	analysis_id: number
	description: string
	recommended_project_names: string[]
	project_duration: {
		start_date: string
		end_date: string
		total_weeks: number
		display_text: string
	}
	team_composition: TeamCompositionType[]
	improvement_points: ImprovementPointsType[]
	weekly_roadmap: WeeklyRoadmapType[]
}

// (나의 아이디어 분석) 분석서 페이징 조회
export type ResponseAnalysisDto = CommonResponse<{
	analysis: AnalysisType
	page_info: {
		current_page: number
		total_pages: number
		total_elements: number
		has_next: boolean
		has_previous: boolean
	}
}>

// (나의 아이디어 분석) 분석서 삭제
export type ResponseDeleteAnalysisDto = CommonResponse

// === 나의 프로필 분석 ==========================================================
// (나의 프로필 분석) 프로필 AI 분석 조회
export type ResponseProfileAnalysisDto = CommonResponse<{
	profileType: string
	tags: string[]
	collaborationStyle: {
		planning: number
		logic: number
		leadership: number
		empathy: number
		execution: number
	}
	skills: [
		{
			category: string
			skill_names: string[]
		},
	]
	roleRecommendation: {
		leader: string
		team_member: string
	}
	growthGuide: [
		{
			order: number
			tip: string
		},
	]
}>
// === 진행 중인 프로젝트 ==========================================================
// 섹션 01. 프로젝트 분야 - 조회
export type ResponseGetProfileProjectsDto = {
	project_id: string | null
	fields: [
		{
			field_name: string
			is_selected: boolean
		}[],
	]
}
// 섹션 01. 프로젝트 분야 - 수정
export type RequestMypageProjectFieldDto = {
	projectId: string
	field: string
}

// 섹션 02. 프로젝트 모집정보
type ProjectRecruitments = {
	recruitmentId: number
	roleField: RoleType
	customField: null
	capacity: number
	requirements: string[]
}
// 섹션 02. 프로젝트 모집정보 - 조회
export type ResponseMypageProjectRecruitments = [ProjectRecruitments[]]

// 섹션 02. 프로젝트 모집정보 - 생성
export type RequestMypageRecruitmentCreateDto = {
	roleField: string
	capacity: number
	requirements: string[]
}

export type ResponseMypageRecruitments = {
	roleField: RoleType
	capacity: number
	requirements: string[]
}

// 섹션 02. 프로젝트 모집정보 - 수정 (리더만 가능)
export type RequestMypageRecruitmentUpdateDto = {
	roleField: RoleType
	capacity: number
	requirements: string[]
}

// 섹션 02. 프로젝트 모집정보 - 수정 (리더만 가능)
export type ResponseMypageRecruitmentUpdateDto = CommonResponse<{
	recruitmentId: number
	roleField: RoleType
	customField: null
	capacity: number
	requirements: string[]
}>

// 섹션 03. 팀역할 타입
export type TeamRoleFieldItem = {
	role_field: string
	label_en?: string
	count: number
}

export type TeamRoleItem = {
	role: string
	count: number
	role_fields: TeamRoleFieldItem[]
}

// 섹션 03. 프로젝트 파트/팀원 구성 - 조회
export type ResponseMypageTeamRoles = CommonResponse<{
	roles: TeamRoleItem[]
}>

// 섹션 04. 프로젝트 목표 - 조회
export type ResponseProjectPurpose = CommonResponse<{
	project_id: number
	values: string[]
}>

// 섹션 07. 파일 타입
export type PlanFileTypeEnum = 'FILE' | 'LINK'

type FileType = {
	plan_file_id: number
	name: string
	file_name: string | null
	plan_file_type: PlanFileTypeEnum
	file_ext: string | null
	link?: string | null
	file_url?: string | null
}

// 섹션 07. 프로젝트 세부 기획 파일 - 요청 타입
export type ProjectPlanFileRequest =
	| { name: string; planFileType: 'FILE'; file: File | Blob }
	| { name: string; planFileType: 'LINK'; link: string }

// 섹션 07. 프로젝트 세부 기획 파일 - 조회
export type ResponseProjectPlanFileDto = CommonResponse<{
	project_id: number
	files: [FileType[]]
}>

// === 모든 프로젝트 ==========================================================
// (모든 프로젝트) 프로젝트 형식
export type MypageProjectType = {
	project_id: number
	project_title: string
	description: string
	planned_started_on: string
	planned_ended_on: string
	image_name: string
	recruitment_status: string
	team_roles: {
		roles: TeamRoleItem[]
	}
	leader: {
		user_id: number
		name: string
		profile_image_url: string
	}
	team_member_projects: [
		{
			project_id: number
			title: string
			description: string
			image_name: string
			created_at: string
			ended_at: string
		}[],
	]
}

// (모든 프로젝트) 현재 참여중인 프로젝트 조회
export type ResponseProjectUsers = CommonResponse<{
	projects: [MypageProjectType[]]
}>

// === 팀원 관리 (파트 설정 및 배치 인원) ==========================================================
// 프로젝트별 유저(멤버) 목록 조회
export type ProjectUserItem = {
	user_id: number
	name: string
	nickname: string
	profile_image_url: string | null
	bio: string | null
	role_field: string
	custom_role_field_name: string | null
	part_label: string
	member_type: 'LEADER' | 'LEAD' | 'MEMBER'
}

export type ResponseProjectUsersListDto = CommonResponse<{
	users: ProjectUserItem[]
}>

// 팀 구성 편집 (인원 수 설정)
export type RequestTeamRoleEditDto = {
	role_field: string
	count: number
}

// 멤버 필드(파트) 변경
export type RequestMemberFieldChangeDto = {
	field: string
	customField?: string
}

export type ResponseMemberFieldChangeDto = CommonResponse<{
	projectUserId: number
	field: string
	customField: string
}>

// 멤버 강퇴
export type ResponseMemberKickDto = CommonResponse<{
	id: number
	userId: number
	projectId: number
	field: string
	memberType: string
	memberStatus: string
}>

// 멤버 타입 변경 (LEADER | LEAD | MEMBER)
export type MemberTypeEnum = 'LEADER' | 'LEAD' | 'MEMBER'

export type RequestMemberTypeChangeDto = {
	memberType: MemberTypeEnum
}

export type ResponseMemberTypeChangeDto = CommonResponse<{
	id: number
	userId: number
	projectId: number
	field: string
	memberType: string
	memberStatus: string
}>

// 팀 파트 생성 (리더만 가능)
export type RequestTeamRoleCreateDto = {
	role_field: string
	custom_role_field_name?: string
	required_count: number
}

export type ResponseTeamRoleCreateDto = CommonResponse<{
	team_role_id: number
	role_field: string
	custom_role_field_name: string
	part_label: string
	required_count: number
}>

// 팀 파트 수정 (CUSTOM만 가능, 리더만 가능)
export type RequestTeamRoleUpdateDto = {
	custom_role_field_name?: string
	required_count?: number
}

export type ResponseTeamRolesDto = CommonResponse<{
	parts: {
		id: number
		role_field: string | null
		custom_role_field_name: string | null
		label: string
		required_count: number
	}
}>

export type ResponseTeamRoleUpdateDto = CommonResponse<{
	user_team_role_id: number
	role_field: string
	custom_role_field_name: string
	part_label: string
	required_count: number
}>

// 프로젝트 유저 순서 재정렬
export type ReorderUpdateItem = {
	roleField: string
	customRoleField: string | null
	orderedUserIds: number[]
}

export type RequestProjectUsersReorderDto = {
	updates: ReorderUpdateItem[]
}

// === 매칭 현황 ==========================================================
export type UserMatchingType = {
	matchingId: number
	userId: number
	nickname: string
	bio: string
	field: string
	customField: string | null
	profileUrl: string
	status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED' | 'EXPIRED'
	expiresAt?: string
}
export type ProjectMatchingType = {
	matchingId: number
	projectId: number
	title: string
	description: string
	currentMembersNum: number
	totalMemberNum: number
	imageUrl: string
	status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED' | 'EXPIRED'
	expiresAt?: string
}

export type ResponseMatchingDto = CommonResponse<{
	counterParty: null
	userMatchings: UserMatchingType[]
	projectMatchings: ProjectMatchingType[]
}>
