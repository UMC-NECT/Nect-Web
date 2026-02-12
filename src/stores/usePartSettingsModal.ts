import { create } from 'zustand'
import type { TeamMembersByRole } from '@/types/mypage/ongoindProject'

export interface TeamMemberApiData {
	userId: number
	roleField: string
	customRoleFieldName: string | null
	partLabel: string
}

interface PartSettingsModalState {
	isOpen: boolean
	projectId: string
	teamMembersByRole: TeamMembersByRole[]
	originalTeamMembersByRole: TeamMembersByRole[]
	memberApiDataMap: Map<string, TeamMemberApiData> // memberId -> API data
	open: (projectId: string, teamMembersByRole: TeamMembersByRole[], memberApiDataMap: Map<string, TeamMemberApiData>) => void
	close: () => void
	onSave: ((updatedParts: TeamMembersByRole[]) => void) | null
	setOnSave: (callback: (updatedParts: TeamMembersByRole[]) => void) => void
}

// (마이페이지) 진행 중인 프로젝트: 팀원 파트 수정 모달
export const usePartSettingsModal = create<PartSettingsModalState>(set => ({
	isOpen: false,
	projectId: '',
	teamMembersByRole: [],
	originalTeamMembersByRole: [],
	memberApiDataMap: new Map(),
	onSave: null,
	open: (projectId, teamMembersByRole, memberApiDataMap) =>
		set({
			isOpen: true,
			projectId,
			teamMembersByRole,
			originalTeamMembersByRole: JSON.parse(JSON.stringify(teamMembersByRole)),
			memberApiDataMap,
		}),
	close: () => set({ isOpen: false }),
	setOnSave: callback => set({ onSave: callback }),
}))
