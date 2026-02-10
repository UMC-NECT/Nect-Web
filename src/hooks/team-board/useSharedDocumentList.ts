import { useQuery } from '@tanstack/react-query'
import { getSharedDocumentList } from '@/api/team-board/boards'
import type { DocumentType, SortOption } from '@/types/api/team-board/sharedDocuments'

/**
 * 공유 문서함 목록을 조회하는 hook
 * @param projectId - 프로젝트 ID
 * @param options - 쿼리 옵션 (page, size, type, sort)
 */
export const useSharedDocumentList = (
	projectId: number | null,
	options?: {
		page?: number
		size?: number
		type?: DocumentType
		sort?: SortOption
	},
) => {
	return useQuery({
		queryKey: ['sharedDocumentList', projectId, options],
		queryFn: () => getSharedDocumentList(projectId!, options),
		enabled: projectId !== null,
	})
}
