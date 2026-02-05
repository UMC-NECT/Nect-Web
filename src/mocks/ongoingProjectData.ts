import type { RecruitType } from '@/types/mypage/ongoindProject'
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
