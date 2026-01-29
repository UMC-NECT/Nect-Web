import { useWorkStatusStore } from '@/stores/work-status/workStatusStore'
import { useHistoryStore } from '@/stores/work-status/historyStore'

export const useWorkStatusData = () => {
	const { getStatusCounts, getProgressByTeam } = useWorkStatusStore()
	const { getRecentHistory } = useHistoryStore()

	const statusCounts = getStatusCounts()
	const teams = ['PM', 'Design', 'Backend', 'Frontend']
	const progressData = teams.reduce((acc, team) => {
		acc[team] = getProgressByTeam(team)
		return acc
	}, {} as Record<string, ReturnType<typeof getProgressByTeam>>)

	const historyItems = getRecentHistory(6)

	return {
		statusCounts,
		progressData,
		historyItems,
	}
}
