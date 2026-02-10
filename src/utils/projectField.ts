export type ProjectFieldOption = {
	value: string
	label: string
}

export const PROJECT_FIELD_OPTIONS: ProjectFieldOption[] = [
	{ value: 'IT_WEB_MOBILE', label: 'IT·웹/모바일 서비스' },
	{ value: 'PUBLISHING_CONTENT', label: '출판·콘텐츠 제작' },
	{ value: 'ART_DIGITAL_MEDIA', label: '예술·전자미디어아트' },
	{ value: 'HEALTHCARE_FITNESS', label: '헬스케어·피트니스' },
	{ value: 'EDUCATION_EDUTECH', label: '교육·에드테크' },
	{ value: 'FINANCE_FINTECH', label: '금융·핀테크' },
	{ value: 'GAME_ENTERTAINMENT', label: '게임·엔터테인먼트' },
	{ value: 'OTHER', label: '기타' },
]

/** 영문 value → 한글 label 변환 */
export const getProjectFieldLabel = (value: string): string => {
	return PROJECT_FIELD_OPTIONS.find(option => option.value === value)?.label ?? value
}

/** 한글 label → 영문 value 변환 */
export const getProjectFieldValue = (label: string): string => {
	return PROJECT_FIELD_OPTIONS.find(option => option.label === label)?.value ?? label
}
