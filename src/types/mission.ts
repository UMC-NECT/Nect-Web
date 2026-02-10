import type { Assignees } from "./api/assignees"
import type { StatusType } from "./api/status"

export interface Mission {
    process_id: number
    task?: boolean
    mission_number: number
    title: string
    /** 진행률: 완료된 체크 수 (complete_check_list / done_count) */
    progressCompleted: number
    /** 진행률: 전체 체크 수 (whole_check_list / total_count) */
    progressTotal: number
    start_date: string // "2025.11.17" 형식
    dead_line: string // "2025.11.30" 형식
    left_day: number
    status: StatusType
    sectionIndex: number // 0-3 사이의 섹션 인덱스
    assignee?: Assignees[]
    onClick?: () => void
}

export interface Section {
    id: number
    title: string
}