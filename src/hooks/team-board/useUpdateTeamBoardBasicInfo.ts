import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTeamBoardBasicInfo } from '@/api/team-board/boards'

interface UpdateTeamBoardBasicInfoPayload {
	notice_text?: string
	regular_meeting_text?: string
}

/**
 * 팀보드 기본 정보(공지, 정기회의 문구 등)를 수정하는 hook
 * @param projectId - 프로젝트 ID
 */
export const useUpdateTeamBoardBasicInfoMutation = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: UpdateTeamBoardBasicInfoPayload) =>
			updateTeamBoardBasicInfo(projectId, payload),
		onSuccess: () => {
			// 기본 정보 수정 후 팀보드 개요 재조회
			queryClient.invalidateQueries({ queryKey: ['teamBoardOverview', projectId] })
		},
	})
}

