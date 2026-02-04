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
}>

export type RequestSignupDto = {
    email: string
    password: string
    passwordConfirm: string
    name: string
    phoneNumber: string
}

export type RequestSetupDto = {
    nickname: string
    birthDate: string
    job: string
    role: string
    fields: [
        field: string,
        customField: string | null
    ]
    skills: [
        skillCategory: string,
        skill: string,
        customSkillName: string | null
    ]
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