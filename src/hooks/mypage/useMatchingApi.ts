import {
	getMatchingCount,
	getMatchingsReceived,
	getMatchingsSent,
	postMatchingUserToProject,
	postMatchingAccept,
	postMatchingCancel,
	postMatchingReject,
	postMatchingProjectToUser,
} from '@/api/matching'
import { QUERY_KEY } from '@/constants/key'
import type {
	MatchingTarget,
	MatchingStatusParam,
	RequestUserToProjectMatchingDto,
	RequestMatchingRejectDto,
	RequestProjectToUserMatchingDto,
} from '@/types/api/matching'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// === 매칭 요청 개수 조회 ==========================================================
export const useMatchingCountQuery = () => {
	return useQuery({
		queryKey: QUERY_KEY.matching.count(),
		queryFn: getMatchingCount,
		refetchOnMount: 'always',
		staleTime: 0,
	})
}

// === 받은 매칭 요청 조회 ==========================================================
export const useMatchingsReceivedQuery = (target: MatchingTarget, status: MatchingStatusParam) => {
	return useQuery({
		queryKey: QUERY_KEY.matching.received(target, status),
		queryFn: () => getMatchingsReceived(target, status),
		enabled: !!target && !!status,
		refetchOnMount: 'always',
		staleTime: 0,
	})
}

// === 보낸 매칭 요청 조회 ==========================================================
export const useMatchingsSentQuery = (target: MatchingTarget, status: MatchingStatusParam) => {
	return useQuery({
		queryKey: QUERY_KEY.matching.sent(target, status),
		queryFn: () => getMatchingsSent(target, status),
		enabled: !!target && !!status,
		refetchOnMount: 'always',
		staleTime: 0,
	})
}

// === 유저 -> 프로젝트 매칭 요청 ==========================================================
export const useMatchingUserToProjectMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectId, body }: { projectId: string; body: RequestUserToProjectMatchingDto }) =>
			postMatchingUserToProject(projectId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.matching.all })
		},
	})
}

// === 매칭 수락 ==========================================================
export const useMatchingAcceptMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (matchingId: string) => postMatchingAccept(matchingId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.matching.all })
		},
	})
}

// === 매칭 취소 ==========================================================
export const useMatchingCancelMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (matchingId: string) => postMatchingCancel(matchingId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.matching.all })
		},
	})
}

// === 매칭 거절 ==========================================================
export const useMatchingRejectMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ matchingId, body }: { matchingId: string; body: RequestMatchingRejectDto }) =>
			postMatchingReject(matchingId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.matching.all })
		},
	})
}

// === 프로젝트 -> 유저 매칭 요청 ==========================================================
export const useMatchingProjectToUserMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			projectId,
			targetUserId,
			body,
		}: {
			projectId: string
			targetUserId: string
			body: RequestProjectToUserMatchingDto
		}) => postMatchingProjectToUser(projectId, targetUserId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.matching.all })
		},
	})
}
