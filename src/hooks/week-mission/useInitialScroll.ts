import { useEffect, useRef } from 'react'

interface UseInitialScrollProps {
	boardScrollRef: React.RefObject<HTMLDivElement | null>
	weekDatesRef: React.RefObject<HTMLDivElement | null>
	todayIndex: number
	itemWidth: number
	initialScrollPosition: number
	setVirtualScrollLeft: (scrollLeft: number) => void
}

export const useInitialScroll = ({
	boardScrollRef,
	weekDatesRef,
	todayIndex,
	itemWidth,
	initialScrollPosition,
	setVirtualScrollLeft,
}: UseInitialScrollProps) => {
	const isInitializedRef = useRef(false)

	useEffect(() => {
		if (boardScrollRef.current && weekDatesRef.current && !isInitializedRef.current) {
			let scrollPosition = initialScrollPosition

			if (todayIndex !== -1) {
				const todayWeekStartIndex = Math.floor(todayIndex / 7) * 7
				scrollPosition = todayWeekStartIndex * itemWidth
			}

			requestAnimationFrame(() => {
				if (boardScrollRef.current && weekDatesRef.current) {
					boardScrollRef.current.scrollLeft = scrollPosition
					weekDatesRef.current.scrollLeft = scrollPosition
					setVirtualScrollLeft(scrollPosition)
					isInitializedRef.current = true
				}
			})
		}
	}, [todayIndex, itemWidth, initialScrollPosition, setVirtualScrollLeft, boardScrollRef, weekDatesRef])

	return isInitializedRef
}
