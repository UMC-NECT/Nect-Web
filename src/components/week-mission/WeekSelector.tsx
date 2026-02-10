import ChevronLeftIcon from '@/assets/icons/week-mission/chevron-left.svg?react'
import ChevronRightIcon from '@/assets/icons/week-mission/chevron-right.svg?react'
import { useWeekSelector } from '@/hooks/week-mission/useWeekSelector'

const WeekSelector = () => {
    const { weekInfo, handlePreviousWeek, handleNextWeek } = useWeekSelector()

    if (!weekInfo) {
        return null
    }

    const { year, month, week: weekNumber } = weekInfo

    return (
		<div className='flex items-center gap-2'>
			<button onClick={handlePreviousWeek} className='p-1 w-7 h-7 rounded-lg cursor-pointer hover:bg-neutral-100 hover:shadow-inner-neutral-2'>
				<ChevronLeftIcon className='w-4 h-4' />
			</button>
			<p className='title-3 font-semibold text-neutral-800'>
				{year}년 {month}월 {weekNumber}주차
			</p>
			<button
				onClick={handleNextWeek}
				className='pl-1.5 w-7 h-7 rounded-lg cursor-pointer hover:bg-neutral-100 hover:shadow-inner-neutral-2'
			>
				<ChevronRightIcon className='w-4 h-4' />
			</button>
		</div>
	)
}

export default WeekSelector