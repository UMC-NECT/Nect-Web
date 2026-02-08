import { useQuery } from "@tanstack/react-query"
import { getParts } from "@/api/project"
import { getUsers } from "@/api/project"
import { QUERY_KEY } from "@/constants/key"

export const usePartsQuery = (projectId: string) => {
    return useQuery({
        queryKey: QUERY_KEY.project.parts(projectId),
        queryFn: () => getParts(projectId),
        enabled: !!projectId,
        staleTime: 1000 * 60 * 60 * 24,
    })
}

export const useUsersQuery = (projectId: string) => {
    return useQuery({
        queryKey: QUERY_KEY.project.users(projectId),
        queryFn: () => getUsers(projectId),
        enabled: !!projectId,
        staleTime: 1000 * 60 * 60 * 24,
    })
}