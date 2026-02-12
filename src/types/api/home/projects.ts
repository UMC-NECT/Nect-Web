/** 역할별 상세 (role_fields: 세부 분야별 인원 수) */
export interface ProjectCardRoleField {
    role_field: string;
    count: number;
}

export interface ProjectCardRoleItem {
    role: string;
    count: number;
    role_fields: ProjectCardRoleField[];
}

export interface ProjectCardRoles {
    roles: ProjectCardRoleItem[];
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
    interestField?: string | null;
    /** 추천 프로젝트: roles.roles[].role_fields, 구 API: Record<role, count> */
    roles?: ProjectCardRoles | Record<string, number>;
}

export interface ResponseProjectsDto {
    projects: ProjectCard[];
}