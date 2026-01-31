import { z } from 'zod'

// 섹션 06. 주요 경력/이력 - 주요 성과 스키마
export const achievementSchema = z.object({
	id: z.number(),
	title: z.string().min(1, '주요 성과 제목을 입력해주세요'),
	content: z.string().min(1, '업무 설명을 입력해주세요'),
})

// 섹션 06. 주요 경력/이력 - 경력 스키마
export const careerSchema = z.object({
	id: z.number(),
	projectName: z.string().min(1, '프로젝트명을 입력해주세요'),
	startDate: z.string().regex(/^\d{4}\.\d{2}$/, '경력 입력칸에 YYYY.MM 형식의 날짜를 입력해주세요'),
	endDate: z.string(),
	isInProgress: z.boolean(),
	industry: z.string().min(1, '분야를 입력해주세요'),
	role: z.string().min(1, '역할을 입력해주세요'),
	achievements: z.array(achievementSchema),
})

// 섹션 07. 포트폴리오 파일 스키마
export const portfolioFileSchema = z.object({
	name: z.string(),
	url: z.string(),
})

// 섹션 07. 포트폴리오 아이템 스키마
export const portfolioSchema = z.object({
	id: z.number(),
	title: z.string(),
	link: z.string(),
	file: portfolioFileSchema.optional(),
	isCompleted: z.boolean().optional(),
})

// 섹션 08. 프로젝트 히스토리 스키마
export const projectHistorySchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	date: z.string(),
})

// 내 프로필 설정 전체 스키마
export const profileFormSchema = z.object({
	// 섹션 01. 자기소개 (필수)
	introduction: z.string().min(1, '자기소개를 입력해주세요'),

	// 섹션 02. 핵심역량 (필수)
	coreCompetency: z.string().min(1, '핵심역량을 입력해주세요'),

	// 섹션 04. 관심분야 (필수)
	interestFields: z.array(z.string()).min(1, '관심분야를 1개 이상 선택해주세요'),

	// 섹션 05. 보유스킬 (필수)
	skills: z.record(z.string(), z.array(z.string())),

	// 섹션 06. 주요 경력/이력 (필수)
	careers: z.array(careerSchema).min(1, '경력을 1개 이상 입력해주세요'),

	// 섹션 07. 포트폴리오 (선택)
	portfolios: z.array(portfolioSchema).optional(),

	// 섹션 08. 프로젝트 히스토리 (선택)
	projectHistory: z.array(projectHistorySchema).optional(),
})

// 타입 추출
export type CareerType = z.infer<typeof careerSchema>
export type PortfolioFileType = z.infer<typeof portfolioFileSchema>
export type PortfolioType = z.infer<typeof portfolioSchema>
export type ProjectHistoryType = z.infer<typeof projectHistorySchema>
export type ProfileFormDataType = z.infer<typeof profileFormSchema>
