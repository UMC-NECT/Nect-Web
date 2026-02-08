import type { Assignees } from "../assignees"
import type { CommonResponse } from "../commonResponse"
import type { StatusType } from "../status"


export type ResponseMissionDto = CommonResponse<{
    week_start: string
    week_end: string
    missions: []
}>

export type ResponseMissionListDto = CommonResponse<{
    missions: {
        mission_number: number
        is_current: boolean
        start_date: string
        end_date: string
    }[]
}>

export type ResponseMissionDetailDto = CommonResponse<{
    process_id: number
    mission_number: number
    title: string
    content: string
    status: string
    start_date: string
    dead_line: string
    assignee: Assignees
    attachments: []
    task_groups: []
    task_items: []
    created_at: string
    updated_at: string
}>

export type RequestStatusPatchDto = {
    status: StatusType
}

export type ResponseStatusPatchDto = CommonResponse<void>

export type RequestTaskPatchDto = {
    content: string
    is_done: boolean
    role_field: string
    custom_role_field_name: string
}

export type ResponseTaskPatchDto = CommonResponse<{
    task_item_id: number
    content: string
    is_done: boolean
    sort_order: number
    done_at: string
}>