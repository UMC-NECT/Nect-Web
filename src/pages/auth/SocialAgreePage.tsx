import { SignupStepProvider } from '@/contexts/SignupStepContext'
import AgreeStep from '@/components/auth/singup/AgreeStep'

const SocialAgreePage = () => {
	return (
		<SignupStepProvider>
			<AgreeStep />
		</SignupStepProvider>
	)
}

export default SocialAgreePage