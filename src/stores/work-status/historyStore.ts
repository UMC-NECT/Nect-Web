import { create } from 'zustand'

export interface HistoryItem {
	id: number
	team: string
	user: string
	action: string
	time: string
	iconVariant: 'add' | 'share' | 'app'
	app?: string
}

interface HistoryStore {
	historyItems: HistoryItem[]
	setHistoryItems: (items: HistoryItem[]) => void
	addHistoryItem: (item: HistoryItem) => void
	removeHistoryItem: (id: number) => void
	getRecentHistory: (limit?: number) => HistoryItem[]
}

// 임시 데이터
const initialHistoryItems: HistoryItem[] = [
	{
		id: 1,
		team: 'PM',
		user: '시루',
		action: 'Sever 새 프로세스를 추가하였습니다.',
		time: '오늘  오전 11:49',
		iconVariant: 'add',
	},
	{
		id: 2,
		team: 'Design',
		user: '이방토',
		action: '수정) 와이어프레임 → UI 작업 Figma 파일을 공유했습니다',
		time: '오늘  오전 09:40',
		iconVariant: 'app',
		app: 'figma',
	},
	{
		id: 3,
		team: 'Design',
		user: '이방토',
		action: '와이어프레임 → UI 작업 Figma 파일을 공유했습니다',
		time: '오늘  오전 09:40',
		iconVariant: 'app',
		app: 'figma',
	},
	{
		id: 4,
		team: 'Design',
		user: '이방토',
		action: '와이어프레임 → UI 작업 Figma 파일을 공유했습니다',
		time: '오늘  오전 09:40',
		iconVariant: 'share',
	},
	{
		id: 5,
		team: 'Design',
		user: '이방토',
		action: '와이어프레임 → UI 작업 Figma 파일을 공유했습니다',
		time: '오늘  오전 09:40',
		iconVariant: 'share',
	},
	{
		id: 6,
		team: 'Design',
		user: '이방토',
		action: '와이어프레임 → UI 작업 Figma 파일을 공유했습니다',
		time: '오늘  오전 09:40',
		iconVariant: 'share',
	},
]

export const useHistoryStore = create<HistoryStore>(set => ({
	historyItems: initialHistoryItems,
	setHistoryItems: items => set({ historyItems: items }),
	addHistoryItem: item =>
		set(state => ({
			historyItems: [item, ...state.historyItems],
		})),
	removeHistoryItem: id =>
		set(state => ({
			historyItems: state.historyItems.filter(item => item.id !== id),
		})),
	getRecentHistory: (limit = 10): HistoryItem[] => {
		const state = useHistoryStore.getState()
		return state.historyItems.slice(0, limit)
	},
}))
