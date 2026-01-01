import { useState, useEffect } from 'react'
import { getDate } from 'date-fns'
import { useWeekDates } from '@/hooks/week-mission/useWeekDates'
import { useVirtualizedGrid } from '@/hooks/week-mission/useVirtualizedGrid'
import { useDragScroll } from '@/hooks/week-mission/useDragScroll'

const WeekDates = () => {
	const { scrollContainerRef, dates, handleScroll, totalDates, itemWidth } = useWeekDates()
	const dragHandlers = useDragScroll({ scrollRef: scrollContainerRef })

	const [containerWidth, setContainerWidth] = useState(0)

	useEffect(() => {
		const updateWidth = () => {
			if (scrollContainerRef.current) {
				setContainerWidth(scrollContainerRef.current.clientWidth)
			}
		}
		updateWidth()
		window.addEventListener('resize', updateWidth)
		return () => window.removeEventListener('resize', updateWidth)
	}, [scrollContainerRef])

	const {
		visibleItems,
		totalWidth,
		beforeWidth,
		afterWidth,
		handleScroll: handleVirtualScroll,
	} = useVirtualizedGrid({
		totalItems: totalDates,
		itemWidth,
		containerWidth,
		overscan: 10,
	})

	const combinedHandleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		handleScroll()
		handleVirtualScroll(e)
	}

	return (
		<div
			ref={scrollContainerRef}
			className='flex items-center gap-0 overflow-x-auto cursor-grab active:cursor-grabbing'
			style={{
				scrollbarWidth: 'none',
				msOverflowStyle: 'none',
				WebkitOverflowScrolling: 'touch',
			}}
			onMouseDown={dragHandlers.handleMouseDown}
			onMouseMove={dragHandlers.handleMouseDown}
			onMouseUp={dragHandlers.handleMouseUp}
			onMouseLeave={dragHandlers.handleMouseUp}
			onScroll={combinedHandleScroll}
		>
			{/* 가상화: 앞쪽 여백 */}
			{beforeWidth > 0 && <div style={{ width: `${beforeWidth}px`, flexShrink: 0 }} />}

			{/* 가상화: 보이는 아이템만 렌더링 */}
			{visibleItems.map(({ index }) => {
				if (index >= dates.length) return null
				const date = dates[index]
				const day = getDate(date)
				const isSunday = date.getDay() === 0

				return (
					<div key={index} className='h-6 relative shrink-0 w-[54px] flex items-center justify-center'>
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

			{/* 가상화: 뒤쪽 여백 */}
			{afterWidth > 0 && <div style={{ width: `${afterWidth}px`, flexShrink: 0 }} />}

			{/* 전체 너비를 위한 숨겨진 div */}
			<div style={{ width: `${totalWidth}px`, height: '1px', opacity: 0, pointerEvents: 'none' }} />
		</div>
	)
}

export default WeekDates
