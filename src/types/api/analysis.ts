import type { CommonResponse } from "./commonResponse"

type RoleTask = {
    role_task_id: number
    role_task_display_name: string
    required_count: number
}

type ProjectDuration = {
    start_date: string
    end_date: string
    total_weeks: number
    display_text: string
}

type ImprovementPoint = {
    order: number
    title: string
    description: string
}

export type WeeklyRoadmapRoleTask = {
    role_field: string
    role_field_display_name: string
    tasks: string
}

type WeeklyRoadmap = {
    week_number: number
    week_title: string
    week_start_date: string
    week_end_date: string
    week_period: string
    role_tasks: WeeklyRoadmapRoleTask[]
}
export type RequestPostAnalysisDto = {
    projectName: string
    projectSummary: string
    targetUsers: string
    problemStatement: string
    coreFeature1: string
    coreFeature2: string
    coreFeature3: string
    platform: string
    referenceServices: string
    technicalChallenges: string
    targetCompletionDate: string
}

export type ResponsePostAnalysisDto = CommonResponse<{
    analysis_id: number
    recommended_project_names: string[]
    project_duration: ProjectDuration
    team_composition: RoleTask[]
    improvement_points: ImprovementPoint[]
    weekly_roadmap: WeeklyRoadmap
}>

export type ResponseGetAnalysisDto = CommonResponse<{
    analysis: {
        analysis_id: number
        recommended_project_names: string[]
        project_duration: ProjectDuration
        team_composition: RoleTask[]
        improvement_points: ImprovementPoint[]
        weekly_roadmap: WeeklyRoadmap
    }
    page_info: {
        current_page: number
        total_pages: number
        total_elements: number
        has_next: boolean
        has_previous: boolean
    }
}>

export type ResponseCreateProjectDto = CommonResponse<{
    project_id: number
    project_title: string
    message: string
}>