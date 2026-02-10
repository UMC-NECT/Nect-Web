import { z } from 'zod'

// ===== 회원가입 =====
// 이메일 가입 폼1
const name = z.string().min(1, { message: '이름을 입력해주세요.' })
const phone = z
	.string()
	.min(1, '전화번호를 입력해주세요.')
	.regex(/^010-\d{4}-\d{4}$/, '올바르지 않은 전화번호입니다.')
	.length(13)
export const signupForm1Schema = z.object({
	name: name,
	phone: phone,
})
export type SignupForm1Type = z.infer<typeof signupForm1Schema>

// 이메일 가입 폼2
const signupEmail = z
	.string()
	.min(1, '@를 포함한 이메일 형식의 아이디를 입력해주세요.')
	.email('@를 포함한 이메일 형식의 아이디를 입력해주세요.')
const signupPassword = z.string().regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/, {
	message: '영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요.',
})
const signupPassword2 = z.string().optional()
export const signupForm2Schema = z.object({
	email: signupEmail,
	password: signupPassword,
	password2: signupPassword2,
})
export type SignupForm2Type = z.infer<typeof signupForm2Schema>

// 약관 동의 폼
const agree1 = z.boolean() // 만 14세 이상 입니다
const agree2 = z.boolean() // (필수) 서비스 이용약관 동의
const agree3 = z.boolean() // (필수) 개인정보 수집 이용 동의
const agree4 = z.boolean().optional() // (선택) 마케팅 정보 이메일 수신 동의
export const agreeSchema = z.object({
	agree1: agree1,
	agree2: agree2,
	agree3: agree3,
	agree4: agree4,
})
export type AgreeFormType = z.infer<typeof agreeSchema>

// ===== 로그인 =====
const emailSchema = z
	.string()
	.min(1, '@를 포함한 이메일 형식의 아이디를 입력해주세요.')
	.email('@를 포함한 이메일 형식의 아이디를 입력해주세요.')
const passwordSchema = z.string().min(1, '')

// 로그인 스키마
export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	autoLogin: z.boolean().optional(),
})
export type LoginFormType = z.infer<typeof loginSchema>

// ===== 온보딩 =====
// 온보딩 1
const nickname = z.string().min(1, '닉네임은 1글자 이상으로 작성해주세요.').max(4, '5글자 이내의 닉네임')
const birth = z.string().length(8, '8자리').regex(/^\d+$/, '숫자만 입력하세요')
const job = z.string().min(1, '직업을 선택해주세요.')

// 온보딩 2
const role = z.string().min(1, '역할을 선택해주세요')
const fields = z.array(z.string()).min(1, '분야를 최소 1개 선택해주세요')
const customField = z.string().optional()

// 온보딩 3
const skill = z.array(z.string()).min(1, '스킬을 최소 1개 선택해주세요').max(20, '최대 20개의 스킬까지 대표 가능')

// 온보딩 4
const interest = z.array(z.string()).min(1, '관심분야를 최소 1개 선택해주세요')

// 온보딩 5
const goal = z.array(z.string()).min(1, '목표를 1개 선택해주세요').max(1, '목표는 1개만 선택할 수 있어요')

// 온보딩 6
const workStyle = z.number().int().min(1).max(5).optional()
const communicationStyle = z.number().int().min(1).max(5).optional()
const teamworkStyle = z.number().int().min(1).max(5).optional()

// 온보딩 스키마
export const onboardingSchema = z.object({
	// Step 1
	nickname: nickname,
	birth: birth,
	job: job,

	// Step 2
	role: role,
	fields: fields,
	customField: customField,

	// Step 3
	skill: skill,

	// Step 4
	interest: interest,

	// Step 5
	goal: goal,

	// Step 6
	workStyle: workStyle,
	communicationStyle: communicationStyle,
	teamworkStyle: teamworkStyle,
})

export type OnboardingFormType = z.infer<typeof onboardingSchema>
