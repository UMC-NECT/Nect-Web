import type { CommonResponse } from '../commonResponse'

export type FieldType = 'BACKEND' | 'FRONTEND' | 'DESIGN' | 'PM' | 'CUSTOM'

export interface TeamBoardBasicInfo {
	project_id: number
	title: string
	description: string
	notice_text: string
	regular_meeting_text: string
	planned_started_on: string // "2026-01-01" 형식
	planned_ended_on: string // "2026-02-01" 형식
	remaining_days: number
	can_edit: boolean
}

export interface MissionProgressField {
	type: FieldType
	custom_name: string | null
}

export interface MissionProgressTotal {
	total_count: number
	completed_count: number
	completion_rate: number
}

export interface TeamMissionProgress {
	field: MissionProgressField
	total_count: number
	completed_count: number
	completion_rate: number
}

export interface MissionProgress {
	total: MissionProgressTotal
	teams: TeamMissionProgress[]
}

export interface TeamMember {
	user_id: number
	name: string
	nickname: string
	profile_image_url: string | null
	field: MissionProgressField
	member_type: 'LEADER' | 'MEMBER'
	counts: {
		planning: number
		in_progress: number
		done: number
	}
	is_working: boolean
	today_work_seconds: number
	working_started_at: string | null // ISO 형식
}

export interface UpcomingSchedule {
	schedule_id: number
	title: string
	start_at: string // ISO 형식
	end_at: string // ISO 형식
	all_day: boolean
	is_multi_day: boolean
}

export interface SharedDocumentPreview {
	document_id: number
	is_pinned: boolean
	title: string
	file_name: string
	file_ext: string
	file_url: string
	file_size: number
	created_at: string // ISO 형식
	uploader: {
		user_id: number
		name: string
		nickname: string
		profile_image_url: string | null
	}
}

export type PostType = 'NOTICE' | 'FREE' | 'REQUIRED'

export interface PostPreview {
	post_id: number
	post_type: PostType
	title: string
	content_preview?: string
	like_count?: number
	created_at: string // ISO 형식
}

export interface PostPreviewWithPageInfo {
	posts: PostPreview[]
	page_info: {
		page: number
		size: number
		total_elements: number
		total_pages: number
		has_next: boolean
	}
}

export interface CalendarMonthIndicators {
	year: number
	month: number
	indicators: Array<{
		date: number
		has_schedule: boolean
	}>
}

export interface TeamBoardOverview {
	basic_info: TeamBoardBasicInfo
	mission_progress: MissionProgress
	members: {
		members: TeamMember[]
	}
	upcoming_schedules: {
		items: UpcomingSchedule[]
	}
	shared_documents_preview: {
		documents: SharedDocumentPreview[]
	}
	posts_preview: PostPreviewWithPageInfo
	calendar_month_indicators: CalendarMonthIndicators | null
}

export type GetTeamBoardOverviewResponse = CommonResponse<TeamBoardOverview>
