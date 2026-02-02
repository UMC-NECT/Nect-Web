import { create } from 'zustand'
import type { TeamMembersByRole } from '@/types/mypage/ongoindProject'

interface PartSettingsModalState {
	isOpen: boolean
	teamMembersByRole: TeamMembersByRole[]
	open: (teamMembersByRole: TeamMembersByRole[]) => void
	close: () => void
	onSave: ((updatedParts: TeamMembersByRole[]) => void) | null
	setOnSave: (callback: (updatedParts: TeamMembersByRole[]) => void) => void
}

// (마이페이지) 진행 중인 프로젝트: 팀원 파트 수정 모달
export const usePartSettingsModal = create<PartSettingsModalState>(set => ({
	isOpen: false,
	teamMembersByRole: [],
	onSave: null,
	open: teamMembersByRole => set({ isOpen: true, teamMembersByRole }),
	close: () => set({ isOpen: false }),
	setOnSave: callback => set({ onSave: callback }),
}))
