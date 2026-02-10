import { Navigate, useLocation } from 'react-router'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { LOCAL_STORAGE_KEY } from '@/constants/key'

interface ProtectedRouteProps {
	children: React.ReactNode
}

/** 토큰이 있을 때만 자식 렌더링, 없으면 /login으로 리다이렉트 (로그인 후 돌아올 경로 전달) */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const location = useLocation()
	const accessToken = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN).getItem()

	if (!accessToken) {
		return <Navigate to='/login' state={{ from: location.pathname }} replace />
	}

	return <>{children}</>
}
