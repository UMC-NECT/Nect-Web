import { z } from 'zod'

const emailSchema = z
	.string()
	.min(1, '아이디에 @를 포함한 이메일 형식으로 작성해주세요.')
	.email('아이디에 @를 포함한 이메일 형식으로 작성해주세요.')
const passwordSchema = z.string().min(6, '')

// 로그인 스키마
export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	autoLogin: z.boolean().optional(),
})
export type LoginFormType = z.infer<typeof loginSchema>

// 온보딩 1 스키마
const nickname = z.string().min(1, '닉네임은 1글자 이상으로 작성해주세요.')
const birth = z.string().length(8, '8자리').regex(/^\d+$/, '숫자만 입력하세요')
const job = z.string()

// 온보딩 스키마
export const onboardingSchema = z.object({
	// Step 1
	nickname: nickname,
	birth: birth,
	job: job,
})

export type OnboardingFormType = z.infer<typeof onboardingSchema>
