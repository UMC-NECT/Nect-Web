import {
	deleteAnalysis,
	getAnalysis,
	getMypageProfile,
	getMypageProjects,
	getProfileAnalysis,
	patchMypageProfileSave,
	getMypageProjectField,
	patchMypageProjectField,
	postMypageRecruitments,
	getMypageProjectRecruiments,
	putMypageRecruitments,
	getMypageTeamRoles,
	getProjectPurposes,
	patchProjectPurposes,
	getProjectsFunctions,
	patchProjectsFunctions,
	getProjectsServiceUsers,
	patchProjectsServiceUsers,
	getProjectPlanFile,
	postProjectPlanFile,
	patchProjectPlanFile,
	deleteProjectPlanFile,
} from '@/api/mypage'
import { QUERY_KEY } from '@/constants/key'
import type {
	RequestMypageProfileSaveDto,
	RequestMypageProjectFieldDto,
	RequestMypageRecruitmentCreateDto,
	RequestMypageRecruitmentUpdateDto,
	ProjectPlanFileRequest,
} from '@/types/api/mypage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// === 내 프로필 설정 ==========================================================
// (내 프로필 설정) 프로필 조회
export const useMypageProfileQuery = () => {
	return useQuery({
		queryKey: QUERY_KEY.mypage.profile(),
		queryFn: getMypageProfile,
		refetchOnMount: 'always',
		staleTime: 0,
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

// === 나의 아이디어 분석 ==========================================================
// (나의 아이디어 분석) 분석서 페이징 조회
export const useAnalysisQuery = (page: string) => {
	return useQuery({
		queryKey: QUERY_KEY.mypage.analysis(page),
		queryFn: () => getAnalysis(page),
		staleTime: 60 * 5 * 1_000, // 테스트용으로 5분
		gcTime: Infinity,
	})
}

// (나의 아이디어 분석) 분석서 삭제
export const useDeleteAnalysisMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (analysisId: number) => deleteAnalysis(analysisId),
		onSuccess: async () => {
			await queryClient.refetchQueries({ queryKey: [...QUERY_KEY.mypage.all, 'analysis'] })
		},
	})
}

// === 나의 프로필 분석 ==========================================================
// (나의 프로필 분석) 프로필 AI 분석 조회
export const useProfileAnalysis = () => {
	return useQuery({
		queryKey: QUERY_KEY.mypage.profileAnalysis(),
		queryFn: getProfileAnalysis,
		staleTime: 60 * 5 * 1_000, // 테스트용으로 5분
		gcTime: Infinity,
	})
}

// === 진행중인 프로젝트 (프로젝트 설정) ==========================================================
// 섹션 01. 프로젝트 분야 - 조회
export const useMypageProjectFieldQuery = (projectId: string) => {
	return useQuery({
		queryKey: [...QUERY_KEY.mypage.project(), 'projectField', projectId],
		queryFn: () => getMypageProjectField(projectId),
		enabled: !!projectId,
		refetchOnMount: 'always',
		staleTime: 0,
	})
}

