import { type Notification } from '@/types/notification'
import { differenceInDays, startOfWeek, startOfDay } from 'date-fns'

/**
 * 알림의 time 문자열을 Date 객체로 변환
 * @param timeStr - '오늘 16:00', '어제 16:00', '1월 26일', '2025.12.26' 등의 형식
 * @returns Date 객체 또는 null (파싱 실패 시)
 */
const parseNotificationTime = (timeStr: string): Date | null => {
	const now = new Date()
	const today = startOfDay(now)

	// '오늘 16:00' 형식
	if (timeStr.startsWith('오늘')) {
		const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/)
		if (timeMatch) {
			const hours = parseInt(timeMatch[1], 10)
			const minutes = parseInt(timeMatch[2], 10)
			const date = new Date(today)
			date.setHours(hours, minutes, 0, 0)
			return date
		}
		return today
	}

	// '어제 16:00' 형식
	if (timeStr.startsWith('어제')) {
		const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/)
		const yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() - 1)
		if (timeMatch) {
			const hours = parseInt(timeMatch[1], 10)
			const minutes = parseInt(timeMatch[2], 10)
			yesterday.setHours(hours, minutes, 0, 0)
		}
		return yesterday
	}

	// '1월 26일' 형식
	const monthDayMatch = timeStr.match(/(\d{1,2})월\s*(\d{1,2})일/)
	if (monthDayMatch) {
		const month = parseInt(monthDayMatch[1], 10)
		const day = parseInt(monthDayMatch[2], 10)
		const date = new Date(now.getFullYear(), month - 1, day)
		return date
	}

	// '2025.12.26' 형식
	const dateMatch = timeStr.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/)
	if (dateMatch) {
		const year = parseInt(dateMatch[1], 10)
		const month = parseInt(dateMatch[2], 10)
		const day = parseInt(dateMatch[3], 10)
		return new Date(year, month - 1, day)
	}

	return null
}

/**
 * 알림을 날짜 기준으로 그룹화
 * @param notifications - 알림 배열
 * @returns 날짜 그룹별로 분류된 알림 객체
 */
export const groupNotificationsByDate = (notifications: Notification[]) => {
	const now = new Date()
	const today = startOfDay(now)
	const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 })
	const lastWeekStart = new Date(thisWeekStart)
	lastWeekStart.setDate(lastWeekStart.getDate() - 7)

	const grouped: {
		오늘: Notification[]
		어제: Notification[]
		이번주: Notification[]
		지난주: Notification[]
		이전: Notification[]
	} = {
		오늘: [],
		어제: [],
		이번주: [],
		지난주: [],
		이전: [],
	}

	notifications.forEach(notification => {
		const date = parseNotificationTime(notification.time)
		if (!date) {
			grouped.이전.push(notification)
			return
		}

		const notificationDate = startOfDay(date)
		const daysDiff = differenceInDays(today, notificationDate)

		if (daysDiff === 0) {
			grouped.오늘.push(notification)
		} else if (daysDiff === 1) {
			grouped.어제.push(notification)
		} else if (date >= thisWeekStart) {
			grouped.이번주.push(notification)
		} else if (date >= lastWeekStart && date < thisWeekStart) {
			grouped.지난주.push(notification)
		} else {
			grouped.이전.push(notification)
		}
	})

	return grouped
}

/**
 * 그룹화된 알림을 렌더링용 배열로 변환 (구분선 포함)
 * @param groupedNotifications - 그룹화된 알림 객체
 * @returns 알림과 구분선이 포함된 배열
 */
export type NotificationWithDivider = 
	| { type: 'notification'; notification: Notification }
	| { type: 'divider'; label: string }

export const flattenGroupedNotifications = (
	groupedNotifications: ReturnType<typeof groupNotificationsByDate>
): NotificationWithDivider[] => {
	const result: NotificationWithDivider[] = []

	// 오늘
	if (groupedNotifications.오늘.length > 0) {
		groupedNotifications.오늘.forEach(notification => {
			result.push({ type: 'notification', notification })
		})
	}

	// 어제
	if (groupedNotifications.어제.length > 0) {
		groupedNotifications.어제.forEach(notification => {
			result.push({ type: 'notification', notification })
		})
	}

	// 이번주
	if (groupedNotifications.이번주.length > 0) {
		groupedNotifications.이번주.forEach(notification => {
			result.push({ type: 'notification', notification })
		})
	}

	// 지난주 구분선
	if (groupedNotifications.지난주.length > 0) {
		result.push({ type: 'divider', label: '지난주' })
		groupedNotifications.지난주.forEach(notification => {
			result.push({ type: 'notification', notification })
		})
	}

	// 이전
	if (groupedNotifications.이전.length > 0) {
		groupedNotifications.이전.forEach(notification => {
			result.push({ type: 'notification', notification })
		})
	}

	return result
}
