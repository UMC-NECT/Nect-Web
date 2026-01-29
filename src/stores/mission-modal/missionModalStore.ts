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

export interface Task {
	id: number
	content: string
	isComplete: boolean
}

export interface Feedback {
	id: number
	partName: string
	authorName: string
	content: string
	timestamp?: string
	state: 'default' | 'complete' | 'disabled'
}

import type { MissionStatus } from '@/types/missionStatus'
export type { MissionStatus }

interface MissionModalStore {
	// 기존 데이터
	persons: Person[]
	roles: Role[]
	missions: Mission[]
	selectedPersons: Person[]
	selectedRoles: Role[]
	selectedMission: Mission | null

	// 미션 모달 데이터
	missionNumber: number
	title: string
	selectedParts: Role[]
	selectedAssignees: Person[]
	selectedDuration: string
	missionStatus: MissionStatus
	workContent: string
	tasks: Task[]
	feedbacks: Feedback[]
	mentionedPersons: Person[]

	// 기존 액션
	setSelectedPersons: (persons: Person[]) => void
	setSelectedRoles: (roles: Role[]) => void
	setSelectedMission: (mission: Mission | null) => void
	addSelectedPerson: (person: Person) => void
	removeSelectedPerson: (personId: number) => void
	addSelectedRole: (role: Role) => void
	removeSelectedRole: (roleId: number) => void

	// 미션 모달 액션
	setMissionNumber: (num: number) => void
	setTitle: (title: string) => void
	setSelectedParts: (parts: Role[]) => void
	addSelectedPart: (part: Role) => void
	removeSelectedPart: (partId: number) => void
	setSelectedAssignees: (assignees: Person[]) => void
	addSelectedAssignee: (assignee: Person) => void
	removeSelectedAssignee: (assigneeId: number) => void
	setSelectedDuration: (duration: string) => void
	setMissionStatus: (status: MissionStatus) => void
	setWorkContent: (content: string) => void
	setTasks: (tasks: Task[]) => void
	addTask: (task: Task) => void
	updateTask: (taskId: number, updates: Partial<Task>) => void
	removeTask: (taskId: number) => void
	toggleTask: (taskId: number) => void
	reorderTasks: (activeId: number, overId: number) => void
	setFeedbacks: (feedbacks: Feedback[]) => void
	addFeedback: (feedback: Feedback) => void
	updateFeedback: (feedbackId: number, updates: Partial<Feedback>) => void
	removeFeedback: (feedbackId: number) => void
	toggleFeedback: (feedbackId: number) => void
	setMentionedPersons: (persons: Person[]) => void
	addMentionedPerson: (person: Person) => void
	removeMentionedPerson: (personId: number) => void
	resetMissionModal: () => void
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

// 미션 모달 초기 데이터
const initialTasks: Task[] = []
const initialFeedbacks: Feedback[] = []

const initialMissionModalState = {
	missionNumber: 1,
	title: '',
	selectedParts: [] as Role[],
	selectedAssignees: [] as Person[],
	selectedDuration: '',
	missionStatus: 'planning' as MissionStatus,
	workContent: '',
	tasks: initialTasks,
	feedbacks: initialFeedbacks,
	mentionedPersons: [] as Person[],
}

export const useMissionModalStore = create<MissionModalStore>(set => ({
	// 기존 데이터
	persons: initialPersons,
	roles: initialRoles,
	missions: initialMissions,
	selectedPersons: [],
	selectedRoles: [],
	selectedMission: null,

	// 미션 모달 데이터
	...initialMissionModalState,

	// 기존 액션
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
			selectedRoles: state.selectedRoles.some(r => r.id === role.id) ? state.selectedRoles : [...state.selectedRoles, role],
		})),
	removeSelectedRole: roleId =>
		set(state => ({
			selectedRoles: state.selectedRoles.filter(r => r.id !== roleId),
		})),

	// 미션 모달 액션
	setMissionNumber: num => set({ missionNumber: num }),
	setTitle: title => set({ title }),
	setSelectedParts: parts => set({ selectedParts: parts }),
	addSelectedPart: part =>
		set(state => ({
			selectedParts: state.selectedParts.some(p => p.id === part.id) ? state.selectedParts : [...state.selectedParts, part],
		})),
	removeSelectedPart: partId =>
		set(state => ({
			selectedParts: state.selectedParts.filter(p => p.id !== partId),
		})),
	setSelectedAssignees: assignees => set({ selectedAssignees: assignees }),
	addSelectedAssignee: assignee =>
		set(state => ({
			selectedAssignees: state.selectedAssignees.some(a => a.id === assignee.id)
				? state.selectedAssignees
				: [...state.selectedAssignees, assignee],
		})),
	removeSelectedAssignee: assigneeId =>
		set(state => ({
			selectedAssignees: state.selectedAssignees.filter(a => a.id !== assigneeId),
		})),
	setSelectedDuration: duration => set({ selectedDuration: duration }),
	setMissionStatus: status => set({ missionStatus: status }),
	setWorkContent: content => set({ workContent: content }),
	setTasks: tasks => set({ tasks }),
	addTask: task =>
		set(state => ({
			tasks: [...state.tasks, task],
		})),
	updateTask: (taskId, updates) =>
		set(state => ({
			tasks: state.tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t)),
		})),
	removeTask: taskId =>
		set(state => ({
			tasks: state.tasks.filter(t => t.id !== taskId),
		})),
	toggleTask: taskId =>
		set(state => ({
			tasks: state.tasks.map(t => (t.id === taskId ? { ...t, isComplete: !t.isComplete } : t)),
		})),
	reorderTasks: (activeId, overId) =>
		set(state => {
			const oldIndex = state.tasks.findIndex(t => t.id === activeId)
			const newIndex = state.tasks.findIndex(t => t.id === overId)
			if (oldIndex === -1 || newIndex === -1) return state
			const newTasks = [...state.tasks]
			const [removed] = newTasks.splice(oldIndex, 1)
			newTasks.splice(newIndex, 0, removed)
			return { tasks: newTasks }
		}),
	setFeedbacks: feedbacks => set({ feedbacks }),
	addFeedback: feedback =>
		set(state => ({
			feedbacks: [...state.feedbacks, feedback],
		})),
	updateFeedback: (feedbackId, updates) =>
		set(state => ({
			feedbacks: state.feedbacks.map(f => (f.id === feedbackId ? { ...f, ...updates } : f)),
		})),
	removeFeedback: feedbackId =>
		set(state => ({
			feedbacks: state.feedbacks.filter(f => f.id !== feedbackId),
		})),
	toggleFeedback: feedbackId =>
		set(state => ({
			feedbacks: state.feedbacks.map(f =>
				f.id === feedbackId ? { ...f, state: f.state === 'complete' ? 'default' : 'complete' } : f
			),
		})),
	setMentionedPersons: persons => set({ mentionedPersons: persons }),
	addMentionedPerson: person =>
		set(state => ({
			mentionedPersons: state.mentionedPersons.some(p => p.id === person.id)
				? state.mentionedPersons
				: [...state.mentionedPersons, person],
		})),
	removeMentionedPerson: personId =>
		set(state => ({
			mentionedPersons: state.mentionedPersons.filter(p => p.id !== personId),
		})),
	resetMissionModal: () => set(initialMissionModalState),
}))
