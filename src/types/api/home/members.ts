export interface MemberCard {
    userId: number;
    imageUrl: string | null;
    name: string;
    part: string;
    introduction: string;
    status: string;
    isScrapped: boolean;
    roles: string[];
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