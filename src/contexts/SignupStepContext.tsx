import { createContext, useContext, useState, type ReactNode } from 'react'

export type SignupStep = 'main' | 'form1' | 'form2' | 'agree' | 'done'

type SignupStepContextType = {
	currentStep: SignupStep
	setCurrentStep: (step: SignupStep) => void
}

const SignupStepContext = createContext<SignupStepContextType | null>(null)

export const useSignupStep = () => {
	const context = useContext(SignupStepContext)
	if (!context) {
		throw new Error('useSignupStep must be used within SignupStepProvider')
	}
	return context
}

type SignupStepProviderProps = {
	children: ReactNode
}

export const SignupStepProvider = ({ children }: SignupStepProviderProps) => {
	const [currentStep, setCurrentStep] = useState<SignupStep>('main')

	return (
		<SignupStepContext.Provider value={{ currentStep, setCurrentStep }}>
			{children}
		</SignupStepContext.Provider>
	)
}
