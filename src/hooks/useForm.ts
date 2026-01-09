import { useForm } from 'react-hook-form'
import { loginSchema, onboardingSchema } from '../utils/validate'
import type { LoginFormType, OnboardingFormType } from '../utils/validate'
import { zodResolver } from '@hookform/resolvers/zod'

export const useLoginForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		reset,
		setError,
		clearErrors,
		watch,
	} = useForm<LoginFormType>({
		resolver: zodResolver(loginSchema),
		mode: 'onChange',
	})

	return {
		register,
		handleSubmit,
		errors,
		isValid,
		isDirty,
		reset,
		setError,
		clearErrors,
		watch,
	}
}

export const useOnboardingForm = () => {
	const methods = useForm<OnboardingFormType>({
		resolver: zodResolver(onboardingSchema),
		mode: 'onChange',
	})

	return methods
}
