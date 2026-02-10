import type { CommonResponse } from '../commonResponse'

export interface CalendarMonthDay {
	date: string // "2026-01-03" 형식
	event_count: number
}

export interface CalendarMonthResponse {
	year: number
	month: number
	days: CalendarMonthDay[]
}

export type GetCalendarMonthResponse = CommonResponse<CalendarMonthResponse>
