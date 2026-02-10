export interface TeamRole {
    role_field: string;
    required_count: number;
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
    description: string;
    planned_started_on: string;
    planned_ended_on: string;
    image_name: string | null;
    team_roles: TeamRole[];
    leader: Leader;
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