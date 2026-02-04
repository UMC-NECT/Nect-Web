import type { CommonResponse } from './commonResponse'

/** API enum 응답 공통 형태 (value: API 코드, label: 화면 표시값) */
export type EnumItem = {
	value: string
	label: string
}

export type ResponseSkillCategoryDto = CommonResponse<EnumItem[]>

export type ResponseSkillDto = CommonResponse<{
    category: string
    categoryLabel: string
    skills: EnumItem[]
}>

export type ResponseFieldDto = CommonResponse<EnumItem[]>

export type ResponseGoalDto = CommonResponse<EnumItem[]>

export type ResponseInterestFieldDto = CommonResponse<EnumItem[]>

export type ResponseJobsDto = CommonResponse<EnumItem[]>

export type ResponseRoleDto = CommonResponse<EnumItem[]>

export type ResponseRoleFieldDto = CommonResponse<{
    role: string
    roleLabel: string
    fields: EnumItem[]
}>