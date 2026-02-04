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

export const useLoginMutation = () => {
	return useMutation({
		mutationFn: (body: RequestLoginDto) => postLogin(body),
	})
}

export const useLogoutMutation = () => {
	return useMutation({
		mutationFn: () => postLogout(),
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
