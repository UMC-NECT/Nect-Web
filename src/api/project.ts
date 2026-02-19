import { api } from '@/utils/AxiosInstance'
import type { RequestPatchProjectPartDto, RequestPostProjectPartDto, ResponsePartsDto, ResponsePatchProjectPartDto, ResponsePostProjectPartDto, ResponseUsersDto } from '@/types/api/project'

export { getProjectDetail } from './project/detail'

/** 현재 프로젝트에 설정된 파트 목록을 조회합니다. */
export const getParts = async (projectId: string): Promise<ResponsePartsDto> => {
    const { data } = await api.get(`/api/v1/projects/${projectId}/roles`)
    return data
}

/** 프로젝트에 속한 전체 인원 목록을 조회합니다. */
export const getUsers = async (projectId: string): Promise<ResponseUsersDto> => {
    const { data } = await api.get(`/api/v1/projects/${projectId}/users`)
    return data
}

/** 작업실(위크미션/파트별 작업현황 등)에서 사용할 프로젝트 파트를 추가합니다. */
export  const postProjectPart = async (projectId: string, body: RequestPostProjectPartDto): Promise<ResponsePostProjectPartDto> => {
    const { data } = await api.post(`/api/v1/projects/${projectId}/parts`, body)
    return data
}

/** 프로젝트 파트의 CUSTOM 이름 및 필요 인원을 수정합니다. (role_field 자체는 수정 불가) */
export const patchProjectPart = async (projectId: string, partId: number, body: RequestPatchProjectPartDto): Promise<ResponsePatchProjectPartDto> => {
    const { data } = await api.patch(`/api/v1/projects/${projectId}/parts/${partId}`, body)
    return data
}