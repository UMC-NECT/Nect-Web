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

/**
 * 종료일까지 남은 일수(D-day) 계산
 * @param endDate - 종료 날짜 (YYYY.MM.DD 형식)
 * @returns 남은 일수 (음수일 경우 0 반환)
 * @example
 * ```typescript
 * calculateDDay("2025.12.31")
 * // 오늘이 2025.12.01이면 출력: 30
 *
 * calculateDDay("2025.11.01")
 * // 오늘이 2025.12.01이면 출력: 0 (이미 지난 날짜)
 * ```
 */
export const calculateDDay = (endDate: string): number => {
	const today = new Date()
	today.setHours(0, 0, 0, 0) // 시간을 00:00:00으로 설정하여 날짜만 비교

	const end = parseDate(endDate)
	end.setHours(0, 0, 0, 0)

	const diffTime = end.getTime() - today.getTime()
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

	return diffDays > 0 ? diffDays : 0
}

/**
 * 날짜 유효성 검사
 * @param year - 년도
 * @param month - 월 (1-12)
 * @param day - 일
 * @returns 유효한지 여부
 */
const isValidDate = (year: number, month: number, day: number): boolean => {
	// 년도 범위 검사 (2000-2100)
	if (year < 2000 || year > 2100) return false
	
	// 월 범위 검사
	if (month < 1 || month > 12) return false
	
	// 일 범위 검사
	if (day < 1 || day > 31) return false
	
	// 실제 날짜 유효성 검사 (윤년, 월별 일수 고려)
	const daysInMonth = new Date(year, month, 0).getDate()
	return day <= daysInMonth
}

/**
 * 날짜 입력값을 자동으로 포맷팅 (년, 월, 일 자동 추가)
 * @param value - 사용자 입력값
 * @param previousValue - 이전 값 (백스페이스 감지용)
 * @returns 포맷팅된 날짜 문자열 (예: "2026년 1월 27일")
 * @example
 * ```typescript
 * formatDateInput("2026", "") // "2026년"
 * formatDateInput("2026년 1", "2026년") // "2026년 1월"
 * formatDateInput("2026년 1월 27", "2026년 1월") // "2026년 1월 27일"
 * formatDateInput("2026년 1월 27일", "2026년 1월 27일") // "2026년 1월 27일" (변경 없음)
 * ```
 */
export const formatDateInput = (value: string, previousValue: string = ''): string => {
	// 숫자만 추출
	const numbers = value.replace(/[^0-9]/g, '')
	
	// 빈 값이면 빈 문자열 반환
	if (!numbers) return ''
	
	// 백스페이스로 값이 줄어든 경우 (삭제 중)
	const previousNumbers = previousValue.replace(/[^0-9]/g, '')
	if (numbers.length < previousNumbers.length) {
		// 이전 값에서 단위를 제거한 숫자와 현재 숫자가 같으면 단위만 제거된 것으로 판단
		if (previousValue.endsWith('일')) {
			const withoutDay = previousValue.replace(/일$/, '')
			const numbersWithoutDay = withoutDay.replace(/[^0-9]/g, '')
			if (numbersWithoutDay === numbers) {
				return withoutDay
			}
		}
		if (previousValue.endsWith('월')) {
			const withoutMonth = previousValue.replace(/월$/, '')
			const numbersWithoutMonth = withoutMonth.replace(/[^0-9]/g, '')
			if (numbersWithoutMonth === numbers) {
				return withoutMonth
			}
		}
		if (previousValue.endsWith('년')) {
			const withoutYear = previousValue.replace(/년$/, '')
			const numbersWithoutYear = withoutYear.replace(/[^0-9]/g, '')
			if (numbersWithoutYear === numbers) {
				return withoutYear
			}
		}
		// 단위 제거가 아닌 경우, 현재 값 그대로 반환 (숫자만 있으면 그대로)
		return value
	}
	
	// 숫자 길이에 따라 자동 포맷팅
	if (numbers.length <= 4) {
		// 년도만 입력 (1~4자리)
		const year = parseInt(numbers, 10)
		// 년도가 4자리일 때만 유효성 검사 및 단위 추가
		if (numbers.length === 4) {
			if (year < 2000 || year > 2100) {
				return previousValue
			}
			// 4자리 완성 시에만 "년" 추가
			return `${numbers}년`
		}
		// 4자리 미만이면 숫자만 반환 (단위 없음)
		return numbers
	} else if (numbers.length <= 6) {
		// 년도 + 월 입력 (5~6자리)
		const year = parseInt(numbers.slice(0, 4), 10)
		const month = parseInt(numbers.slice(4), 10)
		
		// 년도 유효성 검사
		if (year < 2000 || year > 2100) {
			return previousValue
		}
		
		// 월 유효성 검사
		if (numbers.length === 6) {
			// 월이 2자리일 때만 검사 및 단위 추가
			if (month < 1 || month > 12) {
				return previousValue
			}
			return `${numbers.slice(0, 4)}년 ${numbers.slice(4)}월`
		} else {
			// 월이 1자리일 때 (입력 중)
			if (month > 1) {
				// 2 이상이면 이전 값 유지 (13 이상 방지)
				return previousValue
			}
			// 년도는 완성되었으므로 "년" 추가, 월은 숫자만
			return `${numbers.slice(0, 4)}년 ${numbers.slice(4)}`
		}
	} else {
		// 년도 + 월 + 일 입력 (7자리 이상)
		const year = parseInt(numbers.slice(0, 4), 10)
		const month = parseInt(numbers.slice(4, 6), 10)
		const day = parseInt(numbers.slice(6, 8), 10)
		
		// 년도 유효성 검사
		if (year < 2000 || year > 2100) {
			return previousValue
		}
		
		// 월 유효성 검사
		if (month < 1 || month > 12) {
			return previousValue
		}
		
		// 일 유효성 검사
		if (numbers.length >= 8) {
			// 일이 2자리일 때만 전체 검사 및 단위 추가
			if (!isValidDate(year, month, day)) {
				return previousValue
			}
			return `${numbers.slice(0, 4)}년 ${numbers.slice(4, 6)}월 ${numbers.slice(6, 8)}일`
		} else {
			// 일이 1자리일 때 (입력 중)
			if (day > 3) {
				// 4 이상이면 이전 값 유지 (40 이상 방지)
				return previousValue
			}
			// 년도와 월은 완성되었으므로 단위 추가, 일은 숫자만
			return `${numbers.slice(0, 4)}년 ${numbers.slice(4, 6)}월 ${numbers.slice(6)}`
		}
	}
}

