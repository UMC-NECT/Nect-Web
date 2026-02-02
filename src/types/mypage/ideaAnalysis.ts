export interface WeeklyPlanTask {
	task_id: number
	weekly_plan_task_id: number
	weekly_plan_id: number
	field_id: number
	field_name: string
	content: string
}

export interface WeeklyPlan {
	weekly_plan_id: number
	idea_analysis_result_id: number
	week_number: number
	goal: string
	tasks: WeeklyPlanTask[]
}

export interface IdeaAnalysisField {
	idea_analysis_result_field_id: number
	idea_analysis_result_id: number
	field_id: number
	field_name: string
	count: number
}

export interface IdeaAnalysisImprovement {
	improvement_id: number
	idea_analysis_result_id: number
	title: string
	content: string
}

export interface Idea {
	idea_id: number
	user_id: number
	user_name: string
	title: string
	one_line_description: string
	target_and_problem: string
	platform_type: string
	core_feature1: string
	core_feature2: string
	core_feature3: string
	benchmark_services: string
	prototype_due_date: string
	technical_challenges: string
	status: string
	created_at: string
	updated_at: string
}

export interface IdeaAnalysisResult {
	idea_analysis_result_id: number
	idea_id: number
	project_name: string
	recommended_names: string[]
	estimated_duration_weeks: string
	created_at: string
}

export interface IdeaAnalysisData {
	idea: Idea
	idea_analysis_result: IdeaAnalysisResult
	idea_analysis_result_fields: IdeaAnalysisField[]
	idea_analysis_weekly_plans: WeeklyPlan[]
	idea_analysis_improvements: IdeaAnalysisImprovement[]
}
