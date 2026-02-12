import { api } from "@/utils/AxiosInstance"
import type {
	RequestStatusPatchDto,
	RequestTaskPatchDto,
	ResponseMissionDetailDto,
	ResponseMissionDto,
	ResponseMissionListDto,
	ResponseStatusPatchDto,
	ResponseTaskPatchDto,
	ResponseTaskItemsReorderPatchDto,
	RequestTaskItemsReorderPatchDto,
} from '@/types/api/process/weekMission'
import type { CommonResponse } from '@/types/api/commonResponse'

/** start_date 기준으로 weeks 만큼 위크미션 주차 목록을 조회합니다. start_date 미입력 시 서버 정책에 따른 기본 시작일로 동작합니다. */
export const getWeekMission = async (projectId: string, weeks: string, start_date?: string): Promise<ResponseMissionDto> => {
    const params: { weeks: string; start_date?: string } = { weeks }
    if (start_date) params.start_date = start_date
    const { data } = await api.get(`/api/v1/projects/${projectId}/week-missions/week`, { params })
    return data
}

/** 멤버형 모달에서 미션(주차) 선택을 위한 드롭다운 목록을 조회합니다. */
export const getMissionList = async (projectId: string): Promise<ResponseMissionListDto> => {
    const { data } = await api.get(`/api/v1/projects/${projectId}/week-missions/missions`)
    return data
}

/** 위크미션(프로세스) 상세를 조회합니다. (체크리스트 포함) */
export const getMissionDetail = async (projectId: string, processId: string): Promise<ResponseMissionDetailDto> => {
    const { data } = await api.get(`/api/v1/projects/${projectId}/week-missions/${processId}`)
    return data
}

/** 위크미션 프로세스의 상태를 변경합니다. */
export const patchMissionStatus = async (projectId: string, processId: string, body: RequestStatusPatchDto): Promise<ResponseStatusPatchDto> => {
    const { data } = await api.patch(`/api/v1/projects/${projectId}/week-missions/${processId}/status`, body)
    return data
}

/** 위크미션 프로세스 내 TaskItem의 내용을 수정합니다. */
export const patchTaskItem = async (projectId: string, processId: string, taskItemId: string, body: RequestTaskPatchDto): Promise<ResponseTaskPatchDto> => {
    const { data } = await api.patch(`/api/v1/projects/${projectId}/week-missions/${processId}/task-items/${taskItemId}`, body)
    return data
}

/** 위크미션 프로세스 내 TaskItem을 삭제합니다. */
export const deleteTaskItem = async (
    projectId: string,
    processId: string,
    taskItemId: string
): Promise<CommonResponse<void>> => {
    const { data } = await api.delete(`/api/v1/projects/${projectId}/week-missions/${processId}/task-items/${taskItemId}`)
    return data
}

export const patchTaskItemsReorder = async (
    projectId: string,
    processId: string,
    body: RequestTaskItemsReorderPatchDto
): Promise<ResponseTaskItemsReorderPatchDto> => {
    const { data } = await api.patch(`/api/v1/projects/${projectId}/week-missions/${processId}/task-items/reorder`, body)
    return data
}