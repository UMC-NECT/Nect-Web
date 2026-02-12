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
	deleteProject,
	postMypageProjectImage,
	getMypageProjectUsers,
	postMypageTeamRoleEdit,
	patchMemberField,
	patchMemberKick,
	patchMemberType,
	postTeamRoleCreate,
	patchTeamRoleUpdate,
	postProjectUsersReorder,
	patchProjectRecruitmentStatus,
	getTeamRoles,
} from '@/api/mypage'
import { QUERY_KEY } from '@/constants/key'
import type {
	RequestMypageProfileSaveDto,
	RequestMypageProjectFieldDto,
	RequestMypageRecruitmentCreateDto,
	RequestMypageRecruitmentUpdateDto,
	ProjectPlanFileRequest,
	RequestTeamRoleEditDto,
	RequestMemberFieldChangeDto,
	RequestMemberTypeChangeDto,
	RequestTeamRoleCreateDto,
	RequestTeamRoleUpdateDto,
	RequestProjectUsersReorderDto,
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
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.users.profile() })
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
// 프로젝트 모집 상태 변경
export const usePatchProjectRecruitmentStatusMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectId, status }: { projectId: string; status: string }) =>
			patchProjectRecruitmentStatus(projectId, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

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

// 프로젝트 삭제
export const useDeleteProjectMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (projectId: string) => deleteProject(projectId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

// 프로젝트 썸네일 이미지 업로드
export const usePostMypageProjectImageMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectId, image }: { projectId: string; image: File }) =>
			postMypageProjectImage(projectId, image),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

// === 진행중인 프로젝트 (팀원 관리) ==========================================================
// (멤버 조회) 마이페이지 전용 프로젝트 유저 목록 조회
export const useMypageProjectUsersQuery = (projectId: string) => {
	return useQuery({
		queryKey: [...QUERY_KEY.mypage.project(), 'users', projectId],
		queryFn: () => getMypageProjectUsers(projectId),
		enabled: !!projectId,
		refetchOnMount: 'always',
		staleTime: 0,
	})
}

// (팀 구성 편집) 프로젝트 팀 구성 편집 - 인원 수 설정
export const usePostTeamRoleEditMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectId, body }: { projectId: string; body: RequestTeamRoleEditDto }) =>
			postMypageTeamRoleEdit(projectId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

// (멤버 관리) 파트 변경
export const usePatchMemberFieldMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectUserId, body }: { projectUserId: string; body: RequestMemberFieldChangeDto }) =>
			patchMemberField(projectUserId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

// (멤버 관리) 강퇴
export const usePatchMemberKickMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (projectUserId: string) => patchMemberKick(projectUserId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

// (멤버 관리) 멤버 타입 변경 (리더 | 리드 | 멤버)
export const usePatchMemberTypeMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectUserId, body }: { projectUserId: string; body: RequestMemberTypeChangeDto }) =>
			patchMemberType(projectUserId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

// (역할 추가) 팀 파트 생성 (리더만 가능)
export const usePostTeamRoleCreateMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectId, body }: { projectId: string; body: RequestTeamRoleCreateDto }) =>
			postTeamRoleCreate(projectId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

export const useGetTeamRolesQuery = (projectId: string) => {
	return useQuery({
		queryKey: [...QUERY_KEY.mypage.project(), 'team-roles', projectId],
		queryFn: () => getTeamRoles(projectId),
		enabled: !!projectId,
		refetchOnMount: 'always',
		staleTime: 0,
	})
}

// (역할 수정) 마이페이지 팀 파트 수정 (CUSTOM만 가능, 리더만 가능)
export const usePatchTeamRoleUpdateMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			projectId,
			userTeamRoleId,
			body,
		}: {
			projectId: string
			userTeamRoleId: string
			body: RequestTeamRoleUpdateDto
		}) => patchTeamRoleUpdate(projectId, userTeamRoleId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
		},
	})
}

// (유저 순서 재정렬) 프로젝트 멤버들의 정렬 순서 지정
export const usePostProjectUsersReorderMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ projectId, body }: { projectId: string; body: RequestProjectUsersReorderDto }) =>
			postProjectUsersReorder(projectId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.mypage.project() })
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
// 받은 매칭 전체 조회

// 보낸 매칭 전체 조회
