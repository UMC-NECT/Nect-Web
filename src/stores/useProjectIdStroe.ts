import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ProjectIdState = {
	projectId: number | null
	setProjectId: (projectId: number | null) => void
}

export const useProjectIdStore = create<ProjectIdState>()(
	persist(
		set => ({
			projectId: null,
			setProjectId: (projectId: number | null) => set({ projectId }),
		}),
		{
			name: 'nect-project-id',
		}
	)
)
