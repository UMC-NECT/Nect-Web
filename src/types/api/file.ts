import type { CommonResponse } from './commonResponse'

/** 파일 업로드 시 body는 FormData. 예: formData.append('file', file) */
export type RequestFilePostDto = FormData

export interface Files {
    file_id: number
    file_name: string
    file_url: string
    file_type: string
    file_size: number
}

export type ResponseFileDto = CommonResponse<Files>