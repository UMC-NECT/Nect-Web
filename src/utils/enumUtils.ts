import type { EnumItem } from '@/types/api/enums'

/** role value에 해당하는 enum label 반환. roles 우선, 없으면 roleFields에서 검색 */
export const getRoleLabel = (
	roleValue: string,
	roles: EnumItem[],
	roleFields: Record<string, EnumItem[]>
): string => {
	if (!roleValue) return ''
	const inRoles = roles.find(r => r.value === roleValue)?.label
	if (inRoles) return inRoles
	for (const fields of Object.values(roleFields)) {
		const found = fields.find(f => f.value === roleValue)?.label
		if (found) return found
	}
	return roleValue
}
