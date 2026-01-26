import { z } from 'zod'

// 주요 성과 스키마
export const achievementSchema = z.object({
	id: z.number(),
	title: z.string().min(1, '주요 성과 제목을 입력해주세요'),
	content: z.string().min(1, '업무 설명을 입력해주세요'),
})

// 경력 스키마
export const careerSchema = z.object({
	id: z.number(),
	projectName: z.string().min(1, '프로젝트명을 입력해주세요'),
	startDate: z.string().regex(/^\d{4}\.\d{2}$/, 'YYYY.MM 형식으로 입력해주세요'),
	endDate: z.string(),
	isInProgress: z.boolean(),
	industry: z.string().min(1, '분야를 입력해주세요'),
	role: z.string().min(1, '역할을 입력해주세요'),
	achievements: z.array(achievementSchema),
})

// 프로필 전체 스키마
export const profileSchema = z.object({
	introduction: z.string().min(1, '자기소개를 입력해주세요'),
	coreCompetency: z.string().min(1, '핵심역량을 입력해주세요'),
	interestFields: z.array(z.string()).min(1, '관심분야를 1개 이상 선택해주세요'),
	skills: z.record(z.string(), z.array(z.string())),
	careers: z.array(careerSchema).min(1, '경력을 1개 이상 입력해주세요'),
})

// 타입 추출
export type AchievementType = z.infer<typeof achievementSchema>
export type CareerType = z.infer<typeof careerSchema>
export type ProfileFormDataType = z.infer<typeof profileSchema>

// 유효성 검사 함수
export const validateProfile = (data: unknown) => {
	return profileSchema.safeParse(data)
}

// 에러 메시지 추출 함수
export const getErrorMessages = (error: z.ZodError) => {
	return error.issues.map(issue => ({
		path: issue.path.join('.'),
		message: issue.message,
	}))
}
