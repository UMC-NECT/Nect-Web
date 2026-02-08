import type { CommonResponse } from './commonResponse'

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
	profileImageFileName: string
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
	profileImageFileName: string
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

// === 진행 중인 프로젝트 ==========================================================
// MINO-TODO: 1개 (팀 히스토리 조회)
// MINO-TODO: 3개 (프젝 조회, 멤버 파트변경, 강퇴)

// === 모든 프로젝트 ==========================================================
// (모든 프로젝트) 프로젝트 역할 형식
export type MypageProjectRoleType = {
	role_field: 'BACKEND' | 'FRONTEND' | 'DESIGNER' | string
	required_count: number
}
// (모든 프로젝트) 프로젝트 형식
export type MypageProjectType = {
	project_id: number
	project_title: string
	description: string
	planned_started_on: string
	planned_ended_on: string
	image_name: string
	team_roles: [MypageProjectRoleType[]]
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

// === 매칭 현황 ==========================================================
