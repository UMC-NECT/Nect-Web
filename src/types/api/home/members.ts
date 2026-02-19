export interface MemberCard {
    userId: number;
    imageUrl: string | null;
    name: string | null;
    part: string | null;
    introduction: string | null;
    coreCompetencies: string | null;
    status: string;
    isScrapped: boolean;
    roles: string[];
    /** 관심분야 enum value (온보딩 interestFields와 매칭) */
    interestField?: string | null;
}

export interface ResponseMembersDto {
    members: MemberCard[];
}

export interface UserProfile {
    userId: number;
    imageUrl: string | null;
    name: string;
    email: string;
    role: string;
}

export interface ResponseProfileDto {
    userId: number;
    imageUrl: string | null;
    name: string | null;
    email: string | null;
    role: string | null;
}