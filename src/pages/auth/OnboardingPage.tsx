import { Navigate } from 'react-router'
import OnboardingMain from '@/components/auth/onboarding/OnboardingMain'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { LOCAL_STORAGE_KEY } from '@/constants/key'

const OnboardingPage = () => {
	const accessToken = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN).getItem()

	if (!accessToken) {
		return <Navigate to='/login' replace />
	}

	return (
		<>
			<OnboardingMain />
		</>
	)
}

export default OnboardingPage
