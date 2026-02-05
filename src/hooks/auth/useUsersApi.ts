import { useMutation } from '@tanstack/react-query'
import type {
	RequestAgreeDto,
	RequestCheckDto,
	RequestLoginDto,
	RequestSetupDto,
	RequestSignupDto,
} from '@/types/api/users'
import {
	postLogin,
	postLogout,
	postSignup,
	postSetup,
	postAgree,
	postCheck,
} from '@/api/users'
import { LOCAL_STORAGE_KEY } from '@/constants/key'
import { useNavigate } from 'react-router'

export const useLoginMutation = () => {
	return useMutation({
		mutationFn: (body: RequestLoginDto) => postLogin(body),
	})
}

export const useLogoutMutation = () => {
	const navigate = useNavigate()

	return useMutation({
		mutationFn: () => postLogout(),
		onSuccess: () => {
			localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
			localStorage.removeItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN)
			navigate('/')
		},
	})
}

export const useSignupMutation = () => {
	return useMutation({
		mutationFn: (body: RequestSignupDto) => postSignup(body),
	})
}

export const useSetupMutation = () => {
	return useMutation({
		mutationFn: (body: RequestSetupDto) => postSetup(body),
	})
}

export const useAgreeMutation = () => {
	return useMutation({
		mutationFn: (body: RequestAgreeDto) => postAgree(body),
	})
}

export const useCheckMutation = () => {
	return useMutation({
		mutationFn: (body: RequestCheckDto) => postCheck(body),
	})
}
