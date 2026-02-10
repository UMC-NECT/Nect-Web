import type { CommonResponse } from '../commonResponse'

export interface ProjectUserItem {
	projectId: number
	projectTitle: string
	memberType: string
}

export type ResponseProjectUsersDto = CommonResponse<ProjectUserItem[]>