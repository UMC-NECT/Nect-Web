import AuthForm from '@/components/auth/login/AuthForm'
import AuthHeader from '@/components/auth/login/AuthHeader'
import SocialLogin from '@/components/auth/login/SocialLogin'
import Footer from '@/components/layout/Footer'

const LoginPage = () => {
	return (
		<div className=' min-h-screen flex flex-col pt-38.75 items-center'>
			{/* 상단 - 헤더 */}
			<AuthHeader />

			{/* 중앙 - 로그인 폼 */}
			<AuthForm />

			{/* 하단 - 소셜 로그인 */}
			<SocialLogin />

			<Footer type='Mini' margin='144' />
		</div>
	)
}

export default LoginPage