/**
 * 시간 입력값을 자동으로 포맷팅 (24시간제, 콜론과 하이폰 자동 삽입)
 * @param value - 사용자 입력값
 * @param previousValue - 이전 값 (백스페이스 감지용)
 * @returns 포맷팅된 시간 문자열 (예: "15:00 - 17:00")
 * @example
 * ```typescript
 * formatTimeInput("1500", "") // "15:00"
 * formatTimeInput("15001700", "") // "15:00 - 17:00"
 * formatTimeInput("15:00 - 17:00", "15:00 - 17:00") // "15:00 - 17:00" (변경 없음)
 * ```
 */
/**
 * 시간 유효성 검사 (24시간제)
 * @param hour - 시간 (0-23)
 * @param minute - 분 (0-59)
 * @returns 유효한지 여부
 */
const isValidTime = (hour: number, minute: number): boolean => {
	return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59
}

/**
 * 시간 문자열을 파싱하여 시간과 분 추출
 * @param timeStr - 시간 문자열 (예: "15:00")
 * @returns { hour: number, minute: number } 또는 null
 */
const parseTime = (timeStr: string): { hour: number; minute: number } | null => {
	const match = timeStr.match(/^(\d{1,2}):(\d{1,2})$/)
	if (!match) return null
	
	const hour = parseInt(match[1], 10)
	const minute = parseInt(match[2], 10)
	
	if (isValidTime(hour, minute)) {
		return { hour, minute }
	}
	return null
}

