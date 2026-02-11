import { create } from 'zustand'
import type { TeamMembersByRole, TeamMember, ProjectHistory } from '@/types/mypage/ongoindProject'
import type { TeamMemberApiData } from './usePartSettingsModal'

interface TeamMembersState {
	teamMembersByRole: TeamMembersByRole[]
	teamMembersHistory: ProjectHistory[]
	memberApiDataMap: Map<string, TeamMemberApiData>

	// 팀원 관련
	setTeamMembersByRole: (data: TeamMembersByRole[]) => void
	setMemberApiDataMap: (data: Map<string, TeamMemberApiData>) => void
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

export const useTeamMembersStore = create<TeamMembersState>(set => ({
	// 초기 팀원 데이터 (API에서 로드)
	teamMembersByRole: [],
	// 초기 팀원 히스토리 데이터 (API에서 로드)
	teamMembersHistory: [],
	// API 호출에 필요한 원본 데이터
	memberApiDataMap: new Map(),

	// 초기 세팅
	setTeamMembersByRole: data => set({ teamMembersByRole: data }),
	setMemberApiDataMap: data => set({ memberApiDataMap: data }),

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
