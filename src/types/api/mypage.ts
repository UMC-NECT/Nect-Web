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
	link: string
	fileUrl: string
}

// (내 프로필 설정) 프로젝트 히스토리
export type MyHistoryType = {
	projectName: string
	projectImage: string
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

// MINO-TODO: 3개 (프젝 조회, 멤버 파트변경, 강퇴)

// === 나의 아이디어 분석 ==========================================================
// MINO-TODO: 4개 (조회, 분석, 삭제, 프로젝트 생성)

// === 나의 프로필 분석 ==========================================================

// === 진행 중인 프로젝트 ==========================================================
// MINO-TODO: 1개 (팀 히스토리 조회)

// === 모든 프로젝트 ==========================================================

// === 매칭 현황 ==========================================================
