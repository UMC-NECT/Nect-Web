import { z } from 'zod'
import { RECRUIT_STATUS } from '@/types/mypage/ongoindProject'

// 섹션 02. 모집 정보 및 필수 스택 스키마
const recruitmentInfoSchema = z.object({
	role: z.enum(['', 'PM', 'Design', 'Frontend', 'Backend']).refine(val => val !== '', { message: '직무를 선택해주세요' }),
	description: z.string().min(1, '모집 정보 및 필수 스택을 작성해주세요.'),
})

// 섹션07. 포트폴리오 파일 스키마
const portfolioFileSchema = z.object({
	id: z.number(),
	title: z.string().optional(),
	link: z.string().optional(),
	file: z.string().optional(),
	isCompleted: z.boolean().optional(),
})

// 진행중인 프로젝트 전체 폼 스키마
export const projectSettingsSchema = z.object({
	// 모집 여부 (선택)
	recruitmentStatus: z.enum(RECRUIT_STATUS).optional(),

	// 섹션 01. 프로젝트 분야 (필수)
	selectedFields: z.array(z.string()).min(1, '프로젝트 분야를 1개 이상 선택해주세요'),

	// 섹션 02. 모집 정보 및 필수 스택 (필수)
	recruitmentInfo: z.array(recruitmentInfoSchema).min(1, '모집 정보를 1개 이상 입력해주세요'),

	// 섹션 04. 프로젝트 목표 (필수)
	projectGoal: z.string().min(1, '프로젝트 목표를 입력해주세요'),

	// 섹션 05. 주요 내용 (필수)
	mainContent: z.string().min(1, '주요 내용을 입력해주세요'),

	// 섹션 06. 서비스 사용자 (선택)
	serviceUser: z.string().optional(),

	// 섹션 07. 포트폴리오 링크 및 파일 (선택)
	portfolioFiles: z.array(portfolioFileSchema).optional(),
})

// 타입 추출
export type PortfolioFileType = z.infer<typeof portfolioFileSchema>
export type RecruitmentInfoType = z.infer<typeof recruitmentInfoSchema>
export type ProjectSettingsType = z.infer<typeof projectSettingsSchema>

// 유효성 검사 함수
export const validateProjectSettings = (data: unknown) => {
	return projectSettingsSchema.safeParse(data)
}

// 에러 메시지 추출 함수
export const getProjectErrorMessages = (error: z.ZodError) => {
	return error.issues.map(issue => ({
		path: issue.path.join('.'),
		message: issue.message,
	}))
}
