import type { Part } from "../part"
import type { CommonResponse } from "./commonResponse"

export type ResponsePartsDto = CommonResponse<{
    parts: Part[]
}>

export type ResponseUsersDto = CommonResponse<{
    users: {
        user_id: number
        name: string
        nickname: string
        member_type: string
        profile_image_url: string
        role_field: string | null
        part_label: string | null
        custom_role_field_name: string | null
        bio: string | null
    }[]
}>