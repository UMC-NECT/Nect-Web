import type { Assignees } from "../assignees"
import type { CommonResponse } from "../commonResponse"
import type { Files } from "../file"
import type { TaskItems } from "./taskItems"
import type { Feedback } from "./feedback"
import type { Links } from "./links"

export interface RequestProcessPostDto {
    process_title: string
    process_content: string
    process_status: string
    assignee_ids: string[]
    role_fields: string[]
    custom_field_name: string[]
    start_date: string
    dead_line: string
    mention_user_ids: []
    file_ids: []
    links: []
    task_items: []
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
    file_ids: Files[]
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