import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSharedDocumentName } from '@/api/team-board/boards'
import type { UpdateSharedDocumentNameRequest } from '@/types/api/team-board/sharedDocuments'

/**
 * 공유 문서의 표시명을 변경하는 hook
 * @param projectId - 프로젝트 ID
 */
export const useUpdateSharedDocumentNameMutation = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ documentId, nameData }: { documentId: number; nameData: UpdateSharedDocumentNameRequest }) =>
			updateSharedDocumentName(projectId, documentId, nameData),
		onSuccess: () => {
			// 이름 변경 후 관련 데이터 refetch
			queryClient.invalidateQueries({ queryKey: ['sharedDocumentList', projectId] })
			queryClient.invalidateQueries({ queryKey: ['teamBoardOverview', projectId] })
		},
	})
}
