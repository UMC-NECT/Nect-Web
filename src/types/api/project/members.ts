export interface ProjectMemberDto {
    user_id: number;
    name: string;
    nickname: string;
    profile_image_url: string | null;
    bio: string;
    role_field: string;
    custom_role_field_name: string | null;
    part_label: string;
    member_type: 'LEADER' | 'MEMBER';
}

export interface ProjectMembersBody {
    users: ProjectMemberDto[];
}
