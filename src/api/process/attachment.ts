import type { RequestAttachmentFilePostDto, RequestAttachmentLinksPostDto, RequestUploadAttachment, ResponseAttachmentFilePostDto, ResponseAttachmentLinksPostDto, ResponseUploadAttachmentPostDto } from "@/types/api/attachment"
import type { CommonResponse } from "@/types/api/commonResponse"
import { api } from "@/utils/AxiosInstance"

/** 프로세스(카드)에 파일을 첨부합니다. */
export const postAttachmentFile = async (projectId: string, processId: string, body: RequestAttachmentFilePostDto): Promise<ResponseAttachmentFilePostDto> => {
    const {data} = await api.post(`/api/v1/projects/${projectId}/processes/${processId}/files`, body)
    return data
}

/** 프로세스(카드)에 링크를 추가합니다. */
export const postAttachmentLinks = async (projectId: string, processId: string, body: RequestAttachmentLinksPostDto): Promise<ResponseAttachmentLinksPostDto> => {
    const {data} = await api.post(`/api/v1/projects/${projectId}/processes/${processId}/links`, body)
    return data
}

/** 프로세스(카드) 모달에서 파일을 업로드하고, 업로드된 파일을 즉시 해당 프로세스에 첨부합니다. */
export const postUploadAttachmentFile = async (projectId: string, processId: string, body: RequestUploadAttachment): Promise<ResponseUploadAttachmentPostDto> => {
    const {data} = await api.post(`/api/v1/projects/${projectId}/processes/${processId}/files/upload`, body)
    return data
}

/** 프로세스(카드)에 첨부된 파일을 해제합니다. */
export const deleteAttachmentFile = async (projectId: string, processId: string, fileId: number): Promise<CommonResponse> => {
    const {data} = await api.delete(`/api/v1/projects/${projectId}/processes/${processId}/files/${fileId}`)
    return data
}

/** 프로세스(카드)에 등록된 링크를 삭제합니다. */
export const deleteAttachmentLink = async (projectId: string, processId: string, linkId: number): Promise<CommonResponse> => {
    const {data} = await api.delete(`/api/v1/projects/${projectId}/processes/${processId}/links/${linkId}`)
    return data
}