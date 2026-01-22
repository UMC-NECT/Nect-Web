import { useForm } from 'react-hook-form'
import { loginSchema, onboardingSchema, signupForm1Schema } from '../utils/validate'
import type { LoginFormType, OnboardingFormType, SignupForm1Type } from '../utils/validate'
import { zodResolver } from '@hookform/resolvers/zod'

// 회원가입 (이메일로 가입 - 폼1)
export const useSignupForm1 = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty, touchedFields },
		reset,
		setError,
		clearErrors,
		watch,
		getValues,
		setValue,
	} = useForm<SignupForm1Type>({
		resolver: zodResolver(signupForm1Schema),
		mode: 'onChange',
		reValidateMode: 'onSubmit',
	})

	return {
		register,
		handleSubmit,
		errors,
		isValid,
		isDirty,
		touchedFields,
		reset,
		setError,
		clearErrors,
		watch,
		getValues,
		setValue,
	}
}

// 로그인
export const useLoginForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		reset,
		setError,
		clearErrors,
		watch,
		getValues,
	} = useForm<LoginFormType>({
		resolver: zodResolver(loginSchema),
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
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
		getValues,
	}
}

// 온보딩
export const useOnboardingForm = () => {
	const methods = useForm<OnboardingFormType>({
		resolver: zodResolver(onboardingSchema),
		mode: 'onChange',
		defaultValues: {
			workStyle: 3,
			communicationStyle: 3,
			teamworkStyle: 3,
		},
	})

	return methods
}
