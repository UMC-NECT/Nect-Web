import type { CommonResponse } from "./commonResponse"

export interface TaskItems{
    task_item_id: number
    content: string
    is_done: boolean
    sort_order: number
    done_at: string | null
}

export type RequestTaskItemsPostDto = {
    content: string
    is_done: false
    sort_order: number
}

export type ResponseTaskItemsPostDto = CommonResponse<TaskItems>

export type RequestTaskItemsOrderPatchDto = {
    ordered_task_item_ids: number[]
}

export type ResponseTaskItemsOrderPatchDto = CommonResponse<{
    process_id: number
    ordered_task_items: TaskItems[]
}>

export type ResponseTaskItemsDeleteDto = CommonResponse<{
    task_item_id: number
}>

export type RequestTaskItemsPatchDto = {
    content: string
    is_done: boolean
    sort_order: number
}

export type ResponseTaskItemsPatchDto = CommonResponse<TaskItems>