import type { CommonResponse } from '../commonResponse'

export interface ProjectUserItem {
	projectId: number
	memberType: string
}

export type ResponseProjectUsersDto = CommonResponse<ProjectUserItem[]>