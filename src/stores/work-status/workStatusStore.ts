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
	mission_number?: number
	/** API start_date (YYYY.MM.DD). order API 요청 시 필요 */
	startDate?: string
	dueDate?: string // "2025.11.21" 형식
	/** API 응답 left_day (D-day 표시용) */
	leftDay?: number
	participants?: { id: number; name: string; avatar: string }[]
	links?: string | string[]
	attachments?: number
	/** 파트 조회 API attachment_summary (있으면 첨부 파일/링크 개수·확장자 표시) */
	attachmentSummary?: {
		file_count: number
		link_count: number
		total_count: number
		file_extensions: string[]
	}
	/** 파트 조회 API attachments_meta (상위 2개 아이콘 + 나머지 +N 표시용) */
	attachmentsMeta?: Array<{ type: 'FILE' | 'LINK'; file_ext: string | null }>
	variant?: 'Default' | 'Minimum' | 'Edit'
	isEdit?: boolean
}

interface WorkStatusStore {
	workStatusItems: WorkStatusItem[]
	setWorkStatusItems: (items: WorkStatusItem[]) => void
	addWorkStatusItem: (item: WorkStatusItem) => void
	updateWorkStatusItem: (id: number, updates: Partial<WorkStatusItem>) => void
	removeWorkStatusItem: (id: number) => void
	moveWorkStatusItem: (id: number, newStatus: MissionStatus, newIndex: number) => void
	getWorkStatusItemsByStatus: (status: MissionStatus) => WorkStatusItem[]
	getWorkStatusItemsByTeam: (team: string) => WorkStatusItem[]
	getProgressByTeam: (team: string) => Progress
	getStatusCounts: () => Record<MissionStatus, number>
}

export const useWorkStatusStore = create<WorkStatusStore>(set => ({
	workStatusItems: [],
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
	moveWorkStatusItem: (id, newStatus, newIndex) =>
		set(state => {
			const item = state.workStatusItems.find(item => item.id === id)
			if (!item) return state

			// 기존 아이템 제거
			const itemsWithoutMoved = state.workStatusItems.filter(item => item.id !== id)

			// 새 상태의 아이템들 가져오기
			const itemsInNewStatus = itemsWithoutMoved.filter(item => item.status === newStatus)

			// 새 위치에 아이템 삽입
			const updatedItem = { ...item, status: newStatus }
			const newItems = [...itemsInNewStatus]
			newItems.splice(newIndex, 0, updatedItem)

			// 다른 상태의 아이템들과 병합
			const otherItems = itemsWithoutMoved.filter(item => item.status !== newStatus)

			return {
				workStatusItems: [...otherItems, ...newItems],
			}
		}),
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
