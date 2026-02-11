import type { CommonResponse } from "../commonResponse"
import type { TaskItems } from "./taskItems"

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

export type ProcessPartProcessItem = ProcessWeekProcessItem & {
	attachment_summary?: {
		total_count: number
		file_count: number
		link_count: number
		file_extensions: string[]
	}
	attachments_meta?: Array<{
		type: 'FILE' | 'LINK'
		document_id: number
		attached_at: string
		file_ext: string | null
	}>
}

export type ResponseProcessPartDto = CommonResponse<{
	lane_key: string | null
	groups: {
		status: string
		count: number
		processes: ProcessPartProcessItem[]
	}[]
}>

/** 주차별 프로세스 조회 - 한 주의 한 건 카드 (API 응답 필드명 그대로) */
export interface ProcessWeekProcessItem {
    process_id: number
    process_status: string
    title: string
    complete_check_list: number
    whole_check_list: number
    start_date: string
    dead_line: string
    left_day: number
    role_fields: string[]
    custom_fields: string[]
    mission_number: number | null
    has_open_feedback?: boolean
    assignee?: Array<{
        user_id: number
        user_name: string
        nickname: string
        user_image: string | null
    }>
}

/** 주차별 by_field 한 그룹 (field_id = "ROLE:FRONTEND" 형태) */
export interface ProcessWeekByFieldItem {
    field_id: string
    field_name: string
    field_order: number
    processes: ProcessWeekProcessItem[]
}

/** 주차 한 구간 (start_date 기준 한 주) */
export interface ProcessWeekWeekItem {
    start_date: string
    common_lane: ProcessWeekProcessItem[]
    by_field: ProcessWeekByFieldItem[]
}

export type ResponseProcessWeekDto = CommonResponse<{
    weeks: ProcessWeekWeekItem[]
}>

/** 프로세스 상세 조회 - 담당자 (API 응답 필드명) */
export interface ProcessDetailAssignee {
    user_id: number
    user_name: string
    nickname: string
    user_image: string | null
}

/** 프로세스 상세 조회 - 첨부 (FILE | LINK) */
export interface ProcessDetailAttachment {
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

/** 프로세스 상세 조회 - 피드백 created_by */
export interface ProcessDetailFeedbackCreatedBy {
    user_id: number
    user_name: string
    nickname: string
    role_fields: string[]
}

/** 프로세스 상세 조회 - 피드백 한 건 */
export interface ProcessDetailFeedback {
    feedback_id: number
    content: string
    status: string
    created_by: ProcessDetailFeedbackCreatedBy
    created_at: string
}

export type ResponseProcessDetailDto = CommonResponse<{
    process_id: number
    process_title: string
    process_content: string
    process_status: string
    start_date: string
    dead_line: string
    mission_number?: number
    status_order: number
    role_fields: string[]
    custom_fields: string[]
    assignees: ProcessDetailAssignee[]
    mention_user_ids: number[]
    task_items: TaskItems[]
    feedbacks: ProcessDetailFeedback[]
    attachments: ProcessDetailAttachment[]
    writer: {
        user_id: number
        name: string
        nickname: string
        role_field: string | null
        custom_role_field_name: string | null
    }
    last_edited_by: {
        user_id: number
        name: string
        nickname: string
        role_field: string | null
        custom_role_field_name: string | null
    }
    created_at: string
    updated_at: string
    deleted_at: boolean | null
}>

export type RequestProcessPatchDto = {
    process_title?: string
    process_content?: string
    process_status?: string
    start_date?: string
    dead_line?: string
    role_fields?: string[]
    custom_fields?: string[]
    mission_number?: number
    assignee_ids?: number[]
    mention_user_ids?: number[]
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
        history_id: number
        action: string
        target_type: string
        target_id: number
        actor: {
            user_id: number
            name: string
            nickname: string
            role_field: string | null
            custom_field_name: string | null
        }
        main_message: string
        content_message: string | null
        created_at: string
    }[]
}>