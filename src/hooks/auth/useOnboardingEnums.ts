import { useQuery } from '@tanstack/react-query'
import type { EnumItem } from '@/types/api/enums'
import {
	getJobs,
	getRoles,
	getRoleFields,
	getSkillCategory,
	getSkill,
	getInterestFields,
	getGoals,
} from '@/api/enums'

const ONBOARDING_ENUMS_QUERY_KEY = ['onboardingEnums'] as const

const fetchOnboardingEnums = async () => {
	const [jobsRes, rolesRes, skillCategoriesRes, interestRes, goalsRes] = await Promise.all([
		getJobs(),
		getRoles(),
		getSkillCategory(),
		getInterestFields(),
		getGoals(),
	])

	const jobs = jobsRes.body ?? []
	const roles = rolesRes.body ?? []
	const skillCategories = skillCategoriesRes.body ?? []
	const interestFields = interestRes.body ?? []
	const goals = goalsRes.body ?? []

	const roleFields: Record<string, EnumItem[]> = {}
	await Promise.all(
		roles.map(async role => {
			const res = await getRoleFields(role.value)
			roleFields[role.value] = res.body?.fields ?? []
		})
	)

	const skillsByCategory: Record<string, EnumItem[]> = {}
	await Promise.all(
		skillCategories.map(async cat => {
			const res = await getSkill(cat.value)
			skillsByCategory[cat.value] = res.body?.skills ?? []
		})
	)

	return {
		jobs,
		roles,
		roleFields,
		skillCategories,
		skillsByCategory,
		interestFields,
		goals,
	}
}

export const useOnboardingEnums = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ONBOARDING_ENUMS_QUERY_KEY,
		queryFn: fetchOnboardingEnums,
		staleTime: Infinity,
		gcTime: Infinity,
	})

	return {
		jobs: data?.jobs ?? [],
		roles: data?.roles ?? [],
		roleFields: data?.roleFields ?? {},
		skillCategories: data?.skillCategories ?? [],
		skillsByCategory: data?.skillsByCategory ?? {},
		interestFields: data?.interestFields ?? [],
		goals: data?.goals ?? [],
		isLoading,
		error: error ? (error instanceof Error ? error.message : 'enum 목록을 불러오지 못했습니다.') : null,
	}
}
