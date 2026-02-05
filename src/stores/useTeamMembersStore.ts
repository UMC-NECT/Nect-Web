import { create } from 'zustand'
import type { TeamMembersByRole, TeamMember } from '@/types/mypage/ongoindProject'

interface TeamMembersState {
	teamMembersByRole: TeamMembersByRole[]

	// 팀원 관련
	setTeamMembersByRole: (data: TeamMembersByRole[]) => void
	addMember: (role: string, member: TeamMember) => void
	removeMember: (role: string, memberId: string) => void
	updateMember: (role: string, memberId: string, updates: Partial<TeamMember>) => void

	// 역할 그룹 관련
	addRoleGroup: (roleGroup: TeamMembersByRole) => void
	removeRoleGroup: (role: string) => void

	// 리더 설정
	setLeader: (role: string, memberId: string) => void

	// 희망 모집인원 설정
	setTargetCount: (role: string, count: number) => void
}

// 초기 팀원 데이터
const initialTeamMembers: TeamMembersByRole[] = [
	{
		role: 'PM',
		color: 'purple',
		targetCount: 1,
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
		color: 'pink',
		targetCount: 2,
		members: [
			{
				id: 'design-1',
				nickname: '이방토',
				part: 'Design',
				introduction: '디자인 프로젝트 경험이 많고 꼼꼼한 UX.UI 디자이너 입니다...',
				isLeader: true,
			},
		],
	},
	{
		role: 'Frontend',
		color: 'green',
		targetCount: 4,
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
		color: 'blue',
		targetCount: 4,
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
		],
	},
]

export const useTeamMembersStore = create<TeamMembersState>(set => ({
	// 초기 팀원 데이터
	teamMembersByRole: initialTeamMembers,

	// 초기 세팅
	setTeamMembersByRole: data => set({ teamMembersByRole: data }),

	// (팀원) 추가
	addMember: (role, member) =>
		set(state => ({
			teamMembersByRole: state.teamMembersByRole.map(group =>
				group.role === role ? { ...group, members: [...group.members, member] } : group
			),
		})),

	// (팀원) 삭제
	removeMember: (role, memberId) =>
		set(state => ({
			teamMembersByRole: state.teamMembersByRole.map(group =>
				group.role === role ? { ...group, members: group.members.filter(m => m.id !== memberId) } : group
			),
		})),

	// (팀원) 정보 업데이트
	updateMember: (role, memberId, updates) =>
		set(state => ({
			teamMembersByRole: state.teamMembersByRole.map(group =>
				group.role === role
					? {
							...group,
							members: group.members.map(m => (m.id === memberId ? { ...m, ...updates } : m)),
						}
					: group
			),
		})),

	// (역할) 추가
	addRoleGroup: roleGroup =>
		set(state => ({
			teamMembersByRole: [...state.teamMembersByRole, roleGroup],
		})),

	// (역할) 삭제
	removeRoleGroup: role =>
		set(state => ({
			teamMembersByRole: state.teamMembersByRole.filter(group => group.role !== role),
		})),

	// 리더 설정
	setLeader: (role, memberId) =>
		set(state => ({
			teamMembersByRole: state.teamMembersByRole.map(group =>
				group.role === role
					? {
							...group,
							members: group.members.map(m => ({
								...m,
								isLeader: m.id === memberId,
							})),
						}
					: group
			),
		})),

	// 희망 모집인원 설정
	setTargetCount: (role, count) =>
		set(state => ({
			teamMembersByRole: state.teamMembersByRole.map(group =>
				group.role === role ? { ...group, targetCount: count } : group
			),
		})),
}))
