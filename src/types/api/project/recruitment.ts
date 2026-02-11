export interface RecruitmentDto {
    recruitmentId: number;
    roleField: string;
    customField: string | null;
    capacity: number;
    requirements: string[];
}
