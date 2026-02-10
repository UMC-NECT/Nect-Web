import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSharedDocument } from '@/api/team-board/boards'

/**
 * 공유 문서를 삭제하는 hook
 * @param projectId - 프로젝트 ID
 */
export const useDeleteSharedDocumentMutation = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (documentId: number) => deleteSharedDocument(projectId, documentId),
		onSuccess: () => {
			// 문서 삭제 성공 시 관련 데이터 refetch
			queryClient.invalidateQueries({ queryKey: ['sharedDocumentList', projectId] })
			queryClient.invalidateQueries({ queryKey: ['teamBoardOverview', projectId] })
		},
	})
}
