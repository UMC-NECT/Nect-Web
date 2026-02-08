import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getParts } from "@/api/project"
import { getUsers } from "@/api/project"
import { QUERY_KEY } from "@/constants/key"
import type { RequestFilePostDto } from "@/types/api/file"
import { postFile } from "@/api/process/file"

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

export const useUploadFileMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ projectId, body }: { projectId: string, body: RequestFilePostDto }) => postFile(projectId, body),
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.project.files(projectId) })
        },
    })
}