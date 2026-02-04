import type { CommonResponse } from "../commonResponse"
import type { Files } from "../file"

export type RequestAttachmentFilePostDto = {
    file_id: number
}

export type ResponseAttachmentFilePostDto = CommonResponse<{
    file_id: number
}>

export type RequestAttachmentLinksPostDto = {
    url: string
}

export type ResponseAttachmentLinksPostDto = CommonResponse<{
    link_id: number
}>
export type RequestUploadAttachment = FormData

export type ResponseUploadAttachmentPostDto = CommonResponse<Files>