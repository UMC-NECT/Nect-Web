import { create } from 'zustand'

interface ProjectLeaderStore {
	isLeader: boolean
	setIsLeader: (isLeader: boolean) => void
}

export const useProjectLeaderStore = create<ProjectLeaderStore>(set => ({
	isLeader: false,
	setIsLeader: isLeader => set({ isLeader }),
}))
