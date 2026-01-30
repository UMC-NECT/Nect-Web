import { create } from 'zustand'

export interface Person {
	id: number
	name: string
	roleId: number
	image: string
}

export interface Role {
	id: number
	name: string
}

interface TeamStore {
	// 데이터
	persons: Person[]
	roles: Role[]

	// Person 액션
	setPersons: (persons: Person[]) => void
	addPerson: (person: Person) => void
	updatePerson: (personId: number, updates: Partial<Person>) => void
	removePerson: (personId: number) => void

	// Role 액션
	setRoles: (roles: Role[]) => void
	addRole: (role: Role) => void
	updateRole: (roleId: number, updates: Partial<Role>) => void
	removeRole: (roleId: number) => void
}

// 초기 데이터
const initialPersons: Person[] = [
	{ id: 1, name: '시루', roleId: 1, image: 'https://placehold.co/24x24' }, // PM
	{ id: 2, name: '이방토', roleId: 2, image: 'https://placehold.co/24x24' }, // Design
	{ id: 3, name: '김개발', roleId: 3, image: 'https://placehold.co/24x24' }, // Backend
	{ id: 4, name: '박디자인', roleId: 2, image: 'https://placehold.co/24x24' }, // Design
	{ id: 5, name: '최기획', roleId: 1, image: 'https://placehold.co/24x24' }, // PM
	{ id: 6, name: '정마케팅', roleId: 1, image: 'https://placehold.co/24x24' }, // PM
	{ id: 7, name: '한영업', roleId: 1, image: 'https://placehold.co/24x24' }, // PM
	{ id: 8, name: '오데이터', roleId: 3, image: 'https://placehold.co/24x24' }, // Backend
	{ id: 9, name: '송보안', roleId: 3, image: 'https://placehold.co/24x24' }, // Backend
	{ id: 10, name: '임인프라', roleId: 3, image: 'https://placehold.co/24x24' }, // Backend
	{ id: 11, name: '강리서치', roleId: 2, image: 'https://placehold.co/24x24' }, // Design
	{ id: 12, name: '윤전략', roleId: 1, image: 'https://placehold.co/24x24' }, // PM
]

const initialRoles: Role[] = [
	{ id: 1, name: 'PM' },
	{ id: 2, name: 'Design' },
	{ id: 3, name: 'Backend' },
	{ id: 4, name: 'Frontend' },
	{ id: 5, name: 'QA' },
]

export const useTeamStore = create<TeamStore>(set => ({
	// 데이터
	persons: initialPersons,
	roles: initialRoles,

	// Person 액션
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

	// Role 액션
	setRoles: roles => set({ roles }),
	addRole: role =>
		set(state => ({
			roles: [...state.roles, role],
		})),
	updateRole: (roleId, updates) =>
		set(state => ({
			roles: state.roles.map(r => (r.id === roleId ? { ...r, ...updates } : r)),
		})),
	removeRole: roleId =>
		set(state => ({
			roles: state.roles.filter(r => r.id !== roleId),
		})),
}))
