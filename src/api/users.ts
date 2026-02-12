import type { CommonResponse } from '@/types/api/commonResponse'
import type {
	RequestAgreeDto,
	RequestCheckDto,
	RequestLoginDto,
	RequestRefreshTokenDto,
	RequestSetupDto,
	RequestSignupDto,
	ResponseCheckDto,
	ResponseEmailDto,
	ResponseLoginDto,
	ResponseProfileAnalysisDto,
	ResponseProfileDto,
	ResponseRefreshTokenDto,
	ResponseSignupDto,
} from '@/types/api/users'
import type { ResponseProfileImageUploadDto } from '@/types/api/file'
import { api } from '@/utils/AxiosInstance'

/** 이메일과 비밀번호로 로그인합니다. 성공 시 액세스 토큰과 리프레시 토큰을 발급합니다. autoLoginEnabled가 true면 자동 로그인 활성화, false면 비활성화입니다. */
export const postLogin = async (body: RequestLoginDto): Promise<ResponseLoginDto> => {
	const { data } = await api.post('/api/v1/users/login', body)
	return data
}

/** 현재 사용자를 로그아웃합니다. 현재 토큰은 블랙리스트에 추가되어 더 이상 사용할 수 없습니다. */
export const postLogout = async (): Promise<CommonResponse> => {
	const { data } = await api.post('/api/v1/users/logout')
	return data
}

/** 새로운 계정을 생성합니다. 닉네임, 생년월일, 직업, 역할 등은 프로필 설정 API에서 입력합니다. */
export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
	const { data } = await api.post('/api/v1/users/signup', body)
	return data
}

/** 사용자의 프로필 정보를 설정합니다. */
export const postSetup = async (body: RequestSetupDto): Promise<CommonResponse> => {
	const { data } = await api.post('/api/v1/users/profile/setup', body)
	return data
}

/** 서비스 이용약관과 개인정보 수집 이용에 동의합니다. 두 가지 동의는 필수이며, 마케팅 정보 수신은 선택입니다. */
export const postAgree = async (body: RequestAgreeDto): Promise<CommonResponse> => {
	const { data } = await api.post('/api/v1/users/agree', body)
	return data
}

/** 이메일 또는 전화번호, 닉네임의 중복 여부를 확인합니다.
 *
 * available이 true이면 사용 가능, false이면 이미 사용 중입니다. 검사 type은 - EMAIL: 이메일 중복검사, PHONE: 전화번호 중복검사, NICKNAME: 닉네임 중복검사 */
export const postCheck = async (body: RequestCheckDto): Promise<ResponseCheckDto> => {
	const { data } = await api.post('/api/v1/users/check', body)
	return data
}

/** 액세스 토큰으로 현재 사용자의 이메일을 조회합니다. */
export const getEmail = async (): Promise<ResponseEmailDto> => {
	const { data } = await api.get('/api/v1/users/email')
	return data
}

/** 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급합니다. 리프레시 토큰도 함께 갱신됩니다. */
export const postRefreshToken = async (body: RequestRefreshTokenDto): Promise<ResponseRefreshTokenDto> => {
	const { data } = await api.post('/api/v1/users/refresh', body)
	return data
}

/** 헤더에 표시할 프로필 정보를 조회합니다. */
export const getProfile = async (): Promise<ResponseProfileDto> => {
	const { data } = await api.get('/api/v1/home/profile')
	return data
}

/** 사용자의 프로필 정보를 AI로 분석합니다. 타입, 태그, 협업스타일(5개 차원), 스킬, 역할별 추천, 성장가이드를 제공합니다. */
export const getProfileAnalysis = async (): Promise<ResponseProfileAnalysisDto> => {
	const { data } = await api.get('/api/v1/users/profile/analysis')
	return data
}

/** 프로필 이미지를 업로드합니다. 업로드된 파일명과 Presigned URL을 반환합니다.
 *
 * 지원 포맷: JPG, PNG, GIF, BMP, WebP 등
 */
export const postProfileImageUpload = async (file: File): Promise<ResponseProfileImageUploadDto> => {
	const formData = new FormData()
	formData.append('file', file)

	const { data } = await api.post('/api/v1/files/upload', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})
	return data
}