// 섹션 01. 프로젝트 분야 - 수정
export const useMypageProjectFieldMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (body: RequestMypageProjectFieldDto) => patchMypageProjectField(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

// 섹션 02. 프로젝트 모집정보 - 조회
export const useMypageProjectRecruitmentsQuery = (projectId: string) => {
	return useQuery({
		queryKey: [...QUERY_KEY.mypage.project(), 'recruitments', projectId],
		queryFn: () => getMypageProjectRecruiments(projectId),
		enabled: !!projectId,
		refetchOnMount: 'always',
		staleTime: 0,
	})
}

// 섹션 02. 프로젝트 모집정보 - 수정 (리더만 가능)
export const usePutMypageRecruitmentsMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			projectId,
			recruitmentId,
			body,
		}: {
			projectId: string
			recruitmentId: string
			body: RequestMypageRecruitmentUpdateDto
		}) => putMypageRecruitments(projectId, recruitmentId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

// 섹션 02. 프로젝트 모집정보 - 생성
export const usePostMypageRecruitmentsMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectId, body }: { projectId: string; body: RequestMypageRecruitmentCreateDto }) =>
			postMypageRecruitments(projectId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

// 섹션 03. 프로젝트 파트/팀원 구성 - 조회
export const useMypageTeamRolesQuery = (projectId: string) => {
	return useQuery({
		queryKey: [...QUERY_KEY.mypage.project(), 'team-roles', projectId],
		queryFn: () => getMypageTeamRoles(projectId),
		enabled: !!projectId,
		refetchOnMount: 'always',
		staleTime: 0,
	})
}

// 섹션 04. 프로젝트 목표 - 조회
export const useProjectPurposesQuery = (projectId: string) => {
	return useQuery({
		queryKey: [...QUERY_KEY.mypage.project(), 'purposes', projectId],
		queryFn: () => getProjectPurposes(projectId),
		enabled: !!projectId,
		refetchOnMount: 'always',
		staleTime: 0,
	})
}

// 섹션 04. 프로젝트 목표 - 수정/생성
export const usePatchProjectPurposesMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectId, contents }: { projectId: string; contents: string[] }) =>
			patchProjectPurposes(projectId, { contents }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

// 섹션 05. 주요 내용 - 조회
export const useProjectFunctionsQuery = (projectId: string) => {
	return useQuery({
		queryKey: [...QUERY_KEY.mypage.project(), 'functions', projectId],
		queryFn: () => getProjectsFunctions(projectId),
		enabled: !!projectId,
		refetchOnMount: 'always',
		staleTime: 0,
	})
}

// 섹션 05. 주요 내용 - 수정/생성
export const usePatchProjectsFunctions = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectId, contents }: { projectId: string; contents: string[] }) =>
			patchProjectsFunctions(projectId, { contents }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

// 섹션 06. 서비스 사용자 - 조회
export const useProjectsServiceUsersQuery = (projectId: string) => {
	return useQuery({
		queryKey: [...QUERY_KEY.mypage.project(), 'service-users', projectId],
		queryFn: () => getProjectsServiceUsers(projectId),
		enabled: !!projectId,
		refetchOnMount: 'always',
		staleTime: 0,
	})
}

// 섹션 06. 서비스 사용자 - 수정/생성
export const usePatchProjectsServiceUsersMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectId, contents }: { projectId: string; contents: string[] }) =>
			patchProjectsServiceUsers(projectId, { contents }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

// 섹션 07. 프로젝트 세부 기획 파일 - 조회
export const useProjectPlanFileQuery = (projectId: string) => {
	return useQuery({
		queryKey: [...QUERY_KEY.mypage.project(), 'plan-file', projectId],
		queryFn: () => getProjectPlanFile(projectId),
		enabled: !!projectId,
		refetchOnMount: 'always',
		staleTime: 0,
	})
}

// 섹션 07. 프로젝트 세부 기획 파일 - 생성 (파일/링크 모두 POST 사용)
export const usePostProjectPlanFileMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectId, payload }: { projectId: string; payload: ProjectPlanFileRequest }) =>
			postProjectPlanFile(projectId, payload),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [...QUERY_KEY.mypage.project(), 'plan-file', variables.projectId],
			})
		},
	})
}

// 섹션 07. 프로젝트 세부 기획 파일 - 수정
export const usePatchProjectPlanFileMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			projectId,
			planFileId,
			payload,
		}: {
			projectId: string
			planFileId: string
			payload: ProjectPlanFileRequest
		}) => patchProjectPlanFile(projectId, planFileId, payload),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [...QUERY_KEY.mypage.project(), 'plan-file', variables.projectId],
			})
		},
	})
}

// 섹션 07. 프로젝트 세부 기획 파일 - 삭제
export const useDeleteProjectPlanFileMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectId, planFileId }: { projectId: string; planFileId: string }) =>
			deleteProjectPlanFile(projectId, planFileId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [...QUERY_KEY.mypage.project(), 'plan-file', variables.projectId],
			})
		},
	})
}

// === 모든 프로젝트 ==========================================================
// (모든 프로젝트) 현재 참여중인 프로젝트 조회
export const useMypageProjectsQuery = () => {
	return useQuery({
		queryKey: QUERY_KEY.mypage.project(),
		queryFn: getMypageProjects,
		refetchOnMount: 'always',
		staleTime: 0,
	})
}

// === 매칭 현황 ==========================================================
