import { useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import { getProjectUsers } from '@/api/project-users/projectUsers'

export interface UseWorkspaceProjectIdOptions {
	/** projectId가 없을 때 첫 프로젝트로 리다이렉트할지 (기본 false) */
	redirectIfMissing?: boolean
}

/**
 * 워크스페이스 라우트에서 URL의 projectId를 읽어옵니다.
 * 새로고침해도 URL에 projectId가 있으면 유지됩니다.
 * redirectIfMissing: true면 projectId 없을 때 프로젝트 목록 조회 후 첫 프로젝트로 replace 리다이렉트.
 */
export const useWorkspaceProjectId = (options: UseWorkspaceProjectIdOptions = {}) => {
	const { redirectIfMissing = false } = options
	const { projectId: projectIdParam } = useParams<{ projectId?: string }>()
	const navigate = useNavigate()
	const location = useLocation()

	const projectId = projectIdParam != null ? parseInt(projectIdParam, 10) : null
	const projectIdStr = projectId != null ? String(projectId) : ''

	useEffect(() => {
		if (!redirectIfMissing || projectIdParam != null) return
		const run = async () => {
			try {
				const response = await getProjectUsers()
				if (response.body?.length) {
					const firstId = response.body[0].projectId
					const pathBase = '/' + location.pathname.split('/').filter(Boolean)[0]
					navigate(`${pathBase}/${firstId}`, { replace: true })
				}
			} catch (e) {
				console.error('프로젝트 목록 조회 실패:', e)
			}
		}
		run()
	}, [redirectIfMissing, projectIdParam, location.pathname, navigate])

	return { projectId, projectIdStr }
}
