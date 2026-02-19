import { create } from 'zustand'
import type { EnumItem } from '@/types/api/enums'

export type OnboardingEnumsData = {
	jobs: EnumItem[]
	roles: EnumItem[]
	roleFields: Record<string, EnumItem[]>
	skillCategories: EnumItem[]
	skillsByCategory: Record<string, EnumItem[]>
	interestFields: EnumItem[]
	goals: EnumItem[]
}

const initialData: OnboardingEnumsData = {
	jobs: [],
	roles: [],
	roleFields: {},
	skillCategories: [],
	skillsByCategory: {},
	interestFields: [],
	goals: [],
}

interface OnboardingEnumsState extends OnboardingEnumsData {
	isLoading: boolean
	error: string | null
	setEnums: (data: OnboardingEnumsData) => void
	setLoading: (loading: boolean) => void
	setError: (error: string | null) => void
}

export const useOnboardingEnumsStore = create<OnboardingEnumsState>(set => ({
	...initialData,
	isLoading: false,
	error: null,

	setEnums: (data: OnboardingEnumsData) =>
		set({
			...data,
			error: null,
		}),

	setLoading: (isLoading: boolean) => set({ isLoading }),

	setError: (error: string | null) => set({ error }),
}))
