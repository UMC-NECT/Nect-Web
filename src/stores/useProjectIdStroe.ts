import { create } from "zustand"

type ProjectIdState = {
    projectId: number | null
    setProjectId: (projectId: number | null) => void
}
export const useProjectIdStore = create<ProjectIdState>((set) => ({
    projectId: null,
    setProjectId: (projectId: number | null) => set({ projectId }),
}))