import type { CommonResponse } from '../commonResponse'
import type { PostPreviewWithPageInfo } from './overview'

export type GetPostListResponse = CommonResponse<PostPreviewWithPageInfo>

export interface CreatePostRequest {
	title: string
	content: string
	is_notice: boolean
	mention_user_ids?: number[]
}

export type CreatePostResponse = CommonResponse
