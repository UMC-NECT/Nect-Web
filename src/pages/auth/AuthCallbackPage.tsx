/**
 * 소셜 로그인 콜백 페이지.
 * 백엔드가 JWT 발급 후 이 경로로 리다이렉트해야 함.
 * 프론트 도메인: https://umc-nect.netlify.app → 콜백 URL: https://umc-nect.netlify.app/auth/callback
 */
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { LOCAL_STORAGE_KEY } from '@/constants/key'

const AuthCallbackPage = () => {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
	const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN)
	const { setItem: setOnboardingCompleted } = useLocalStorage(LOCAL_STORAGE_KEY.ONBOARDING_COMPLETED)

	useEffect(() => {
		const accessToken = searchParams.get('accessToken')
		const refreshToken = searchParams.get('refreshToken')
		const onboardingCompleted = searchParams.get('isOnboardingCompleted')

		// 필수 토큰이 없으면 로그인 페이지로 돌려보냄
		if (!accessToken || !refreshToken) {
			navigate('/login', { replace: true })
			return
		}

		setAccessToken(accessToken)
		setRefreshToken(refreshToken)

		// 온보딩 완료 여부에 따라 분기 (백엔드에서 넘겨준다고 가정)
		if (onboardingCompleted === 'false') {
			setOnboardingCompleted('false')
			localStorage.setItem('isSocial', 'true')
			navigate('/social-agree', { replace: true })
		} else {
			// 기본값: 온보딩 완료 처리 후 메인으로 이동
			setOnboardingCompleted('true')
			navigate('/', { replace: true })
		}
	}, [navigate, searchParams, setAccessToken, setRefreshToken, setOnboardingCompleted])

	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='flex flex-col items-center gap-3'>
				<div className='w-10 h-10 border-4 border-neutral-200 border-t-primary-500-normal rounded-full animate-spin' />
			</div>
		</div>
	)
}

export default AuthCallbackPage

