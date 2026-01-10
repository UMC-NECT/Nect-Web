import { useMemo } from 'react'
import { calculateDateSpan } from '@/utils/dateUtils'
import type { Mission } from '@/components/week-mission/MissionBoard'

interface UseMissionFilterProps {
	positionedMissions: (Mission & { columnStart?: number | null })[]
	visibleRange: { startIndex: number; endIndex: number } | null
	containerWidth: number
}

export const useMissionFilter = ({
	positionedMissions,
	visibleRange,
	containerWidth,
}: UseMissionFilterProps) => {
	const visibleMissions = useMemo(() => {
		return positionedMissions.filter(mission => {
			if (!mission.columnStart) {
				return false
			}
			if (containerWidth === 0) return true
			if (!visibleRange || visibleRange.startIndex === undefined) return true

			const startIdx = mission.columnStart - 1
			const endIdx = startIdx + calculateDateSpan(mission.createdAt, mission.dueDate) - 1
			return (
				(startIdx >= visibleRange.startIndex && startIdx <= visibleRange.endIndex) ||
				(endIdx >= visibleRange.startIndex && endIdx <= visibleRange.endIndex) ||
				(startIdx < visibleRange.startIndex && endIdx > visibleRange.endIndex)
			)
		})
	}, [positionedMissions, visibleRange, containerWidth])

	return visibleMissions
}
