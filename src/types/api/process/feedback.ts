import type { CommonResponse } from "../commonResponse"

export interface Feedback{
    feedback_id: number
    content: string
    status: string
    created_by: {
        user_id: number
        user_name: string
        role_fields: string[]
    }
    created_at: string
}

export type RequestFeedbackPostDto = {
    content: string
}

export type ResponseFeedbackPostDto = CommonResponse<Feedback>

export type ResponseFeedbackDeleteDto = CommonResponse<{
    deleted_feedback_id: number
}>

export type RequestFeedbackPatchDto = {
    content: string
}

export type ResponseFeedbackPatchDto = CommonResponse<Feedback & { updated_at: string }>