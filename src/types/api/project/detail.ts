export interface TeamRoleField {
    role_field: string;
    label_en?: string;
    count: number;
}

export interface TeamRole {
    role: string;
    count: number;
    role_fields: TeamRoleField[];
}

export interface Leader {
    user_id: number;
    name: string;
    profile_image_url: string | null;
}

export interface TeamMemberProject {
    project_id: number;
    title: string;
    description: string;
    image_name: string | null;
    created_at: string;
    ended_at: string | null;
}

export interface DefaultInfo {
    project_id: number;
    project_title: string;
    description: string | null;
    planned_started_on: string | null;
    planned_ended_on: string | null;
    image_name: string | null;
    recruitment_status?: string;
    team_roles: { roles: TeamRole[] } | TeamRole[];
    leader?: Leader;
    team_member_projects: TeamMemberProject[];
}

export interface Field {
    field_name: string;
    is_selected: boolean;
}

export interface Fields {
    project_id: number;
    fields: Field[];
}

export interface Purposes {
    project_id: number;
    values: string[];
}

export interface Functions {
    project_id: number;
    values: string[];
}

export interface ServiceUsers {
    project_id: number;
    values: string[];
}

export interface PlanFile {
    plan_file_id: number;
    name: string;
    file_name: string;
    plan_file_type: string;
    file_ext: string;
}

export interface PlanFiles {
    project_id: number;
    files: PlanFile[];
}

export interface ProjectDetailDto {
    defaultInfo: DefaultInfo;
    fields: Fields;
    purposes: Purposes;
    functions: Functions;
    serviceUsers: ServiceUsers;
    planFiles: PlanFiles;
}