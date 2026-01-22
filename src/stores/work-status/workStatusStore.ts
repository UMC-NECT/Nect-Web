import { create } from 'zustand'
import type { MissionStatus } from '@/types/missionStatus'
import type { Progress } from '@/types/progress'

export interface WorkStatusItem {
	id: number
	team: string
	title: string
	status: MissionStatus
	todo: {
		id: number
		done: number
		total: number
	}
	dueDate?: string // "2025.11.21" 형식
	participants?: { id: number; name: string; avatar: string }[]
	links?: string | string[]
	attachments?: number
	variant?: 'Default' | 'Minimum' | 'Edit'
	isEdit?: boolean
}

interface WorkStatusStore {
	workStatusItems: WorkStatusItem[]
	setWorkStatusItems: (items: WorkStatusItem[]) => void
	addWorkStatusItem: (item: WorkStatusItem) => void
	updateWorkStatusItem: (id: number, updates: Partial<WorkStatusItem>) => void
	removeWorkStatusItem: (id: number) => void
	getWorkStatusItemsByStatus: (status: MissionStatus) => WorkStatusItem[]
	getWorkStatusItemsByTeam: (team: string) => WorkStatusItem[]
	getProgressByTeam: (team: string) => Progress
	getStatusCounts: () => Record<MissionStatus, number>
}

// 임시 데이터
const initialWorkStatusItems: WorkStatusItem[] = [
	{
		id: 1,
		team: 'PM',
		title: '할 일 세부 내용 (위크 미션)',
		status: 'planning',
		todo: { id: 1, done: 1, total: 3 },
		dueDate: '2026.01.12',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
	},
	{
		id: 2,
		team: 'Frontend',
		title: '할 일 세부 내용 (위크 미션) 두줄까지 가능',
		status: 'planning',
		todo: { id: 2, done: 4, total: 4 },
		dueDate: '2026.01.15',
		links: 'Figma,PDF',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
	},
	{
		id: 3,
		team: 'Backend',
		title: '할 일 세부 내용 (위크 미션)',
		status: 'planning',
		todo: { id: 3, done: 4, total: 4 },
		dueDate: '2026.01.18',
		links: 'Word,Excel,PPT',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
	},
	{
		id: 4,
		team: 'Design',
		title: '할 일 세부 내용 (위크 미션)',
		status: 'planning',
		todo: { id: 4, done: 3, total: 3 },
		dueDate: '2026.01.22',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
	},
	{
		id: 5,
		team: 'Frontend',
		title: '할 일 세부 내용 (위크 미션)',
		status: 'in_progress',
		todo: { id: 5, done: 2, total: 4 },
		dueDate: '2026.01.14',
		links: ['Figma', 'PDF'],
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
		isEdit: true,
	},
	{
		id: 6,
		team: 'PM',
		title: '할 일 세부 내용 (위크 미션) 두줄까지 가능',
		status: 'in_progress',
		todo: { id: 6, done: 4, total: 4 },
		dueDate: '2026.01.20',
		links: 'Figma,Word',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
	},
	{
		id: 7,
		team: 'PM',
		title: '그 이상은 점점점 처리 그 이상은 점점점 처리 그 이상은 점점점 처리',
		status: 'in_progress',
		todo: { id: 7, done: 4, total: 4 },
		dueDate: '2026.01.25',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
	},
	{
		id: 8,
		team: 'Backend',
		title: '할 일 세부 내용 (위크 미션)',
		status: 'completed',
		todo: { id: 8, done: 4, total: 4 },
		dueDate: '2026.01.10',
		links: ['PDF', 'Zip'],
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
	},
	{
		id: 9,
		team: 'PM',
		title: '할 일 세부 내용 (위크 미션)',
		status: 'completed',
		todo: { id: 9, done: 2, total: 4 },
		dueDate: '2026.01.16',
		links: 'Excel,PPT,Word',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
	},
	{
		id: 10,
		team: 'PM',
		title: '할 일 세부 내용 (위크 미션)',
		status: 'completed',
		todo: { id: 10, done: 4, total: 4 },
		dueDate: '2026.01.28',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
	},
	{
		id: 11,
		team: 'PM',
		title: '할 일 세부 내용 &할 일 세부 내용',
		status: 'backlog',
		todo: { id: 11, done: 1, total: 3 },
		dueDate: '2026.01.11',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
		variant: 'Minimum',
		isEdit: true,
	},
	{
		id: 12,
		team: 'PM',
		title: '할 일 세부 내용 (위크 미션)',
		status: 'backlog',
		todo: { id: 12, done: 1, total: 3 },
		dueDate: '2026.01.17',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
		variant: 'Minimum',
	},
	{
		id: 13,
		team: 'PM',
		title: '할 일 세부 내용 (위크 미션)',
		status: 'backlog',
		todo: { id: 13, done: 1, total: 3 },
		dueDate: '2026.01.21',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
		variant: 'Minimum',
	},
	{
		id: 14,
		team: 'PM',
		title: '할 일 세부 내용 (위크 미션)',
		status: 'backlog',
		todo: { id: 14, done: 1, total: 3 },
		dueDate: '2026.01.26',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
		variant: 'Minimum',
	},
	{
		id: 15,
		team: 'PM',
		title: '할 일 세부 내용 (위크 미션)',
		status: 'backlog',
		todo: { id: 15, done: 1, total: 3 },
		dueDate: '2026.01.29',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
		variant: 'Minimum',
	},
	{
		id: 16,
		team: 'PM',
		title: '할 일 세부 내용 (위크 미션)',
		status: 'backlog',
		todo: { id: 16, done: 1, total: 3 },
		dueDate: '2026.01.30',
		attachments: 1,
		participants: [
			{ id: 1, name: '시루', avatar: 'https://placehold.co/20x20' },
			{ id: 2, name: '이방토', avatar: 'https://placehold.co/20x20' },
		],
		variant: 'Minimum',
	},
]

