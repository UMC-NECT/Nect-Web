// 역할 태그 컬러
export type ColorType = 'purple' | 'pink' | 'green' | 'blue' | 'gray'

// 탭바
export type TabType = '프로젝트 설정' | '팀원 관리'

// 역할
export type RoleType = 'PM' | 'Design' | 'Frontend' | 'Backend' | ''

// 프로젝트 모집 상태
export const RECRUIT_STATUS = ['모집 전', '모집 중', '모집 완료'] as const
export type RecruitType = (typeof RECRUIT_STATUS)[number]

/**
   진행 중인 프로젝트 (팀원 관리 탭)
    - TeamMember: 팀원
    - TeamMembersByRole: 역할별 팀원 데이터 타입
    - ProjectHistory: 팀원들의 프로젝트 히스토리
 */
export interface TeamMember {
	id: string
	nickname: string
	part: string
	introduction?: string
	profileImage?: React.ReactNode
	isLeader?: boolean
	isMatching?: boolean
}
export interface TeamMembersByRole {
	role: string
	roleLabel: string
	color: ColorType
	members: TeamMember[]
}
export interface ProjectHistory {
	id: number
	title: string
	description: string
	period: string
	imageUrl?: string
	tags: string[]
}
