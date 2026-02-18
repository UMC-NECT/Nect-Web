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

/** customName이 있으면 그대로, 없으면 enum에서 labelEn 우선 반환 (미션 모달 등 파트 표시용) */
export const getRoleLabelEn = (
	roleValue: string,
	customName: string | null | undefined,
	roles: EnumItem[],
	roleFields: Record<string, EnumItem[]>
): string => {
	if (customName?.trim()) return customName.trim()
	if (!roleValue) return ''
	const inRoles = roles.find(r => r.value === roleValue)
	if (inRoles) return inRoles.labelEn ?? inRoles.label ?? roleValue
	for (const fields of Object.values(roleFields)) {
		const found = fields.find(f => f.value === roleValue)
		if (found) return found.labelEn ?? found.label ?? roleValue
	}
	return roleValue
}
