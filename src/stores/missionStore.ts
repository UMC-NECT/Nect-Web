import { create } from 'zustand'
import type { Mission } from '@/types/mission'
import type { StatusType } from '@/types/api/status'

interface MissionStore {
	missions: Mission[]
	setMissions: (missions: Mission[]) => void
	updateMission: (
		missionId: number,
		updates: { start_date?: string; dead_line?: string; sectionIndex?: number; status?: StatusType }
	) => void
	addMission: (mission: Mission) => void
	removeMission: (missionId: number) => void
}

const initialMissions: Mission[] = [
	{
		process_id: 1,
		title: 'Mission 1',
		status: 'PLANNING',
		mission_number: 1,
		progressCompleted: 0,
		progressTotal: 0,
		start_date: '2026.02.04',
		dead_line: '2026.02.12',
		left_day: 0,
		sectionIndex: 0,
		task: true,
		assignee: [
			{ user_id: 1, name: 'John Doe', nickname: 'John Doe', profile_image_url: 'https://picsum.photos/200/300' },
			{ user_id: 2, name: 'Jane Doe', nickname: 'Jane Doe', profile_image_url: 'https://picsum.photos/200/300' },
		],
	},
	{
		process_id: 2,
		title: 'Mission 2',
		status: 'PLANNING',
		mission_number: 2,
		progressCompleted: 0,
		progressTotal: 0,
		start_date: '2026.02.05',
		dead_line: '2026.02.10',
		left_day: 0,
		sectionIndex: 1,
	},
	{
		process_id: 3,
		title: 'Mission 3',
		status: 'PLANNING',
		mission_number: 3,
		progressCompleted: 0,
		progressTotal: 0,
		start_date: '2026.02.09',
		dead_line: '2026.02.10',
		left_day: 0,
		sectionIndex: 2,
	},
]

export const useMissionStore = create<MissionStore>(set => ({
	missions: initialMissions,
	setMissions: missions => set({ missions }),
	updateMission: (missionId, updates) => {
		set(state => {
			const updatedMissions = state.missions.map(mission =>
				mission.process_id === missionId
					? {
							...mission,
							...updates,
							...(updates.dead_line && {
								left_day: Math.max(
									0,
									Math.ceil(
										(new Date(updates.dead_line.replace(/\./g, '-')).getTime() - new Date().getTime()) /
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
			missions: state.missions.filter(mission => mission.process_id !== missionId),
		})),
}))
