import { Navigate } from 'react-router'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { LOCAL_STORAGE_KEY } from '@/constants/key'

type OnboardingGuardProps = {
	children: React.ReactNode
}

/** 로그인 상태이고 온보딩 미완료면 /onboarding으로 리다이렉트 */
export const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
	const accessToken = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN).getItem()
	const onboardingCompleted = useLocalStorage(LOCAL_STORAGE_KEY.ONBOARDING_COMPLETED).getItem()

	if (accessToken && onboardingCompleted !== 'true') {
		return <Navigate to='/onboarding' replace />
	}
	return <>{children}</>
}
