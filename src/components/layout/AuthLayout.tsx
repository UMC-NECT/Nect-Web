import { Outlet, useLocation } from 'react-router'
import SignupHeader from '../header/SignupHeader'
import { useSignup } from '@/stores/useSignup'

export const AuthLayout = () => {
	const location = useLocation()
	const { currentStep } = useSignup()

	const showSignupHeader = location.pathname === '/signup' && ['main', 'form1', 'form2', 'agree', 'done'].includes(currentStep)

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
