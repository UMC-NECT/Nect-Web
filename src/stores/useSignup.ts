import { create } from 'zustand'

export type SignupStep = 'main' | 'form' | 'agree'

interface SignupState {
	isSignup: boolean // 로그인 유무
	currentStep: SignupStep // 회원가입 스텝 (메인 -> 이메일 -> 약관동의)
	setIsSignup: (isSignup: boolean) => void
	setCurrentStep: (step: SignupStep) => void
}

export const useSignup = create<SignupState>(set => ({
	isSignup: false,
	currentStep: 'main', // main -> form -> agree
	setIsSignup: (isSignup: boolean) => set({ isSignup }),
	setCurrentStep: (step: SignupStep) => set({ currentStep: step }),
}))
