import { create } from 'zustand'

export interface Person {
	id: number
	name: string
	color: string
	image: string
}

export interface Role {
	id: number
	name: string
	color: string
}

export interface Mission {
	id: number
	missionNumber: number
}

interface MissionModalStore {
	persons: Person[]
	roles: Role[]
	missions: Mission[]
	selectedPersons: Person[]
	selectedRoles: Role[]
	selectedMission: Mission | null
	setSelectedPersons: (persons: Person[]) => void
	setSelectedRoles: (roles: Role[]) => void
	setSelectedMission: (mission: Mission | null) => void
	addSelectedPerson: (person: Person) => void
	removeSelectedPerson: (personId: number) => void
	addSelectedRole: (role: Role) => void
	removeSelectedRole: (roleId: number) => void
}

// 임시 데이터
const initialPersons: Person[] = [
	{ id: 1, name: '시루', color: 'bg-roletag-purple', image: 'https://placehold.co/24x24' },
	{ id: 2, name: '이방토', color: 'bg-roletag-blue', image: 'https://placehold.co/24x24' },
	{ id: 3, name: '김개발', color: 'bg-roletag-green', image: 'https://placehold.co/24x24' },
	{ id: 4, name: '박디자인', color: 'bg-roletag-pink', image: 'https://placehold.co/24x24' },
	{ id: 5, name: '최기획', color: 'bg-roletag-orange', image: 'https://placehold.co/24x24' },
	{ id: 6, name: '정마케팅', color: 'bg-roletag-yellow', image: 'https://placehold.co/24x24' },
	{ id: 7, name: '한영업', color: 'bg-roletag-gray', image: 'https://placehold.co/24x24' },
	{ id: 8, name: '오데이터', color: 'bg-roletag-purple', image: 'https://placehold.co/24x24' },
	{ id: 9, name: '송보안', color: 'bg-roletag-blue', image: 'https://placehold.co/24x24' },
	{ id: 10, name: '임인프라', color: 'bg-roletag-green', image: 'https://placehold.co/24x24' },
	{ id: 11, name: '강리서치', color: 'bg-roletag-pink', image: 'https://placehold.co/24x24' },
	{ id: 12, name: '윤전략', color: 'bg-roletag-orange', image: 'https://placehold.co/24x24' },
]

const initialRoles: Role[] = [
	{ id: 1, name: 'PM', color: 'bg-roletag-purple' },
	{ id: 2, name: 'Design', color: 'bg-roletag-pink' },
	{ id: 3, name: 'Backend', color: 'bg-roletag-blue' },
	{ id: 4, name: 'Frontend', color: 'bg-roletag-green' },
	{ id: 5, name: 'QA', color: 'bg-roletag-yellow' },
]

const initialMissions: Mission[] = [
	{ id: 1, missionNumber: 1 },
	{ id: 2, missionNumber: 2 },
	{ id: 3, missionNumber: 3 },
	{ id: 4, missionNumber: 4 },
	{ id: 5, missionNumber: 5 },
]

export const useMissionModalStore = create<MissionModalStore>(set => ({
	persons: initialPersons,
	roles: initialRoles,
	missions: initialMissions,
	selectedPersons: [],
	selectedRoles: [],
	selectedMission: null,
	setSelectedPersons: persons => set({ selectedPersons: persons }),
	setSelectedRoles: roles => set({ selectedRoles: roles }),
	setSelectedMission: mission => set({ selectedMission: mission }),
	addSelectedPerson: person =>
		set(state => ({
			selectedPersons: state.selectedPersons.some(p => p.id === person.id)
				? state.selectedPersons
				: [...state.selectedPersons, person],
		})),
	removeSelectedPerson: personId =>
		set(state => ({
			selectedPersons: state.selectedPersons.filter(p => p.id !== personId),
		})),
	addSelectedRole: role =>
		set(state => ({
			selectedRoles: state.selectedRoles.some(r => r.id === role.id)
				? state.selectedRoles
				: [...state.selectedRoles, role],
		})),
	removeSelectedRole: roleId =>
		set(state => ({
			selectedRoles: state.selectedRoles.filter(r => r.id !== roleId),
		})),
}))
