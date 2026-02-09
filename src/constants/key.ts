export const LOCAL_STORAGE_KEY = {
	ACCESS_TOKEN: 'accessToken',
	REFRESH_TOKEN: 'refreshToken',
	ONBOARDING_COMPLETED: 'onboardingCompleted',
}

export const QUERY_KEY = {
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
}