import type { CommonResponse } from "../commonResponse"
import type { Files } from "../file"

export type RequestAttachmentFilePostDto = {
    file_id: number
}

export type ResponseAttachmentFilePostDto = CommonResponse<{
    file_id: number
}>

export type RequestAttachmentLinksPostDto = {
    title: string
    link_url: string
}

export type ResponseAttachmentLinksPostDto = CommonResponse<{
    document_id: number
    title: string
    url: string
}>
export type RequestUploadAttachment = FormData

export type ResponseUploadAttachmentPostDto = CommonResponse<Files>