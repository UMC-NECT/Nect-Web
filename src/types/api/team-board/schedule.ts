import type { CommonResponse } from '../commonResponse'

export interface CreateScheduleRequest {
	title: string
	description?: string
	start_at: string // ISO 형식: "2026-02-01T10:00:00"
	end_at: string // ISO 형식: "2026-02-01T11:00:00"
	all_day: boolean
}

export type CreateScheduleResponse = CommonResponse

export interface UpdateScheduleRequest {
	title: string
	description?: string
	start_at: string // ISO 형식: "2026-02-01T10:00:00"
	end_at: string // ISO 형식: "2026-02-01T11:00:00"
	all_day: boolean
}

export type UpdateScheduleResponse = CommonResponse
