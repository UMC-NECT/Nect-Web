import type { ResponseFieldDto, ResponseGoalDto, ResponseInterestFieldDto, ResponseJobsDto, ResponseRoleDto, ResponseRoleFieldDto, ResponseSkillCategoryDto, ResponseSkillDto } from '@/types/api/enums'
import { api } from '@/utils/AxiosInstance'

/** 사용 가능한 모든 스킬 카테고리 목록을 조회합니다. (디자인, 기술, 기획, 마케팅, 기타) */
export const getSkillCategory = async (): Promise<ResponseSkillCategoryDto> => {
	const { data } = await api.get('/api/v1/enums/skill-categories')
	return data
}

/** 선택한 카테고리의 스킬 목록을 조회합니다. (예: 디자인 선택 시 Figma, Photoshop 등) */
export const getSkill = async (category: string): Promise<ResponseSkillDto> => {
    const {data} = await api.get(`/api/v1/enums/category-skills?category=${category}`)
    return data
}

/** 모든 역할의 직종 목록을 조회합니다. (role 파라미터 없음) */
export const getFields = async (): Promise<ResponseFieldDto> => {
    const {data} = await api.get('/api/v1/enums/fields')
    return data
}

/** 사용 가능한 모든 목표 목록을 조회합니다. (포트폴리오 제작, 팀 협업 능력 향상 등) */
export const getGoals = async (): Promise<ResponseGoalDto> => {
    const {data} = await api.get('/api/v1/enums/goals')
    return data
}

/** 사용 가능한 모든 관심분야 목록을 조회합니다. (IT·웹/모바일, 금융·핀테크 등) */
export const getInterestFields = async (): Promise<ResponseInterestFieldDto> => {
    const {data} = await api.get('/api/v1/enums/interest-fields')
    return data
}

/** 사용 가능한 모든 직업 목록을 조회합니다. (직장인, 학생, 구직자 등) */
export const getJobs = async (): Promise<ResponseJobsDto> => {
    const {data} = await api.get('/api/v1/enums/jobs')
    return data
}

/** 사용 가능한 모든 역할 목록을 조회합니다. (디자이너, 개발자, 기획자, 마케터, 기타) */
export const getRoles = async (): Promise<ResponseRoleDto> => {
    const {data} = await api.get('/api/v1/enums/roles')
    return data
}

/** 선택한 역할에 맞는 직종 목록을 조회합니다. (예: 개발자 선택 시 프론트엔드, 백엔드 등) */
export const getRoleFields = async (role: string): Promise<ResponseRoleFieldDto> => {
    const {data} = await api.get(`/api/v1/enums/role-fields?role=${role}`)
    return data
}