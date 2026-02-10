import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSharedDocumentLink } from '@/api/team-board/boards'
import type { CreateSharedDocumentLinkRequest } from '@/types/api/team-board/sharedDocuments'

/**
 * 공유 문서함 링크 생성 mutation hook
 * @param projectId - 프로젝트 ID
 */
export const useCreateSharedDocumentLinkMutation = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (linkData: CreateSharedDocumentLinkRequest) =>
			createSharedDocumentLink(projectId, linkData),
		onSuccess: () => {
			// 링크 생성 성공 시 공유 문서함 목록 갱신
			queryClient.invalidateQueries({ queryKey: ['sharedDocumentList', projectId] })
		},
	})
}
