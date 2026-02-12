import { useEffect, useRef, useState, useCallback } from 'react'
import { useWeekStore } from '@/stores/weekStore'
import { startOfWeek, addWeeks, addDays } from 'date-fns'

const TOTAL_WEEKS = 104 // 2년치
const ITEM_WIDTH = 80 // 각 날짜 박스 너비

export const useWeekDates = (scrollRef?: React.RefObject<HTMLDivElement | null>) => {
	const { setCurrentWeekIndex, weekOffset, setWeekOffset } = useWeekStore()
	const internalScrollRef = useRef<HTMLDivElement>(null)
	// 외부 ref가 제공되면 사용하고, 없으면 내부 ref 사용
	const scrollContainerRef = scrollRef || internalScrollRef
	const isProgrammaticScrollRef = useRef(false)
	const scrollTimeoutRef = useRef<number | null>(null)
	/** handleScroll에서 setWeekOffset 호출로 인한 effect 스크롤은 스킵 (주차 경계로 덮어쓰기 방지) */
	const fromUserScrollRef = useRef(false)

	// 오늘 날짜를 기준으로 중간 주차 인덱스 계산 (초기 위치)
	const getInitialWeekIndex = () => {
		return Math.floor(TOTAL_WEEKS / 2)
	}

	const [initialWeekIndex] = useState(getInitialWeekIndex)

	// 주차별 날짜 생성 (양쪽으로 충분히 많은 날짜, 오늘 날짜가 중간 정도에 위치)
	const generateDates = useCallback(() => {
		const today = new Date()
		const centerWeekStart = startOfWeek(today, { weekStartsOn: 1 })
		// 오늘 날짜가 포함된 주를 중간으로 하여 과거와 미래 날짜 모두 생성
		const startWeek = addWeeks(centerWeekStart, -Math.floor(TOTAL_WEEKS / 2))

		const dates: Date[] = []
		for (let i = 0; i < TOTAL_WEEKS; i++) {
			const weekStart = addWeeks(startWeek, i)
			for (let j = 0; j < 7; j++) {
				dates.push(addDays(weekStart, j))
			}
		}

		return dates
	}, [])

	const dates = generateDates()

	// 초기 렌더링 시 오늘 날짜가 포함된 주차로 스크롤
	useEffect(() => {
		if (scrollContainerRef.current) {
			const scrollPosition = initialWeekIndex * 7 * ITEM_WIDTH
			scrollContainerRef.current.scrollLeft = scrollPosition
			setCurrentWeekIndex(initialWeekIndex)
		}
		// scrollContainerRef는 ref이므로 dependency에 포함하지 않음
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// WeekSelector에서 주차 변경 시에만 스크롤 위치 업데이트 (사용자가 직접 스크롤한 뒤 setWeekOffset된 경우는 스킵)
	useEffect(() => {
		if (scrollContainerRef.current && weekOffset !== undefined) {
			if (fromUserScrollRef.current) {
				fromUserScrollRef.current = false
				return
			}
			isProgrammaticScrollRef.current = true
			const targetWeekIndex = initialWeekIndex + weekOffset
			const scrollPosition = targetWeekIndex * 7 * ITEM_WIDTH
			scrollContainerRef.current.scrollTo({
				left: scrollPosition,
				behavior: 'smooth',
			})
			setCurrentWeekIndex(targetWeekIndex)

			const timeoutId = setTimeout(() => {
				isProgrammaticScrollRef.current = false
			}, 500)

			return () => clearTimeout(timeoutId)
		}
		// scrollContainerRef는 ref이므로 dependency에 포함하지 않음
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weekOffset, initialWeekIndex, setCurrentWeekIndex])

	// 스크롤 위치 추적하여 현재 주차 인덱스 및 weekOffset 업데이트
	const handleScroll = useCallback(() => {
		if (scrollContainerRef.current && !isProgrammaticScrollRef.current) {
			const scrollPos = scrollContainerRef.current.scrollLeft
			const newWeekIndex = Math.round(scrollPos / (7 * ITEM_WIDTH))
			const newWeekOffset = newWeekIndex - initialWeekIndex

			setCurrentWeekIndex(newWeekIndex)

			if (scrollTimeoutRef.current !== null) {
				clearTimeout(scrollTimeoutRef.current)
			}
			scrollTimeoutRef.current = window.setTimeout(() => {
				fromUserScrollRef.current = true
				setWeekOffset(newWeekOffset)
			}, 150)
		}
		// scrollContainerRef는 ref이므로 dependency에 포함하지 않음
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialWeekIndex, setCurrentWeekIndex, setWeekOffset])

	// cleanup
	useEffect(() => {
		return () => {
			if (scrollTimeoutRef.current !== null) {
				clearTimeout(scrollTimeoutRef.current)
			}
		}
	}, [])

	// 초기 스크롤 위치 계산 (오늘 날짜가 포함된 주의 시작 위치)
	const initialScrollPosition = initialWeekIndex * 7 * ITEM_WIDTH

	return {
		scrollContainerRef,
		dates,
		handleScroll,
		totalDates: dates.length,
		itemWidth: ITEM_WIDTH,
		initialScrollPosition,
	}
}

