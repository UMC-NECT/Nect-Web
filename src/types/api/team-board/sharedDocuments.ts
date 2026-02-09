import type { CommonResponse } from '../commonResponse'

export type DocumentType = 'FILE' | 'LINK'
export type SortOption = 'RECENT' | 'OLDEST' | 'NAME' | 'TYPE'

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
