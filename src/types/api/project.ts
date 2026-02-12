import type { Part } from '../part'
import type { CommonResponse } from './commonResponse'

/** 프로젝트 상세 API 응답 body 타입 */
export type ProjectDetailDto = {
	defaultInfo: {
		leader?: { profile_image_url?: string; name: string }
		planned_ended_on: string | null
		planned_started_on: string | null
		image_name: string | null
		project_title: string
		description: string | null
		recruitment_status?: string
		team_roles:
			| {
					roles: {
						role: string
						count: number
						role_fields: { role_field: string; count: number }[]
					}[]
			  }
			| { role_field: string; required_count: number }[]
		team_member_projects: {
			project_id: number
			title: string
			description: string | null
			created_at: string
			ended_at: string | null
			image_name: string | null
		}[]
	}
	fields?: {
		fields?: { is_selected: boolean; field_name: string }[]
	}
	purposes?: { values: string[] }
	functions?: { values: string[] }
	serviceUsers?: { values: string[] }
	planFiles?: { files: { name: string }[] }
}

export type ResponsePartsDto = CommonResponse<{
    parts: Part[]
}>

export type ResponseUsersDto = CommonResponse<{
    users: {
        user_id: number
        name: string
        nickname: string
        member_type: string
        profile_image_url: string
        role_field: string | null
        part_label: string | null
        custom_role_field_name: string | null
        bio: string | null
    }[]
}>