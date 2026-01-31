import AgreeStep from '@/components/auth/singup/AgreeStep'
import DoneStep from '@/components/auth/singup/DoneStep'
import Form1Step from '@/components/auth/singup/Form1Step'
import Form2Step from '@/components/auth/singup/Form2Step'
import SignupMain from '@/components/auth/singup/SignupMain'
import { useSignup } from '@/stores/useSignup'

const SignupPage = () => {
	const { currentStep } = useSignup()

	return (
		<div className='min-h-[calc(100vh-60px)]'>
			{/* 초기 방문자 -> 회원가입 메인화면 */}
			{currentStep === 'main' && <SignupMain />}

			{/* 이메일 회원가입 선택 -> 이메일 가입폼 */}
			{currentStep === 'form1' && <Form1Step />}
			{currentStep === 'form2' && <Form2Step />}

			{/* 회원가입 완료 후 -> 약관동의 화면 */}
			{currentStep === 'agree' && <AgreeStep />}

			{/* 회원가입 완료 -> 완료 화면 */}
			{currentStep === 'done' && <DoneStep />}
		</div>
	)
}

export default SignupPage
