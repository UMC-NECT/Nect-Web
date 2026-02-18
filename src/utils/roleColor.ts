import type { EnumItem } from '@/types/api/enums'

// Role ID에 따른 순환 색상 (1-7 순환)
const ROLE_COLORS = [
	'bg-roletag-purple', // 1, 8, 15...
	'bg-roletag-pink', // 2, 9, 16...
	'bg-roletag-green', // 3, 10, 17...
	'bg-roletag-blue', // 4, 11, 18...
	'bg-roletag-yellow', // 5, 12, 19...
	'bg-roletag-orange', // 6, 13, 20...
	'bg-roletag-gray', // 7, 14, 21...
]

export const getRoleColorById = (id: number): string => {
	const index = (id - 1) % ROLE_COLORS.length
	return ROLE_COLORS[index]
}

/** part_id 등 id 기준으로 차트/태그용 CSS 변수(var(--color-roletag-*)) 반환 */
export const getRoleColorVarById = (id: number): string => {
	const cls = getRoleColorById(id)
	return 'var(--color-' + cls.replace('bg-', '') + ')'
}

/** roleFields(useOnboardingEnums)에서 roleField value의 순서로 색상 반환 */
export const getRoleColorByField = (roleField: string, roleFields: Record<string, EnumItem[]>): string => {
	const flat = Object.values(roleFields).flat()
	const idx = flat.findIndex(f => f.value === roleField)
	if (idx < 0) return ROLE_COLORS[0]
	return ROLE_COLORS[idx % ROLE_COLORS.length]
}

/**
 * 역할명을 첫 글자만 대문자로 포맷팅합니다.
 * @param role - 역할명 (예: "DEVELOPER", "DESIGNER")
 * @returns 포맷팅된 역할명 (예: "Developer", "Designer")
 */
export const formatRoleName = (role: string | undefined): string => {
	if (!role) return ''
	return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
}

export default ROLE_COLORS
