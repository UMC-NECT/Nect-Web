import { create } from 'zustand'

interface ProjectHistoryModalState {
	isOpen: boolean
	position: { x: number; y: number } | null
	selectedIndex: number | null
	open: (position: { x: number; y: number }, index: number) => void
	close: () => void
}

export const useProjectHistoryModal = create<ProjectHistoryModalState>(set => ({
	isOpen: false,
	position: null,
	selectedIndex: null,
	open: (position, index) => set({ isOpen: true, position, selectedIndex: index }),
	close: () => set({ isOpen: false, position: null, selectedIndex: null }),
}))
