export interface RoleField {
    role_field: string;
    count: number;
}

export interface ProjectRole {
    role: string;
    count: number;
    role_fields: RoleField[];
}

export interface ProjectCard {
    projectId: number;
    imageUrl: string | null;
    projectName: string;
    authorName: string;
    authorPart: string;
    introduction: string;
    leftDays: number;
    maxMemberCount: number;
    curMemberCount: number;
    isScrapped: boolean;
    status: string;
    roles: ProjectRole[] | Record<string, number>;
}

export interface ResponseProjectsDto {
    projects: ProjectCard[];
}