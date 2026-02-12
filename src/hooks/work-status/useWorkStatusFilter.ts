import type { MissionStatus } from '@/types/missionStatus'
import { useWorkStatusStore } from '@/stores/work-status/workStatusStore'
import type { WorkStatusItem } from '@/stores/work-status/workStatusStore'

export const useWorkStatusFilter = (selectedSegment: string) => {
	const { getWorkStatusItemsByStatus, getWorkStatusItemsByTeam } = useWorkStatusStore()

	const getFilteredItemsByStatus = (status: MissionStatus): WorkStatusItem[] => {
		if (selectedSegment === 'Team') {
			// Team 선택 시 모든 팀의 아이템 표시
			return getWorkStatusItemsByStatus(status)
		} else {
			// 특정 팀 선택 시 해당 팀의 아이템만 필터링
			const teamItems = getWorkStatusItemsByTeam(selectedSegment)
			return teamItems.filter(item => item.status === status)
		}
	}

	return {
		getFilteredItemsByStatus,
	}
}
