import AgreeStep from '@/components/auth/singup/AgreeStep'
import EmailStep from '@/components/auth/singup/EmailStep'
import SignupMain from '@/components/auth/singup/SignupMain'
import { useSignup } from '@/stores/useSignup'

const SignupPage = () => {
	const { currentStep } = useSignup()

	return (
		<div className='min-h-[calc(100vh-60px)]'>
			{/* 초기 방문자 -> 회원가입 메인화면 */}
			{currentStep === 'main' && <SignupMain />}

			{/* 이메일 회원가입 선택 -> 이메일 가입폼 */}
			{currentStep === 'form' && <EmailStep />}

			{/* 회원가입 완료 후 -> 약관동의 화면 */}
			{currentStep === 'agree' && <AgreeStep />}
		</div>
	)
}

export default SignupPage
