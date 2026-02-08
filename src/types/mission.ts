import type { Assignees } from "./api/assignees"
import type { StatusType } from "./api/status"

export interface Mission {
    process_id: number
    task?: boolean
    mission_number: number
    title: string
    progress: number
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