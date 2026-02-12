import { useMemo } from 'react'
import type { ProjectUserDto } from '@/types/api/project-users'

export type FilteredWorkspaceItem = { projectId: number; name: string }

export interface UseFilteredWorkspaceItemsOptions {
	/** 헤더에 표시할 최대 프로젝트 개수 (기본 2) */
	maxCount?: number
}

/**
 * 헤더용 워크스페이스(프로젝트) 목록: 유효한 항목만 필터 후 최대 N개까지 { projectId, name } 반환.
 * AnalysisHeader, ExploreHeader 등에서 공통 사용.
 */
const useFilteredWorkspaceItems = (
	projectData: ProjectUserDto[] | undefined,
	options: UseFilteredWorkspaceItemsOptions = {}
): FilteredWorkspaceItem[] => {
	const { maxCount = 2 } = options

	return useMemo(() => {
		if (!projectData || !Array.isArray(projectData) || projectData.length === 0) return []
		return projectData
			.slice(0, maxCount)
			.filter(p => p != null && p.projectId != null && String(p.projectTitle ?? '').trim() !== '')
			.map(p => ({ projectId: p.projectId!, name: p.projectTitle! }))
	}, [projectData, maxCount])
}

export default useFilteredWorkspaceItems
