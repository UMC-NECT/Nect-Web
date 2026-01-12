import { create } from 'zustand'

interface WorkspaceState {
	isWorkspace: boolean
	setIsWorkspace: (isWorkspace: boolean) => void
}

export const useWorkspace = create<WorkspaceState>(set => ({
	isWorkspace: false,
	setIsWorkspace: (isWorkspace: boolean) => set({ isWorkspace }),
}))

