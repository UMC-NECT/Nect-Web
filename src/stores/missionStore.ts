import { create } from 'zustand'
import type { Mission } from '@/components/week-mission/MissionBoard'
import type { MissionStatus } from '@/types/missionStatus'

interface MissionStore {
	missions: Mission[]
	setMissions: (missions: Mission[]) => void
	updateMission: (
		missionId: number,
		updates: { createdAt?: string; dueDate?: string; sectionIndex?: number; status?: MissionStatus }
	) => void
	addMission: (mission: Mission) => void
	removeMission: (missionId: number) => void
}

const initialMissions: Mission[] = [
	{
		id: 1,
		title: 'Mission 1',
		status: 'planning',
		missionNumber: 1,
		progress: 0,
		createdAt: '2026.1.8',
		dueDate: '2026.1.15',
		daysRemaining: 0,
		sectionIndex: 0,
		isGoal: true,
	},
	{
		id: 2,
		title: 'Mission 2',
		status: 'planning',
		missionNumber: 2,
		progress: 0,
		createdAt: '2026.1.8',
		dueDate: '2026.1.10',
		daysRemaining: 0,
		sectionIndex: 1,
	},
	{
		id: 3,
		title: 'Mission 3',
		status: 'planning',
		missionNumber: 3,
		progress: 0,
		createdAt: '2026.1.8',
		dueDate: '2026.1.8',
		daysRemaining: 0,
		sectionIndex: 2,
	},
]

export const useMissionStore = create<MissionStore>(set => ({
	missions: initialMissions,
	setMissions: missions => set({ missions }),
	updateMission: (missionId, updates) => {
		set(state => {
			const updatedMissions = state.missions.map(mission =>
				mission.id === missionId
					? {
							...mission,
							...updates,
							...(updates.dueDate && {
								daysRemaining: Math.max(
									0,
									Math.ceil(
										(new Date(updates.dueDate.replace(/\./g, '-')).getTime() - new Date().getTime()) /
											(1000 * 60 * 60 * 24)
									)
								),
							}),
						}
					: mission
			)
			return { missions: updatedMissions }
		})
	},
	addMission: mission =>
		set(state => ({
			missions: [...state.missions, mission],
		})),
	removeMission: missionId =>
		set(state => ({
			missions: state.missions.filter(mission => mission.id !== missionId),
		})),
}))
