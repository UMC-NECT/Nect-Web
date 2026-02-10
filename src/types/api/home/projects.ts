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
    roles: Record<string, number>;
}

export interface ResponseProjectsDto {
    projects: ProjectCard[];
}