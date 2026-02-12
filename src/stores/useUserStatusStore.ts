import { create } from 'zustand'

interface UserStatusState {
	isOpen: boolean
	open: () => void
	close: () => void
}

export const useUserStatusStore = create<UserStatusState>(set => ({
	isOpen: false,
	open: () => set({ isOpen: true }),
	close: () => set({ isOpen: false }),
}))
