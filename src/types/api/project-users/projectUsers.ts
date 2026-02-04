import type { CommonResponse } from "../commonResponse";

export type ResponseProjectUsersDto = CommonResponse<{
    project_id: number
    memberType: string
}[]>