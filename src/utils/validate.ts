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
