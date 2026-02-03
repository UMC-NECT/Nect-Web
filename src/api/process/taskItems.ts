import type { RequestTaskItemsOrderPatchDto, RequestTaskItemsPatchDto, RequestTaskItemsPostDto, ResponseTaskItemsDeleteDto, ResponseTaskItemsOrderPatchDto, ResponseTaskItemsPatchDto, ResponseTaskItemsPostDto } from "@/types/api/taskItems"
import { api } from "@/utils/AxiosInstance"

/** 프로세스(카드)에 업무 항목(TaskItem)을 생성합니다. */
export const postTaskItems = async (projectId: string, processId: string, body: RequestTaskItemsPostDto): Promise<ResponseTaskItemsPostDto> => {
    const {data} = await api.post(`/api/v1/projects/${projectId}/processes/${processId}/task-items`, body)
    return data
}

/** 업무 항목의 정렬 순서를 드래그&드롭 결과(전체 목록) 기준으로 저장합니다. */
export const patchTaskItemsOrder = async (projectId: string, processId: string, body: RequestTaskItemsOrderPatchDto): Promise<ResponseTaskItemsOrderPatchDto> => {
    const {data} = await api.patch(`/api/v1/projects/${projectId}/processes/${processId}/task-items/order`, body)
    return data
}

/** 업무 항목(TaskItem)을 삭제합니다. */
export const deleteTaskItems = async (projectId: string, processId: string, taskItemId: string): Promise<ResponseTaskItemsDeleteDto> => {
    const {data} = await api.delete(`/api/v1/projects/${projectId}/processes/${processId}/task-items/${taskItemId}`)
    return data
}

/** 업무 항목(TaskItem)의 내용/완료여부/정렬순서를 수정합니다. */
export const patchTaskItems = async (projectId: string, processId: string, taskItemId: string, body: RequestTaskItemsPatchDto): Promise<ResponseTaskItemsPatchDto> => {
    const {data} = await api.patch(`/api/v1/projects/${projectId}/processes/${processId}/task-items/${taskItemId}`, body)
    return data
}