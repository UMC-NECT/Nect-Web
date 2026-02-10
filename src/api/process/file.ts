import type { RequestFilePostDto, ResponseFileDto } from '@/types/api/file'
import { api } from '@/utils/AxiosInstance'

/**
 * 프로젝트에 파일을 업로드합니다.
 * @param body FormData (예: formData.append('file', file) - 백엔드에서 요구하는 필드명으로 맞출 것)
 */
export const postFile = async (projectId: string, body: RequestFilePostDto): Promise<ResponseFileDto> => {
    const { data } = await api.post(`/api/v1/projects/${projectId}/files/upload`, body)
    return data
}