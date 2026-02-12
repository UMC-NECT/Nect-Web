import type { CommonResponse } from "@/types/api/commonResponse"
import { api } from "@/utils/AxiosInstance"

type RequestFilePostDto = {
    file: File
}

type ResponseFilePostDto = CommonResponse<{
    fileName: string
    fileUrl: string
}>

export const postFile = async (projectId: string, body: RequestFilePostDto): Promise<ResponseFilePostDto> => {
    const formData = new FormData()
    formData.append('file', body.file)
    const { data } = await api.post(`/api/v1/projects/${projectId}/files/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return data
}

/** 프로젝트 히스토리 등 공통 파일 업로드 (projectId 없음). 반환 fileUrl을 프로필 저장 시 넘기면 됨 */
export const postFileUpload = async (file: File): Promise<ResponseFilePostDto> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/api/v1/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
}