import { create } from 'zustand'

export interface RadarDataItem {
	subject: string
	value: number
}

interface ProfileAnalysisState {
	type: string
	role: string
	tags: string[]
	radarData: RadarDataItem[]
	setType: (type: string) => void
	setRole: (role: string) => void
	setTags: (tags: string[]) => void
	setRadarData: (data: RadarDataItem[]) => void
}

const initialRadarData: RadarDataItem[] = [
	{ subject: '계획형', value: 65 },
	{ subject: '논리형', value: 80 },
	{ subject: '서포터형', value: 90 },
	{ subject: '실행형', value: 55 },
	{ subject: '공감형', value: 75 },
	{ subject: '리더형', value: 60 },
]

export const useProfileAnalysisStore = create<ProfileAnalysisState>(set => ({
	type: '대인형 서포터',
	role: 'UX.UI 디자이너',
	tags: ['포트폴리오 집중', '신중한 설계자', '비주얼 전문가'],
	radarData: initialRadarData,
	setType: (type: string) => set({ type }),
	setRole: (role: string) => set({ role }),
	setTags: (tags: string[]) => set({ tags }),
	setRadarData: (data: RadarDataItem[]) => set({ radarData: data }),
}))