import type { Assignees } from "../assignees"
import type { CommonResponse } from "../commonResponse"
import type { StatusType } from "../status"


/** 위크미션 주차 조회 - 한 건 미션 (week-missions/week 응답) */
export interface WeekMissionItem {
    process_id: number
    mission_number: number
    status: string
    title: string
    start_date: string
    dead_line: string
    left_day: number
    done_count: number
    total_count: number
    assignee?: {
        user_id: number
        nickname: string
        profile_image_url: string | null
    }
}

export type ResponseMissionDto = CommonResponse<{
    week_start: string
    week_end: string
    missions: WeekMissionItem[]
}>

export type ResponseMissionListDto = CommonResponse<{
    missions: {
        mission_number: number
        is_current: boolean
        start_date: string
        end_date: string
    }[]
}>

/** 위크미션 상세 내 task_item (체크리스트 항목) */
export interface WeekMissionTaskItem {
    task_item_id: number
    content: string
    is_done: boolean
    sort_order: number
    done_at: string | null
}

/** 위크미션 상세 attachments 항목 (파일 또는 링크) */
export interface WeekMissionAttachmentItem {
    type: 'FILE' | 'LINK'
    id: number
    created_at: string
    title: string | null
    url: string | null
    file_name: string | null
    file_url: string | null
    file_type: string | null
    file_size: number | null
}

export type ResponseMissionDetailDto = CommonResponse<{
    process_id: number
    mission_number: number
    title: string
    content: string | null
    status: string
    start_date: string
    dead_line: string
    assignee: Assignees
    attachments: WeekMissionAttachmentItem[]
    task_groups: {
        role_field: string | null
        custom_field_name: string | null
        items: WeekMissionTaskItem[]
    }[]
    task_items: WeekMissionTaskItem[]
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
    role_field: string | null
    custom_role_field_name: string | null
}

export type ResponseTaskPatchDto = CommonResponse<{
    task_item_id: number
    content: string
    is_done: boolean
    sort_order: number
    done_at: string
}>

export type RequestTaskItemsReorderPatchDto = {
    role_field: string |null
    custom_role_field_name: string |null
    ordered_task_item_ids: number[]
}

export type ResponseTaskItemsReorderPatchDto = CommonResponse<{
    process_id: number
    ordered_task_items: WeekMissionTaskItem[]
}>