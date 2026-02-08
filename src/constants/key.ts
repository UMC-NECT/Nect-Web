export const LOCAL_STORAGE_KEY = {
	ACCESS_TOKEN: 'accessToken',
	REFRESH_TOKEN: 'refreshToken',
}

export const QUERY_KEY = {
	PROJECT_USERS: 'projectUsers',
	users: {
		all: ['users'] as const,
		email: () => [...QUERY_KEY.users.all, 'email'] as const,
		profile: () => [...QUERY_KEY.users.all, 'profile'] as const,
	},
	analysis: {
		all: ['analysis'] as const,
		list: (page?: string) => [...QUERY_KEY.analysis.all, 'list', page ?? '0'] as const,
	},
	onboardingEnums: ['onboardingEnums'] as const,
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
	process: {
		part: (projectId: string, fieldId?: string) => ['processes', projectId, 'part', fieldId] as const,
		week: (projectId: string, startDate?: string) => ['processes', projectId, 'week', startDate] as const,
		detail: (projectId: string, processId: string) => ['processes', projectId, 'detail', processId] as const,
		progressSummary: (projectId: string) => ['processes', projectId, 'progressSummary'] as const,
		list: (projectId: string) => ['processes', projectId] as const,
		history: (projectId: string, cursor?: number) => ['processes', projectId, 'history', cursor] as const,
		weekMission: {
			all: (projectId: string) => ['processes', projectId, 'weekMission'] as const,
			week: (projectId: string) => ['processes', projectId, 'weekMission', 'week'] as const,
			missionList: (projectId: string) => ['processes', projectId, 'weekMission', 'missionList'] as const,
			detail: (projectId: string, processId: string) =>
				['processes', projectId, 'weekMission', 'detail', processId] as const,
		},
	},
	project: {
		parts: (projectId: string) => ['project', projectId, 'parts'] as const,
		users: (projectId: string) => ['project', projectId, 'users'] as const,
	},
}