import { getDate } from 'date-fns'
import { useWeekDates } from '@/hooks/week-mission/useWeekDates'

const WeekDates = () => {
    const {
        scrollContainerRef,
        dates,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleScroll,
    } = useWeekDates()

    return (
        <div
            ref={scrollContainerRef}
            className='flex items-center gap-0 overflow-x-auto cursor-grab active:cursor-grabbing'
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onScroll={handleScroll}
        >
            {dates.map((date, index) => {
                const day = getDate(date)
                const isSunday = date.getDay() === 0

                return (
                    <div
                        key={index}
                        className='h-6 relative shrink-0 w-[54px] flex items-center justify-center'
                    >
                        <p
                            className={`font-medium text-[13px] leading-gutter text-center ${
                                isSunday ? 'text-[#fc3333]' : 'text-[#333]'
                            }`}
                        >
                            {day}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}

export default WeekDates

