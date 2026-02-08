import type { CommonResponse } from '@/types/api/commonResponse'
import type { RequestProcessOrderPatchDto, RequestProcessPatchDto, RequestProcessPostDto, RequestProcessStatusPatchDto, ResponseHistoryDto, ResponseProcessDetailDto, ResponseProcessOrderPatchDto, ResponseProcessPartDto, ResponseProcessPatchDto, ResponseProcessPostDto, ResponseProcessStatusPatchDto, ResponseProcessWeekDto, ResponseProgressSummaryDto } from '@/types/api/process/process'
import { api } from '@/utils/AxiosInstance'
import { toQueryString } from '@/utils/queryString'

/** 프로젝트에 새로운 프로세스(카드)를 생성합니다. */
export const postProcess = async (projectId: number, body: RequestProcessPostDto): Promise<ResponseProcessPostDto> => {
    const { data } = await api.post(`/api/v1/projects/${projectId}/processes`, body)
    return data
}

/** 파트(분야)별 작업 현황을 조회합니다. field_id 미입력(null) 시 팀 탭. */
export const getProcessPart = async (projectId: string, fieldId?: string): Promise<ResponseProcessPartDto> => {
    const query = toQueryString({ field_id: fieldId })
    const { data } = await api.get(`/api/v1/projects/${projectId}/processes/parts${query}`)
    return data
}

/** 프로젝트의 프로세스를 주차 기준으로 조회합니다. start_date 미입력 시 현재 주차 기준, weeks를 통해 여러 주차를 한번에 조회할 수 있습니다. */
export const getProcessWeek = async (projectId: string, start_date?: string, weeks?: string): Promise<ResponseProcessWeekDto> => {
    const query = toQueryString({ start_date, weeks })
    const { data } = await api.get(`/api/v1/projects/${projectId}/processes/week${query}`)
    return data
}

/** 프로젝트 내 프로세스(카드) 상세 정보를 조회합니다. */
export const getProcessDetail = async (projectId: string, processId: string): Promise<ResponseProcessDetailDto> => {
    const {data} = await api.get(`/api/v1/projects/${projectId}/processes/${processId}`)

    return data
}

/** 프로세스(카드)를 삭제합니다. */
export const deleteProcess = async (projectId: string, processId: string): Promise<CommonResponse> => {
    const {data} = await api.delete(`/api/v1/projects/${projectId}/processes/${processId}`)

    return data
}

/** 프로세스(카드)의 기본 정보(제목/내용/상태/기간/담당자/분야/멘션)를 수정합니다. */
export const patchProcess = async (projectId: string, processId: string, body: RequestProcessPatchDto): Promise<ResponseProcessPatchDto> => {
    const {data} = await api.patch(`/api/v1/projects/${projectId}/processes/${processId}`, body)

    return data
}

/** 프로세스의 상태 컬럼 내 정렬/이동 정보를 저장합니다. */
export const patchProcessOrder = async (projectId: string, processId: string, body: RequestProcessOrderPatchDto): Promise<ResponseProcessOrderPatchDto> => {
    const {data} = await api.patch(`/api/v1/projects/${projectId}/processes/${processId}/order`, body)
    return data
}

/** 프로세스의 작업 상태(ProcessStatus)를 변경합니다. */
export const patchProcessStatus = async (projectId: string, processId: string, body: RequestProcessStatusPatchDto): Promise<ResponseProcessStatusPatchDto> => {
    const {data} = await api.patch(`/api/v1/projects/${projectId}/processes/${processId}/status`, body)
    return data
}

/** 프로젝트의 ROLE/CUSTOM 레인별 프로세스 상태 진행률(PLANNING/IN_PROGRESS/DONE)을 요약 조회합니다. */
export const getProgressSummary = async (projectId: string): Promise<ResponseProgressSummaryDto> => {
    const {data} = await api.get(`/api/v1/projects/${projectId}/processes/parts/progress-summary`)
    return data
}

/** 프로젝트의 히스토리를 조회합니다.
 *
 * cursor 미입력 시 서버 정책으로 최신 로그부터 조회합니다. (서버 정책: 최근 10개 고정)
*/
export const getProcessHistory = async (projectId: string, cursor?: number): Promise<ResponseHistoryDto> => {
    const query = toQueryString({ cursor: cursor?.toString() })
    const {data} = await api.get(`/api/v1/projects/${projectId}/histories${query}`)
    return data
}