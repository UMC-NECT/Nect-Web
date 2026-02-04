import type { RequestPostAnalysisDto, ResponseCreateProjectDto, ResponseGetAnalysisDto, ResponsePostAnalysisDto } from "@/types/api/analysis"
import type { CommonResponse } from "@/types/api/commonResponse"
import { api } from "@/utils/AxiosInstance"
import { toQueryString } from "@/utils/queryString"

/** 사용자의 프로젝트 아이디어를 AI가 분석하여 팀 구성, 프로젝트 기간, 보완점, 주차별 로드맵을 제안합니다.  */
export const postAnalysis = async (body: RequestPostAnalysisDto): Promise<ResponsePostAnalysisDto> => {
    const {data} = await api.post('/api/v1/analysis', body)
    return data
}

/**사용자의 아이디어 분석 결과를 페이징하여 조회합니다. 한 페이지당 1개의 분석서가 조회되며, 화살표 버튼으로 이전/다음 분석서를 탐색할 수 있습니다.

페이징 정보:

page: 0부터 시작 (0 = 최신 분석서, 1 = 이전 분석서)
최대 2개의 분석서만 존재
has_next/has_previous로 다음/이전 페이지 존재 여부 확인 가능  */
export const getAnalysis = async (page?: string): Promise<ResponseGetAnalysisDto> => {
    const query = toQueryString({ page: page })
    const {data} = await api.get(`/api/v1/analysis${query}`)
    return data
}

/** 사용자의 아이디어 분석 결과를 삭제합니다. */
export const deleteAnalysis = async (analysisId: string): Promise<CommonResponse> => {
    const {data} = await api.delete(`/api/v1/analysis/${analysisId}`)
    return data
}

/** 프로젝트 생성 프로세스 */
export const postCreateProject = async (analysisId: string): Promise<ResponseCreateProjectDto> => {
    const {data} = await api.post(`/api/v1/analysis/${analysisId}/project`)
    return data
}