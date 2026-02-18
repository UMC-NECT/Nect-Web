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
import { useShallow } from 'zustand/react/shallow'
import { useOnboardingEnumsStore } from '@/stores/onboardingEnumsStore'

/** 앱 진입 시 한 번만 호출하여 스토어에 저장. OnboardingEnumsLoader에서 사용 */
export const fetchOnboardingEnums = async () => {
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

/** 스토어에 저장된 온보딩 enum 사용. useShallow로 참조만 바뀌고 내용 동일 시 리렌더 방지(무한 루프 방지) */
export const useOnboardingEnums = () =>
	useOnboardingEnumsStore(
		useShallow(state => ({
			jobs: state.jobs,
			roles: state.roles,
			roleFields: state.roleFields,
			skillCategories: state.skillCategories,
			skillsByCategory: state.skillsByCategory,
			interestFields: state.interestFields,
			goals: state.goals,
			isLoading: state.isLoading,
			error: state.error,
		}))
	)
