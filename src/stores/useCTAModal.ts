import { create } from 'zustand'

interface CTAModalConfig {
	message: string
	subMessage?: string
	isMessageHighlight?: boolean
	fixedHeight?: boolean
	leftButton?: { text: string; onClick: () => void }
	rightButton?: { text: string; onClick: () => void }
}

interface CTAModalState {
	isOpen: boolean
	config: CTAModalConfig | null
	open: (config: CTAModalConfig) => void
	close: () => void
}

export const useCTAModal = create<CTAModalState>(set => ({
	isOpen: false,
	config: null,
	open: config => set({ isOpen: true, config }),
	close: () => set({ isOpen: false, config: null }),
}))