export const formatTimeInput = (value: string, previousValue: string = ''): string => {
	// 숫자만 추출
	const numbers = value.replace(/[^0-9]/g, '')
	const previousNumbers = previousValue.replace(/[^0-9]/g, '')
	
	// 빈 값이면 빈 문자열 반환
	if (!numbers) return ''
	
	// 백스페이스로 값이 줄어든 경우 (삭제 중)
	if (numbers.length < previousNumbers.length) {
		// 기존 포맷에서 마지막 부분 제거
		if (value.includes(' - ')) {
			// "15:00 - 17:00" 형식에서 삭제
			const [startTime, endTime] = value.split(' - ')
			if (endTime && numbers.length <= 4) {
				// 종료 시간이 모두 삭제된 경우
				return startTime
			}
			if (endTime && numbers.length > 4) {
				// 종료 시간 일부만 남은 경우
				const endNumbers = numbers.slice(4)
				if (endNumbers.length === 0) {
					return startTime
				} else if (endNumbers.length <= 2) {
					return `${startTime} - ${endNumbers}`
				} else if (endNumbers.length === 3) {
					return `${startTime} - ${endNumbers.slice(0, 2)}:${endNumbers.slice(2)}`
				} else {
					return `${startTime} - ${endNumbers.slice(0, 2)}:${endNumbers.slice(2, 4)}`
				}
			}
		}
		// "15:00" 형식에서 삭제
		if (value.includes(':')) {
			const [hour, minute] = value.split(':')
			if (minute && numbers.length <= 2) {
				// 분이 모두 삭제된 경우
				return hour
			}
			if (minute && numbers.length > 2) {
				// 분 일부만 남은 경우
				return `${hour}:${minute.slice(0, 2)}`
			}
		}
		return value
	}
	
	// 숫자 길이에 따라 자동 포맷팅
	if (numbers.length <= 4) {
		// 시작 시간만 입력 (1~4자리)
		if (numbers.length <= 2) {
			// 시간만 (1~2자리)
			const hour = parseInt(numbers, 10)
			// 24 이상이면 이전 값 유지
			if (hour > 23) {
				return previousValue
			}
			return numbers
		} else if (numbers.length === 3) {
			// 시간 + 분 일부 (3자리)
			const hour = parseInt(numbers.slice(0, 2), 10)
			const minute = parseInt(numbers.slice(2), 10)
			// 시간이 24 이상이면 이전 값 유지
			if (hour > 23) {
				return previousValue
			}
			// 분이 6 이상이면 이전 값 유지 (60 이상 방지)
			if (minute > 5) {
				return previousValue
			}
			return `${numbers.slice(0, 2)}:${numbers.slice(2)}`
		} else {
			// 시간 + 분 (4자리)
			const hour = parseInt(numbers.slice(0, 2), 10)
			const minute = parseInt(numbers.slice(2, 4), 10)
			// 유효성 검사
			if (!isValidTime(hour, minute)) {
				return previousValue
			}
			return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`
		}
	} else {
		// 시작 시간 + 종료 시간 입력 (5자리 이상)
		const startHour = parseInt(numbers.slice(0, 2), 10)
		const startMinute = parseInt(numbers.slice(2, 4), 10)
		
		// 시작 시간 유효성 검사
		if (!isValidTime(startHour, startMinute)) {
			return previousValue
		}
		
		const startTime = `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`
		const endNumbers = numbers.slice(4)
		
		if (endNumbers.length === 0) {
			return `${startTime} - `
		} else if (endNumbers.length <= 2) {
			// 종료 시간만 (1~2자리)
			const endHour = parseInt(endNumbers, 10)
			// 24 이상이면 이전 값 유지
			if (endHour > 23) {
				return previousValue
			}
			return `${startTime} - ${endNumbers}`
		} else if (endNumbers.length === 3) {
			// 종료 시간 + 분 일부 (3자리)
			const endHour = parseInt(endNumbers.slice(0, 2), 10)
			const endMinute = parseInt(endNumbers.slice(2), 10)
			// 시간이 24 이상이면 이전 값 유지
			if (endHour > 23) {
				return previousValue
			}
			// 분이 6 이상이면 이전 값 유지 (60 이상 방지)
			if (endMinute > 5) {
				return previousValue
			}
			return `${startTime} - ${endNumbers.slice(0, 2)}:${endNumbers.slice(2)}`
		} else {
			// 종료 시간 + 분 (4자리 이상)
			const endHour = parseInt(endNumbers.slice(0, 2), 10)
			const endMinute = parseInt(endNumbers.slice(2, 4), 10)
			
			// 종료 시간 유효성 검사
			if (!isValidTime(endHour, endMinute)) {
				return previousValue
			}
			
			// 시작 시간이 종료 시간보다 이후인지 검사
			const startParsed = parseTime(startTime)
			const endParsed = parseTime(`${endNumbers.slice(0, 2)}:${endNumbers.slice(2, 4)}`)
			
			if (startParsed && endParsed) {
				const startMinutes = startParsed.hour * 60 + startParsed.minute
				const endMinutes = endParsed.hour * 60 + endParsed.minute
				
				// 시작 시간이 종료 시간보다 이후이면 이전 값 유지
				if (startMinutes >= endMinutes) {
					return previousValue
				}
			}
			
			return `${startTime} - ${endNumbers.slice(0, 2)}:${endNumbers.slice(2, 4)}`
		}
	}
}
