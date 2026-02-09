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