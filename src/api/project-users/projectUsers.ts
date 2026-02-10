import type { ResponseProjectUsersDto } from "@/types/api/project-users/projectUsers"
import { api } from "@/utils/AxiosInstance"

/** 로그인한 유저가 현재 참여하고 있는 프로젝트를 조회합니다. */
export const getProjectUsers = async (): Promise<ResponseProjectUsersDto> => {
    const {data} = await api.get('/api/v1/project-users')
    return data
}