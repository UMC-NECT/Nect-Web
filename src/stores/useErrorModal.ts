import { create } from "zustand"

interface ErrorModalState {
    isOpen: boolean
    code: string
    message: string
    setErrorModal: (code: string, message: string) => void
    onClose: () => void
}

export const useErrorModal = create<ErrorModalState>((set) => ({
    isOpen: false,
    code: '',
    message: '',
    setErrorModal: (code: string, message: string) => set({ code, message, isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))