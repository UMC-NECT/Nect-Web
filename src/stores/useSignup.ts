import { create } from 'zustand'

export type SignupStep = 'main' | 'form1' | 'form2' | 'agree' | 'done'

interface SignupState {
	isSignup: boolean // 로그인 유무
	currentStep: SignupStep // 회원가입 스텝
	setIsSignup: (isSignup: boolean) => void
	setCurrentStep: (step: SignupStep) => void
}

export const useSignup = create<SignupState>(set => ({
	isSignup: false,
	currentStep: 'form2', // main -> form1 -> form2 -> agree -> done
	setIsSignup: (isSignup: boolean) => set({ isSignup }),
	setCurrentStep: (step: SignupStep) => set({ currentStep: step }),
}))
