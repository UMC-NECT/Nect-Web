export const USER_STATUS = [
	{ label: '재학중', value: 'ENROLLED' },
	{ label: '구직중', value: 'JOB_SEEKING' },
	{ label: '재직중', value: 'EMPLOYED' },
] as const

export type UserStatusValue = (typeof USER_STATUS)[number]['value']
export type UserStatusLabel = (typeof USER_STATUS)[number]['label']

// value로 label 찾기
export const getUserStatusLabel = (value: string) => USER_STATUS.find(status => status.value === value)?.label ?? '상태 미정'

// label로 value 찾기 (API 응답이 한글인 경우 영어 코드로 변환)
// get으로 받을때는 한글(구직중)인데, patch로 보낼때는 영어(JOB_SEEKING)임
export const getUserStatusValue = (label: string) => USER_STATUS.find(status => status.label === label)?.value ?? label
