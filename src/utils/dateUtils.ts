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

