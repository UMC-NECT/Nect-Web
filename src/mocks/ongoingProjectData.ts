import type { ProjectHistory, RecruitType } from '@/types/mypage/ongoindProject'
import type { RecruitmentInfoType } from '@/utils/schemas/projectSchema'

/**
 * 프로젝트 기본 정보 타입
 */
export interface ProjectData {
	name: string
	intro: string
	startDate: string
	endDate: string
	recruitmentStatus: RecruitType
	thumbnailUrl?: string
	selectedFields: string[]
}

/**
 * 프로젝트 기본 정보 (썸네일 + 기본 정보)
 */
export const MOCK_PROJECT_DATA: ProjectData = {
	name: '넥트(NECT)',
	intro: '아이디어 분석으로 프로젝트 등록, 팀원 매칭, 협업 보드까지, 사이드 프로젝트 웹 플랫폼 개발',
	startDate: '2025. 11. 13',
	endDate: '2026. 02. 11',
	recruitmentStatus: '모집 완료',
	selectedFields: ['IT · 웹/모바일 서비스'], // 섹션 01. 프로젝트 분야
}

/**
 * 섹션 02. 모집 정보 및 필수 스택
 */
export type RecruitmentInfo = RecruitmentInfoType

export const MOCK_RECRUITMENT_INFO: RecruitmentInfo[] = [
	{
		role: 'PM',
		description: '',
	},
]

/**
 * 섹션 04. 프로젝트 목표
 */
export const MOCK_PROJECT_GOAL = ''

/**
 * 섹션 05. 주요 내용
 */
export const MOCK_MAIN_CONTENT = ''

/**
 * 섹션 06. 서비스 사용자
 */
export const MOCK_SERVICE_USER = ''

/**
 * 섹션 09. 팀원 프로젝트 히스토리
 */
export const MOCK_PROJECT_HISTORIES: ProjectHistory[] = [
	{
		id: 1,
		title: '트리플 UX.UI 개선 및 리브랜딩',
		description:
			'사용 체류 시간을 늘리고 기업 비전에 맞게 전략 및 BI 제안 / 여행의 전반에 활용 될 수 있는 UX Flow 개선 / GUI 제작',
		period: '2025.10~2025.12',
		tags: ['PM', 'Backend'],
	},
	{
		id: 2,
		title: '트리플 UX.UI 개선 및 리브랜딩',
		description:
			'사용 체류 시간을 늘리고 기업 비전에 맞게 전략 및 BI 제안 / 여행의 전반에 활용 될 수 있는 UX Flow 개선 / GUI 제작',
		period: '2025.10~2025.12',
		tags: ['Design'],
	},
]
