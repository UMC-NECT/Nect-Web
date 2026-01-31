import type { ProjectHistory, RecruitType, RoleType, TeamMembersByRole } from '@/types/mypage/ongoindProject'

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
 * 팀 구성 타입
 */
export interface TeamComposition {
	role: string
	count: number
	positions: { name: string; count: number }[]
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
export interface RecruitmentInfo {
	role: RoleType
	description: string
}

export const MOCK_RECRUITMENT_INFO: RecruitmentInfo[] = [
	{
		role: '',
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
 * 섹션 03. 프로젝트 파트 / 팀원 구성
 */
export const MOCK_TEAM_COMPOSITION: TeamComposition[] = [
	{ role: '기획', count: 1, positions: [{ name: 'PM', count: 1 }] },
	{ role: '디자인', count: 1, positions: [{ name: 'Design', count: 2 }] },
	{
		role: '개발',
		count: 8,
		positions: [
			{ name: 'Frontend', count: 4 },
			{ name: 'Backend', count: 4 },
		],
	},
]

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

/**
 * (팀원 관리 탭) 역할별 팀원 데이터
 */
export const MOCK_TEAM_MEMBERS_BY_ROLE: TeamMembersByRole[] = [
	{
		role: 'PM',
		roleLabel: 'PM',
		color: 'purple',
		members: [
			{
				id: 'pm-1',
				nickname: '시루',
				part: 'PM',
				introduction: '디자인 전공 출신 만능형 프로덕트 매니저입니다! 함께 성장 할 팀을 구합니다!',
				isLeader: true,
			},
		],
	},
	{
		role: 'Design',
		roleLabel: 'Design',
		color: 'pink',
		members: [
			{
				id: 'design-1',
				nickname: '이방토',
				part: 'Design',
				introduction: '디자인 프로젝트 경험이 많고 꼼꼼한 UX.UI 디자이너 입니다...',
				isLeader: true,
			},
			{
				id: 'design-2',
				nickname: '매칭 중',
				part: 'Part',
				introduction: '해당 파트 매칭 대기 중',
				isMatching: true,
			},
		],
	},
	{
		role: 'Frontend',
		roleLabel: 'Frontend',
		color: 'green',
		members: [
			{
				id: 'frontend-1',
				nickname: '숀',
				part: 'Frontend',
				introduction: '프로필 소개',
				isLeader: true,
			},
			{
				id: 'frontend-2',
				nickname: '갱빈',
				part: 'Frontend',
				introduction: '프로필 소개',
			},
			{
				id: 'frontend-3',
				nickname: '웬디',
				part: 'Frontend',
				introduction: '프로필 소개',
			},
			{
				id: 'frontend-4',
				nickname: '미노',
				part: 'Frontend',
				introduction: '프로필 소개',
			},
		],
	},
	{
		role: 'Backend',
		roleLabel: 'Backend',
		color: 'blue',
		members: [
			{
				id: 'backend-1',
				nickname: '세인트',
				part: 'Backend',
				introduction: '백엔드 개발을 담당합니다.',
				isLeader: true,
			},
			{
				id: 'backend-2',
				nickname: '미카엘',
				part: 'Backend',
				introduction: '프로필 소개',
			},
			{
				id: 'backend-3',
				nickname: '매칭 중',
				part: 'Part',
				introduction: '해당 파트 매칭 대기 중',
				isMatching: true,
			},
			{
				id: 'backend-4',
				nickname: '매칭 중',
				part: 'Part',
				introduction: '해당 파트 매칭 대기 중',
				isMatching: true,
			},
		],
	},
]
