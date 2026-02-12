import { create } from 'zustand'
import type { Part } from '@/types/part'

export interface Person {
	id: number
	name: string
	roleId: number
	image: string
}

/** Part와 동일. roles는 파트 API(getParts) 응답으로 setRoles로 주입 */
export type Role = Part

/** Role(Part) 표시 이름: part_label 우선, 없으면 custom_role_field_name */
export const getRoleDisplayName = (role: Role): string =>
	role.part_label ?? role.custom_role_field_name ?? ''

interface TeamStore {
	// 데이터 (roles는 파트 API setRoles, persons는 유저 API setPersons로 설정)
	persons: Person[]
	roles: Role[]

	// Person 액션
	setPersons: (persons: Person[]) => void
	addPerson: (person: Person) => void
	updatePerson: (personId: number, updates: Partial<Person>) => void
	removePerson: (personId: number) => void

	// Role(Part) 액션
	setRoles: (roles: Role[]) => void
	addRole: (role: Role) => void
	updateRole: (partId: number, updates: Partial<Role>) => void
	removeRole: (partId: number) => void
}

export const useTeamStore = create<TeamStore>(set => ({
	persons: [],
	roles: [],

	setPersons: persons => set({ persons }),
	addPerson: person =>
		set(state => ({
			persons: [...state.persons, person],
		})),
	updatePerson: (personId, updates) =>
		set(state => ({
			persons: state.persons.map(p => (p.id === personId ? { ...p, ...updates } : p)),
		})),
	removePerson: personId =>
		set(state => ({
			persons: state.persons.filter(p => p.id !== personId),
		})),

	setRoles: roles => set({ roles }),
	addRole: role =>
		set(state => ({
			roles: state.roles.some(r => r.part_id === role.part_id) ? state.roles : [...state.roles, role],
		})),
	updateRole: (partId, updates) =>
		set(state => ({
			roles: state.roles.map(r => (r.part_id === partId ? { ...r, ...updates } : r)),
		})),
	removeRole: partId =>
		set(state => ({
			roles: state.roles.filter(r => r.part_id !== partId),
		})),
}))