export const useWorkStatusStore = create<WorkStatusStore>(set => ({
	workStatusItems: initialWorkStatusItems,
	setWorkStatusItems: items => set({ workStatusItems: items }),
	addWorkStatusItem: item =>
		set(state => ({
			workStatusItems: [...state.workStatusItems, item],
		})),
	updateWorkStatusItem: (id, updates) =>
		set(state => ({
			workStatusItems: state.workStatusItems.map(item => (item.id === id ? { ...item, ...updates } : item)),
		})),
	removeWorkStatusItem: id =>
		set(state => ({
			workStatusItems: state.workStatusItems.filter(item => item.id !== id),
		})),
	getWorkStatusItemsByStatus: (status: MissionStatus): WorkStatusItem[] => {
		const state = useWorkStatusStore.getState()
		return state.workStatusItems.filter((item: WorkStatusItem) => item.status === status)
	},
	getWorkStatusItemsByTeam: (team: string): WorkStatusItem[] => {
		const state = useWorkStatusStore.getState()
		return state.workStatusItems.filter((item: WorkStatusItem) => item.team === team)
	},
	getProgressByTeam: (team: string): Progress => {
		const state = useWorkStatusStore.getState()
		const teamItems = state.workStatusItems.filter((item: WorkStatusItem) => item.team === team)
		return {
			planning: teamItems.filter((item: WorkStatusItem) => item.status === 'planning').length,
			inProgress: teamItems.filter((item: WorkStatusItem) => item.status === 'in_progress').length,
			completed: teamItems.filter((item: WorkStatusItem) => item.status === 'completed').length,
		}
	},
	getStatusCounts: (): Record<MissionStatus, number> => {
		const state = useWorkStatusStore.getState()
		return {
			planning: state.workStatusItems.filter((item: WorkStatusItem) => item.status === 'planning').length,
			in_progress: state.workStatusItems.filter((item: WorkStatusItem) => item.status === 'in_progress').length,
			completed: state.workStatusItems.filter((item: WorkStatusItem) => item.status === 'completed').length,
			backlog: state.workStatusItems.filter((item: WorkStatusItem) => item.status === 'backlog').length,
		}
	},
}))
