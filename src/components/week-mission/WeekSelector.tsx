import ChevronLeftIcon from '@/assets/icons/common/chevron-left.svg?react'
import ChevronRightIcon from '@/assets/icons/common/chevron-right.svg?react'
import { useWeekSelector } from '@/hooks/week-mission/useWeekSelector'

const WeekSelector = () => {
    const { weekInfo, handlePreviousWeek, handleNextWeek } = useWeekSelector()

    if (!weekInfo) {
        return null
    }

    const { year, month, week: weekNumber } = weekInfo

    return (
        <div className='flex items-center gap-2'>
            <button onClick={handlePreviousWeek} className='cursor-pointer hover:opacity-70'>
                <ChevronLeftIcon className='w-4 h-4' />
            </button>
            <p className='title-3 font-bold text-neutral-800'>
                {year}년 {month}월 {weekNumber}주차
            </p>
            <button onClick={handleNextWeek} className='cursor-pointer hover:opacity-70'>
                <ChevronRightIcon className='w-4 h-4' />
            </button>
        </div>
    )
}

export default WeekSelector