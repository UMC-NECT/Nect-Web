import { api } from "@/utils/AxiosInstance"
import type { ResponsePartsDto } from "@/types/api/project"
import type { ResponseUsersDto } from "@/types/api/project"

/** 현재 프로젝트에 설정된 파트 목록을 조회합니다. */
export const getParts = async (projectId: string): Promise<ResponsePartsDto> => {
    const { data } = await api.get(`/api/v1/projects/${projectId}/parts`)
    return data
}

/** 프로젝트에 속한 전체 인원 목록을 조회합니다. */
export const getUsers = async (projectId: string): Promise<ResponseUsersDto> => {
    const { data } = await api.get(`/api/v1/projects/${projectId}/users`)
    return data
}