import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	profileFormSchema,
	type ProfileFormDataType,
	type CareerType,
	type PortfolioType,
	type ProjectHistoryType,
} from '@/utils/schemas/profileSchema'

// 초기 상태 값
const INITIAL_FIELDS = ['IT · 웹/모바일 서비스', '교육 · 에듀테크', '금융 · 핀테크']
const INITIAL_SKILLS: Record<string, string[]> = {
	디자인: ['Figma', 'Photoshop', 'Illustrator', 'Premiere Pro', 'After Effect', 'Procreate'],
	기획: ['Notion', 'Ux Research'],
	기타: ['Claude', 'Consecutive Interpretation'],
}
const INITIAL_CAREERS: CareerType[] = [
	{
		id: 1,
		projectName: '',
		startDate: '',
		endDate: '',
		isInProgress: false,
		industry: '',
		role: '',
		achievements: [{ id: 1, title: '', content: '' }],
	},
]
const INITIAL_PORTFOLIOS: PortfolioType[] = [{ id: 1, title: '', link: '', isCompleted: false }]
const INITIAL_PROJECT_HISTORY: ProjectHistoryType[] = [
	{
		title: '트리플 UX.UI 개선 및 리브랜딩',
		description:
			'사용 체류 시간을 늘리고 기업 비전에 맞ㄱ게 전략 및 BI 제안 / 여행의 전반에 활용 될 수 있는 UX Flow 개선 / GUI 제작',
		date: '2025.10~2025.12',
	},
]

export const useProfileSettingsForm = () => {
	const methods = useForm<ProfileFormDataType>({
		resolver: zodResolver(profileFormSchema),
		mode: 'onChange',
		shouldFocusError: false,
		defaultValues: {
			interestJob: '',
			interestOccupation: '',
			userCareer: '',
			introduction: '',
			coreCompetency: '',
			interestFields: INITIAL_FIELDS,
			skills: INITIAL_SKILLS,
			careers: INITIAL_CAREERS,
			portfolios: INITIAL_PORTFOLIOS,
			projectHistory: INITIAL_PROJECT_HISTORY,
		},
	})

	return methods
}
