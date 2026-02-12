import type { CommonResponse } from "./commonResponse"

/**
 * 현재 참여하고 있는 프로젝트 조회 응답
 */
export type ProjectUserDto = {
	projectId: number
	projectTitle: string
	memberType: "MEMBER" | "LEADER" | "PART"
}

export type GetProjectUsersResponse = CommonResponse<ProjectUserDto[]>
