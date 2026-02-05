export const LOCAL_STORAGE_KEY = {
	ACCESS_TOKEN: 'accessToken',
	REFRESH_TOKEN: 'refreshToken',
}

export const QUERY_KEY = {
	users: {
		all: ['users'] as const,
		email: () => [...QUERY_KEY.users.all, 'email'] as const,
	},
	onboardingEnums: ['onboardingEnums'] as const,
}