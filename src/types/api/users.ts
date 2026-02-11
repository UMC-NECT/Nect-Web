import type { CommonResponse } from "./commonResponse"

export type RequestLoginDto = {
    email: string
    password: string
    autoLoginEnabled: boolean
}

export type ResponseLoginDto = CommonResponse<{
    grantType: string
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
    isOnboardingCompleted: boolean
}>

export type RequestSignupDto = {
    email: string
    password: string
    passwordConfirm: string
    name: string
    phoneNumber: string
}

export type ResponseSignupDto = CommonResponse<{
    grantType: string
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
}>

export type RequestSetupDto = {
	nickname: string
	birthDate: string
	job: string
	role: string
	fields: { field: string; customField: string | null }[]
	skills: { skillCategory: string; skill: string; customSkillName: string | null }[]
	interests: string[]
	firstGoal: string
	collaborationStyle: {
		planning: number
		logic: number
		leadership: number
	}
}

export type RequestAgreeDto = {
    termsAgreed: boolean
    privacyAgreed: boolean
    marketingAgreed: boolean
    email?: string
}

export type RequestCheckDto = {
    type: 'EMAIL' | 'NICKNAME' | 'PHONE'
    value: string
}

export type ResponseCheckDto = CommonResponse<{
    available: boolean
}>

export type ResponseEmailDto = CommonResponse<{
    email: string
}>

export type RequestRefreshTokenDto = {
    refreshToken: string
}

export type ResponseRefreshTokenDto = CommonResponse<{
    grantType: string
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: string
    refreshTokenExpiresAt: string
}>

export type ResponseProfileDto = CommonResponse<{
    userId: number
    imageUrl: string
    name: string
    email: string
    role: string
}>

export type ResponseProfileAnalysisDto = CommonResponse<{
    profileType: string
    tags: string[]
    collaborationStyle: {
        planning: number
        logic: number
        supporter: number
        execution: number
        empathy: number
        leadership: number
    }
    skills: {
        category: string
        skill_names: string[]
    }[]
    roleRecommendation: {
        leader: string
        team_member: string
    }
    growthGuide: {
        order: number
        tip: string
        title: string
        content: string
    }[]
}>