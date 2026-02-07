import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { RequestPostAnalysisDto } from '@/types/api/analysis'
import { deleteAnalysis, getAnalysis, postAnalysis, postCreateProject } from '@/api/analysis'
import { QUERY_KEY } from '@/constants/key'
import { useNavigate } from 'react-router'

export const useGetAnalysisQuery = (page?: string) => {
	return useQuery({
		queryKey: QUERY_KEY.analysis.list(page),
		queryFn: () => getAnalysis(page),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 60,
	})
}

export const usePostAnalysisMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (body: RequestPostAnalysisDto) => postAnalysis(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.analysis.all })
		},
	})
}

export const useDeleteAnalysisMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (analysisId: string) => deleteAnalysis(analysisId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.analysis.all })
		},
	})
}

export const usePostCreateProjectMutation = () => {
	const navigate = useNavigate()
	return useMutation({
		mutationFn: (analysisId: string) => postCreateProject(analysisId),
		onSuccess: () => {
			navigate('/mypage/ongoing')
		},
	})
}
