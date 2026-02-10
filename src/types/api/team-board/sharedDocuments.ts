import type { CommonResponse } from '../commonResponse'

export type DocumentType = 'FILE' | 'LINK'
export type SortOption = 'RECENT' | 'OLDEST' | 'NAME' | 'FORMAT'

export interface SharedDocumentUploader {
	user_id: number
	name: string
	nickname: string
	profile_image_url: string | null
}

export interface SharedDocument {
	document_id: number
	is_pinned: boolean
	document_type: DocumentType
	title: string
	file_name: string | null
	file_ext: string | null
	file_url: string | null
	link_url: string | null
	file_size: number | null
	created_at: string // ISO 형식
	uploader: SharedDocumentUploader
}

export interface SharedDocumentListResponse {
	page: number
	size: number
	total_elements: number
	total_pages: number
	documents: SharedDocument[]
}

export type GetSharedDocumentListResponse = CommonResponse<SharedDocumentListResponse>

export interface UpdateSharedDocumentNameRequest {
	title: string
	name?: string | null
}

export type UpdateSharedDocumentNameResponse = CommonResponse

/**
 * 공유 문서함 파일 업로드 응답
 */
export interface SharedDocumentUploadResponse {
	document_id: number
	document_type: "FILE"
	title: string
	link_url: string | null
	file_name: string
	file_ext: string
	file_size: number
	download_url: string
}

export type UploadSharedDocumentFileResponse = CommonResponse<SharedDocumentUploadResponse>

/**
 * 공유 문서함 링크 생성 요청
 */
export interface CreateSharedDocumentLinkRequest {
	title: string
	link_url: string
}

/**
 * 공유 문서함 링크 생성 응답
 */
export interface SharedDocumentLinkResponse {
	document_id: number
	document_type: "LINK"
	title: string
	link_url: string | null
	file_name: string | null
	file_ext: string | null
	file_size: number | null
	download_url: string | null
}

export type CreateSharedDocumentLinkResponse = CommonResponse<SharedDocumentLinkResponse>
