import { create } from 'zustand'

export type SignupFormData = {
	name: string
	phoneNumber: string
	email: string
	password: string
	passwordConfirm: string
}

interface SignupState {
	isSignup: boolean // 로그인 유무
	signupData: SignupFormData
	setIsSignup: (isSignup: boolean) => void
	setSignupData: (data: Partial<SignupFormData>) => void
	resetSignupData: () => void
}

const initialSignupData: SignupFormData = {
	name: '',
	phoneNumber: '',
	email: '',
	password: '',
	passwordConfirm: '',
}

export const useSignup = create<SignupState>(set => ({
	isSignup: false,
	signupData: initialSignupData,
	setIsSignup: (isSignup: boolean) => set({ isSignup }),
	setSignupData: (data: Partial<SignupFormData>) => set(state => ({ signupData: { ...state.signupData, ...data } })),
	resetSignupData: () => set({ signupData: initialSignupData }),
}))
