import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadSharedDocumentFile } from '@/api/team-board/boards'

/**
 * 공유 문서함 파일 업로드 mutation hook
 * @param projectId - 프로젝트 ID
 */
export const useUploadSharedDocumentFileMutation = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (file: File) => uploadSharedDocumentFile(projectId, file),
		onSuccess: () => {
			// 업로드 성공 시 공유 문서함 목록 갱신
			queryClient.invalidateQueries({ queryKey: ['sharedDocumentList', projectId] })
		},
	})
}
