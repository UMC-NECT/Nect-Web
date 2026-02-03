import type { RequestFeedbackPatchDto, RequestFeedbackPostDto, ResponseFeedbackDeleteDto, ResponseFeedbackPatchDto, ResponseFeedbackPostDto } from "@/types/api/feedback";
import { api } from "@/utils/AxiosInstance";

/** 프로세스(카드)에 피드백을 생성합니다. */
export const postFeedback = async (projectId: string, processId: string, body: RequestFeedbackPostDto): Promise<ResponseFeedbackPostDto> => {
    const {data} = await api.post(`/api/v1/projects/${projectId}/processes/${processId}/feedbacks`, body)
    return data
}

/** 피드백을 삭제합니다. */
export const deleteFeedback = async (projectId: string, processId: string, feedbackId: string): Promise<ResponseFeedbackDeleteDto> => {
    const {data} = await api.delete(`/api/v1/projects/${projectId}/processes/${processId}/feedbacks/${feedbackId}`)
    return data
}

/** 피드백 내용을 수정합니다 */
export const patchFeedback = async (projectId: string, processId: string, feedbackId: string, body: RequestFeedbackPatchDto): Promise<ResponseFeedbackPatchDto> => {
    const {data} = await api.patch(`/api/v1/projects/${projectId}/processes/${processId}/feedbacks/${feedbackId}`, body)
    return data
}