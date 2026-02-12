import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import SignupHeader from '../header/SignupHeader'

export const AuthLayout = () => {
	const location = useLocation()
	const showSignupHeader = location.pathname === '/signup'

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location.pathname])

	return (
		<div className='h-screen overflow-hidden flex flex-col'>
			{/* 회원가입 과정이라면 헤더 존재 */}
			<div className='w-full max-w-main mx-auto'>{showSignupHeader && <SignupHeader />}</div>

			{/* 로그인 과정에는 헤더 없음 */}
			<div className='w-full max-w-main mx-auto flex-1'>
				<Outlet />
			</div>
		</div>
	)
}
