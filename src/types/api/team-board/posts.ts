import type { CommonResponse } from '../commonResponse'
import type { PostPreviewWithPageInfo, PostType } from './overview'

export type GetPostListResponse = CommonResponse<PostPreviewWithPageInfo>

export interface CreatePostRequest {
	title: string
	content: string
	is_notice: boolean
	mention_user_ids?: number[]
}

export interface UpdatePostRequest {
	title: string
	content: string
	is_notice: boolean
	mention_user_ids?: number[]
}

export type UpdatePostResponse = CommonResponse

export interface CreatePostResponseBody {
	post_id: number
}

export type CreatePostResponse = CommonResponse<CreatePostResponseBody>

export interface UploadPostFileResponseBody {
	document_id: number
	document_type: 'FILE' | 'LINK'
	title: string
	link_url: string | null
	file_name: string | null
	file_ext: string | null
	file_size: number
	download_url: string | null
}

export type UploadPostFileResponse = CommonResponse<UploadPostFileResponseBody>

export interface PostAttachmentResponse {
	document_id: number
	document_type: 'FILE' | 'LINK'
	title: string
	link_url: string | null
	file_name: string | null
	file_ext: string | null
	file_size: number
	download_url: string | null
}

export interface PostAuthor {
	user_id: number
	name: string
	nickname: string
}

export interface PostDetail {
	post_id: number
	post_type: PostType
	title: string
	content: string
	like_count: number
	created_at: string // ISO 형식
	author: PostAuthor
	attachments: PostAttachmentResponse[]
}

export type GetPostDetailResponse = CommonResponse<PostDetail>
