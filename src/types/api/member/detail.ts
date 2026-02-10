export interface UserCareer {
    userCareerId: number;
    projectName: string;
    industryField: string;
    startDate: string;
    endDate: string;
    isOngoing: boolean;
    role: string;
    achievements: {
        userAchievementId: number;
        title: string;
        content: string;
    }[];
}

export interface UserPortfolio {
    userPortfolioId: number;
    title: string;
    link: string;
    fileUrl: string;
}

export interface UserProjectHistory {
    userProjectHistoryId: number;
    projectName: string;
    projectImage: string;
    projectDescription: string;
    startYearMonth: string;
    endYearMonth: string;
}

export interface UserSkill {
    skill: string;
    skillLabel: string;
    isSelected: boolean;
}

export interface UserSkillCategory {
    category: string;
    categoryLabel: string;
    skills: UserSkill[];
}

export interface MemberDetailDto {
    userId: number;
    name: string;
    nickname: string;
    email: string;
    role: string;
    profileImageUrl: string | null;
    bio: string | null;
    coreCompetencies: string | null;
    userStatus: string;
    isPublicMatching: boolean;
    careerDuration: string | null;
    interestedJob: string | null;
    interestedField: string | null;
    careers: UserCareer[] | null;  // null 가능성 추가
    portfolios: UserPortfolio[] | null;  // null 가능성 추가
    projectHistories: UserProjectHistory[] | null;  // null 가능성 추가
    skills: UserSkillCategory[] | null;  // null 가능성 추가
    profileType: string | null;
    tags: string[] | null;  // null 가능성 추가
}