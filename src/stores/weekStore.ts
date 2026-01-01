import { create } from "zustand"

export interface WeekInfo {
    year: number
    month: number
    week: number
    dates: Date[] // 해당 주의 날짜들
}

interface WeekStore {
    weekOffset: number // 현재 날짜로부터의 주차 오프셋
    weekInfo: WeekInfo | null
    currentWeekIndex: number // WeekDates에서 현재 표시할 주차의 인덱스
    setWeekOffset: (offset: number) => void
    setWeekInfo: (info: WeekInfo) => void
    setCurrentWeekIndex: (index: number) => void
}

export const useWeekStore = create<WeekStore>((set) => ({
    weekOffset: 0,
    weekInfo: null,
    currentWeekIndex: 0, // 기본값: 오늘 날짜 기준 주차
    setWeekOffset: (offset: number) => set({ weekOffset: offset }),
    setWeekInfo: (info: WeekInfo) => set({ weekInfo: info }),
    setCurrentWeekIndex: (index: number) => set({ currentWeekIndex: index }),
}))