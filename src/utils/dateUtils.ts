import { addWeeks, startOfWeek, getYear, getMonth, startOfMonth, differenceInWeeks, addDays } from 'date-fns'

/**
 * 날짜 문자열을 Date 객체로 변환 (YYYY.MM.DD 형식)
 * @param dateStr - "2025.11.17" 형식의 날짜 문자열
 * @returns Date 객체
 * @example
 * ```typescript
 * parseDate("2025.11.17")
 * // 출력: Date 객체 (2025년 11월 17일)
 *
 * parseDate("2025.01.01")
 * // 출력: Date 객체 (2025년 1월 1일)
 * ```
 */
export const parseDate = (dateStr: string): Date => {
	const [year, month, day] = dateStr.split('.').map(Number)
	return new Date(year, month - 1, day)
}

/**
 * 두 날짜 사이의 일수 계산 (시작일 포함)
 * @param startDate - 시작 날짜 (YYYY.MM.DD 형식)
 * @param endDate - 종료 날짜 (YYYY.MM.DD 형식)
 * @returns 일수 (시작일과 종료일 포함)
 * @example
 * ```typescript
 * calculateDateSpan("2025.11.17", "2025.11.30")
 * // 입력: "2025.11.17", "2025.11.30"
 * // 출력: 14 (11월 17일부터 11월 30일까지, 양쪽 포함)
 *
 * calculateDateSpan("2025.11.17", "2025.11.17")
 * // 입력: "2025.11.17", "2025.11.17"
 * // 출력: 1 (같은 날짜는 1일)
 *
 * calculateDateSpan("2025.11.01", "2025.11.30")
 * // 입력: "2025.11.01", "2025.11.30"
 * // 출력: 30 (11월 전체 기간)
 * ```
 */
export const calculateDateSpan = (startDate: string, endDate: string): number => {
	const start = parseDate(startDate)
	const end = parseDate(endDate)
	const diffTime = Math.abs(end.getTime() - start.getTime())
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // 시작일 포함

	return diffDays
}

/**
 * 현재 날짜를 기준으로 주차 오프셋을 적용한 날짜를 반환
 * @param weekOffset - 주차 오프셋 (0: 현재 주, 양수: 이후 주, 음수: 이전 주)
 * @returns Date 객체
 */
export const getDateByWeekOffset = (weekOffset: number): Date => {
	return addWeeks(new Date(), weekOffset)
}

/**
 * 날짜를 기준으로 년도, 월, 주차를 계산
 * @param date - 기준 날짜
 * @returns { year: number, month: number, week: number } 형식의 객체
 */
export const getYearMonthWeek = (date: Date): { year: number; month: number; week: number } => {
	// 해당 주의 시작일 (월요일)
	const weekStart = startOfWeek(date, { weekStartsOn: 1 })

	// 해당 주의 대부분 날짜가 속한 월 결정 (4일 이상)
	const monthCounts: Record<number, number> = {}
	for (let i = 0; i < 7; i++) {
		const checkDate = addDays(weekStart, i)
		const monthIndex = getMonth(checkDate)
		monthCounts[monthIndex] = (monthCounts[monthIndex] || 0) + 1
	}

	// 4일 이상인 월 찾기
	const targetMonthIndex = Number(Object.entries(monthCounts).find(([, count]) => count >= 4)?.[0] ?? getMonth(date))

	const targetMonthDate = new Date(getYear(date), targetMonthIndex, 1)
	const targetYear = getYear(targetMonthDate)
	const targetMonth = targetMonthIndex + 1

	// 해당 월의 첫 번째 날
	const firstDayOfMonth = startOfMonth(targetMonthDate)
	const firstWeekStart = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 })

	// 주차 계산
	const week = differenceInWeeks(weekStart, firstWeekStart) + 1

	return { year: targetYear, month: targetMonth, week: Math.max(1, week) }
}

/**
 * 주차 오프셋을 기준으로 해당 주의 모든 날짜를 반환
 * @param weekOffset - 주차 오프셋 (0: 현재 주, 양수: 이후 주, 음수: 이전 주)
 * @returns 해당 주의 날짜 배열 (월요일부터 일요일까지)
 */
export const getWeekDates = (weekOffset: number): Date[] => {
	const targetDate = getDateByWeekOffset(weekOffset)
	const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 })

	const dates: Date[] = []
	for (let i = 0; i < 7; i++) {
		dates.push(addDays(weekStart, i))
	}

	return dates
}
