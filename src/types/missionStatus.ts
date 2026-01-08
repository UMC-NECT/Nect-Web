export const MISSION_STATUSES = ['planning', 'in_progress', 'completed', 'backlog'] as const

export type MissionStatus = (typeof MISSION_STATUSES)[number]