import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ProjectIdState = {
	projectId: number | null
	userId: number | null
	setProjectId: (projectId: number | null, userId?: number | null) => void
	clearProjectId: () => void
}

export const useProjectIdStore = create<ProjectIdState>()(
	persist(
		set => ({
			projectId: null,
			userId: null,
			setProjectId: (projectId: number | null, userId?: number | null) => set({ projectId, userId: userId ?? null }),
			clearProjectId: () => set({ projectId: null, userId: null }),
		}),
		{
			name: 'nect-project-id',
		}
	)
)
