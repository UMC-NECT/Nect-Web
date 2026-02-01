import { create } from 'zustand'

type CTAModalType = 'save' | 'delete' | 'projectRegister' | null

interface CTAModalConfig {
	message: string
	subMessage?: string
	isMessageHighlight?: boolean
	fixedHeight?: boolean
	leftButton?: { text: string; onClick: () => void }
	rightButton?: { text: string; onClick: () => void }
}

interface CTAModalState {
	modalType: CTAModalType | null
	isOpen: boolean
	config: CTAModalConfig | null
	open: (type: CTAModalType, config?: CTAModalConfig) => void
	close: () => void
}

export const useCTAModal = create<CTAModalState>(set => ({
	modalType: null,
	isOpen: false,
	config: null,
	open: (type, config) => set({ isOpen: true, modalType: type, config: config ?? null }),
	close: () => set({ isOpen: false, modalType: null, config: null }),
}))
