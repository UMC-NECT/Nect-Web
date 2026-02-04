import { create } from 'zustand'
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

interface OnboardingEnumsState {
	jobs: EnumItem[]
	roles: EnumItem[]
	roleFields: Record<string, EnumItem[]>
	skillCategories: EnumItem[]
	skillsByCategory: Record<string, EnumItem[]>
	interestFields: EnumItem[]
	goals: EnumItem[]
	isLoading: boolean
	error: string | null
	fetchAll: () => Promise<void>
}

export const useOnboardingEnums = create<OnboardingEnumsState>(set => ({
	jobs: [],
	roles: [],
	roleFields: {},
	skillCategories: [],
	skillsByCategory: {},
	interestFields: [],
	goals: [],
	isLoading: false,
	error: null,

	fetchAll: async () => {
		set({ isLoading: true, error: null })

		try {
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

			set({
				jobs,
				roles,
				roleFields,
				skillCategories,
				skillsByCategory,
				interestFields,
				goals,
				isLoading: false,
				error: null,
			})
			
		} catch (e) {
			const message = e instanceof Error ? e.message : 'enum 목록을 불러오지 못했습니다.'
			set({
				isLoading: false,
				error: message,
			})
		}
	},
}))
