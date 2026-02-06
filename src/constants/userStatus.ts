export const USER_STATUS = [
	{ label: '재학 중', value: 'ENROLLED' },
	{ label: '구직 중', value: 'JOB_SEEKING' },
	{ label: '재직 중', value: 'EMPLOYED' },
] as const

export type UserStatusValue = (typeof USER_STATUS)[number]['value']
export type UserStatusLabel = (typeof USER_STATUS)[number]['label']

// value로 label 찾기
export const getUserStatusLabel = (value: string) => USER_STATUS.find(status => status.value === value)?.label ?? '상태 미정'
