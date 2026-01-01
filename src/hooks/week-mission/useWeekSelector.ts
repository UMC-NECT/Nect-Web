import { useEffect } from 'react'
import { useWeekStore } from '@/stores/weekStore'
import { getDateByWeekOffset, getYearMonthWeek, getWeekDates } from '@/utils/dateUtils'

export const useWeekSelector = () => {
    const { weekOffset, weekInfo, setWeekOffset, setWeekInfo } = useWeekStore()

    useEffect(() => {
        // 주차 정보 계산 및 저장
        const targetDate = getDateByWeekOffset(weekOffset)
        const { year, month, week: weekNumber } = getYearMonthWeek(targetDate)
        const dates = getWeekDates(weekOffset)

        setWeekInfo({
            year,
            month,
            week: weekNumber,
            dates,
        })
    }, [weekOffset, setWeekInfo])

    // 초기 렌더링 시 주차 정보 설정 (오늘 날짜 기준)
    useEffect(() => {
        if (weekOffset === 0 && !weekInfo) {
            const targetDate = getDateByWeekOffset(0)
            const { year, month, week: weekNumber } = getYearMonthWeek(targetDate)
            const dates = getWeekDates(0)

            setWeekInfo({
                year,
                month,
                week: weekNumber,
                dates,
            })
        }
    }, [weekOffset, weekInfo, setWeekInfo])

    const handlePreviousWeek = () => {
        setWeekOffset(weekOffset - 1)
    }

    const handleNextWeek = () => {
        setWeekOffset(weekOffset + 1)
    }

    return {
        weekInfo,
        handlePreviousWeek,
        handleNextWeek,
    }
}

