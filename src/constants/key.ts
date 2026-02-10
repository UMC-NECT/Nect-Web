export const LOCAL_STORAGE_KEY = {
	ACCESS_TOKEN: 'accessToken',
	REFRESH_TOKEN: 'refreshToken',
	ONBOARDING_COMPLETED: 'onboardingCompleted',
}

export const QUERY_KEY = {
	PROJECT_USERS: 'projectUsers',
	users: {
		all: ['users'] as const,
		email: () => [...QUERY_KEY.users.all, 'email'] as const,
		profile: () => [...QUERY_KEY.users.all, 'profile'] as const,
		profileAnalysis: () => [...QUERY_KEY.users.all, 'profileAnalysis'] as const,
	},
	analysis: {
		all: ['analysis'] as const,
		list: (page?: string) => [...QUERY_KEY.analysis.all, 'list', page ?? '0'] as const,
	},
	onboardingEnums: ['onboardingEnums'] as const,
<<<<<<< HEAD
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
	process: {
		part: (projectId: string, fieldId?: string) => ['processes', projectId, 'part', fieldId] as const,
		week: (projectId: string, startDate?: string, weeks?: string) => ['processes', projectId, 'week', startDate, weeks] as const,
		detail: (projectId: string, processId: string) => ['processes', projectId, 'detail', processId] as const,
		progressSummary: (projectId: string) => ['processes', projectId, 'progressSummary'] as const,
		list: (projectId: string) => ['processes', projectId] as const,
		history: (projectId: string, cursor?: number) => ['processes', projectId, 'history', cursor] as const,
		weekMission: {
			all: (projectId: string) => ['processes', projectId, 'weekMission'] as const,
			week: (projectId: string, startDate?: string, weeks?: string) =>
			['processes', projectId, 'weekMission', 'week', startDate, weeks] as const,
			missionList: (projectId: string) => ['processes', projectId, 'weekMission', 'missionList'] as const,
			detail: (projectId: string, processId: string) =>
				['processes', projectId, 'weekMission', 'detail', processId] as const,
		},
	},
	project: {
		parts: (projectId: string) => ['project', projectId, 'parts'] as const,
		users: (projectId: string) => ['project', projectId, 'users'] as const,
		files: (projectId: string) => ['project', projectId, 'files'] as const,
	},
}
=======
	mypage: {
		all: ['mypage'] as const,
		profile: () => [...QUERY_KEY.mypage.all, 'profile'] as const, // 내 프로필 설정
		project: () => [...QUERY_KEY.mypage.all, 'project'] as const, // 진행 중인 프로젝트, 모든 프로젝트
		analysis: (page?: string) => [...QUERY_KEY.mypage.all, 'analysis', page] as const, // 나의 아이디어 분석
		profileAnalysis: () => [...QUERY_KEY.mypage.all, 'profileAnalysis'] as const, // 나의 프로필 분석
	},
}
>>>>>>> b10067a (feat: 내프로필설정 정보 불러오기 api 연동)
