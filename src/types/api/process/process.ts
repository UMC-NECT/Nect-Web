import type { Assignees } from "../assignees"
import type { CommonResponse } from "../commonResponse"
import type { Files } from "../file"
import type { TaskItems } from "./taskItems"
import type { Feedback } from "./feedback"
import type { Links } from "./links"

export interface RequestProcessPostLinkDto {
    title: string
    url: string
}

export interface RequestProcessPostTaskItemDto {
    content: string
    is_done: boolean
    sort_order: number
}

export interface RequestProcessPostDto {
    process_title: string
    process_content: string
    process_status: string
    assignee_ids: number[]
    role_fields: string[]
    custom_field_name: string | null
    mission_number: number
    start_date: string
    dead_line: string
    mention_user_ids: number[]
    file_ids: number[]
    links: RequestProcessPostLinkDto[]
    task_items: RequestProcessPostTaskItemDto[]
}

export type ResponseProcessPostDto = CommonResponse<{
    process_id: number
}>

export type ResponseProcessPartDto = CommonResponse<{
    lane_key: string
    groups: []
}>

export type ResponseProcessWeekDto = CommonResponse<{
    start_date: string
    common_lane: []
    by_field: []
}>

export type ResponseProcessDetailDto = CommonResponse<{
    process_id: number
    process_title: string
    process_content: string
    process_status: string
    start_date: string
    dead_line: string
    status_order: number
    role_fields: []
    custom_fields: string[]
    assignees: Assignees[]
    mention_user_ids: number[]
    files: Files[]
    links: Links[]
    task_items: TaskItems[]
    feedbacks: Feedback[]
    created_at: string
    updated_at: string
    deleted_at: boolean
}>

export type RequestProcessPatchDto = {
    process_title: string
    process_content: string
    process_status: string
    start_date: string
    dead_line: string
    role_fields: string[]
    custom_fields: string[]
    assignee_ids: number[]
    mention_user_ids: number[]
}

export type ResponseProcessPatchDto = CommonResponse<{
    process_id: number
    process_title: string
    process_content: string
    process_status: string
    start_date: string
    dead_line: string
    role_fields: string[]
    custom_fields: string[]
    assignee_ids: number[]
    mention_user_ids: number[]
    updated_at: string
}>

export type RequestProcessOrderPatchDto = {
    status: string
    ordered_process_ids: number[]
    lane_key: string
    start_date: string
    dead_line: string
}

export type ResponseProcessOrderPatchDto = CommonResponse<{
    process_id: number
    status: string
    status_order: number
    start_at: string
    dead_line: string
}>

export type RequestProcessStatusPatchDto = {
    status: string
}

export type ResponseProcessStatusPatchDto = CommonResponse<{
    process_id: number
    status: string
    updated_at: string
}>

type Lane = {
    lane_key: string
    lane_type: string
    lane_name: string
    planning: number
    in_progress: number
    done: number
    total: number
    planning_rate: number
    in_progress_rate: number
    done_rate: number
}

export type ResponseProgressSummaryDto = CommonResponse<{
    lanes: Lane[]
}>

export type ResponseHistoryDto = CommonResponse<{
    next_cursor: number | null
    items: {
        actor_user_id: number
        target_type: string
        created_at: string
        action: string
        target_id: number
        history_id: number
        meta_json: string
    }[]
}>