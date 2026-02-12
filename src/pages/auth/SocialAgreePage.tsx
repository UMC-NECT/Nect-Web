import { SignupStepProvider } from '@/contexts/SignupStepContext'
import AgreeStep from '@/components/auth/singup/AgreeStep'
import { useState } from 'react'
import LoginCompletePage from './LoginCompletePage'

const SocialAgreePage = () => {
	const [isComplete, setIsComplete] = useState(false)
	return (
		<SignupStepProvider>
			{isComplete ? <LoginCompletePage /> : <AgreeStep setIsComplete={setIsComplete} />}
		</SignupStepProvider>
	)
}

export default SocialAgreePage