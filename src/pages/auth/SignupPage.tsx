import AgreeStep from '@/components/auth/singup/AgreeStep'
import DoneStep from '@/components/auth/singup/DoneStep'
import Form1Step from '@/components/auth/singup/Form1Step'
import Form2Step from '@/components/auth/singup/Form2Step'
import SignupMain from '@/components/auth/singup/SignupMain'
import { SignupStepProvider, useSignupStep } from '@/contexts/SignupStepContext'

const SignupPageContent = () => {
	const { currentStep } = useSignupStep()

	return (
		<div className='min-h-[calc(100vh-60px)]'>
			{currentStep === 'main' && <SignupMain />}
			{currentStep === 'form1' && <Form1Step />}
			{currentStep === 'form2' && <Form2Step />}
			{currentStep === 'agree' && <AgreeStep />}
			{currentStep === 'done' && <DoneStep />}
		</div>
	)
}

const SignupPage = () => {
	return (
		<SignupStepProvider>
			<SignupPageContent />
		</SignupStepProvider>
	)
}

export default SignupPage
