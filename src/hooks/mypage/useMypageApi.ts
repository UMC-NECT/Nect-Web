import { getMypageProfile, getMypageProjects, patchMypageProfileSave } from '@/api/mypage'
import { QUERY_KEY } from '@/constants/key'
import type { RequestMypageProfileSaveDto } from '@/types/api/mypage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// (내 프로필 설정) 프로필 조회
export const useMypageProfileQuery = () => {
	return useQuery({
		queryKey: QUERY_KEY.mypage.profile(),
		queryFn: getMypageProfile,
		staleTime: 60 * 5 * 1_000, // 테스트용으로 5분
		gcTime: Infinity,
	})
}

// (내 프로필 설정) 프로필 수정
export const useMypageProfileMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (body: RequestMypageProfileSaveDto) => patchMypageProfileSave(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.profile() })
		},
	})
}

// (모든 프로젝트) 현재 참여중인 프로젝트 조회
export const useMypageProjectsQuery = () => {
	return useQuery({
		queryKey: QUERY_KEY.mypage.project(),
		queryFn: getMypageProjects,
		staleTime: 60 * 5 * 1_000, // 테스트용으로 5분
		gcTime: Infinity,
	})
}
