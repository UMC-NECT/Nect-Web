import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getParts, patchProjectPart, postProjectPart } from "@/api/project"
import { getUsers } from "@/api/project"
import { QUERY_KEY } from "@/constants/key"
import type { RequestFilePostDto } from "@/types/api/file"
import { postFile } from "@/api/process/file"
import type { RequestPatchProjectPartDto, RequestPostProjectPartDto } from "@/types/api/project"

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

/** 작업실(위크미션/파트별 작업현황 등)에서 사용할 프로젝트 파트를 추가합니다. */
export const usePostProjectPartMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ projectId, body }: { projectId: string, body: RequestPostProjectPartDto }) => postProjectPart(projectId, body),
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.project.parts(projectId) })
        },
    })
}

/** 프로젝트 파트의 CUSTOM 이름 및 필요 인원을 수정합니다. (role_field 자체는 수정 불가) */
export const usePatchProjectPartMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ projectId, partId, body }: { projectId: string, partId: number, body: RequestPatchProjectPartDto }) => patchProjectPart(projectId, partId, body),
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.project.parts(projectId) })
        },
    })
}