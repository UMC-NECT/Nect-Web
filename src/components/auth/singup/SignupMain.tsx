import NectIcon from '@/assets/icons/common/nect-logo.svg?react'
import GoogleIcon from '@/assets/icons/auth/google.svg?react'
import KakaoIcon from '@/assets/icons/auth/kakao.svg?react'
import Button from '@/components/common/Button'
import OR from '@/components/common/OR'

import { useNavigate } from 'react-router'
import { useSignupStep } from '@/contexts/SignupStepContext'

const SignupMain = () => {
	const navigate = useNavigate()
	const { setCurrentStep } = useSignupStep()

	const handleGoogleLogin = () => {
		window.location.href = 'https://getnect.tech/oauth2/authorization/google'
	}
	const handleKakaoLogin = () => {
		window.location.href = 'https://getnect.tech/oauth2/authorization/kakao'
	}

	return (
		<div className='mt-31.5'>
			<div className='flex flex-col justify-center items-center'>
				{/* 헤더 */}
				<div className='mb-14'>
					<NectIcon className='w-56.5 h-10 mb-8' />

					<div className='flex flex-col justify-center items-center gap-0.75'>
						<div className='text-[26px] tracking-tight text-primary-400-normal font-semibold'>Connect your Next!</div>
						<div className='text-[18px] text-neutral-800'>당신과 함께 성장할 팀을 넥트에서</div>
					</div>
				</div>

				{/* 소셜 로그인 */}
				<div className='w-105 flex flex-col gap-3 mb-8'>
					<Button color='socialLogin' fullWidth onClick={handleGoogleLogin}>
						<GoogleIcon className='w-5.25 h-5.25' />
						Google로 시작하기
					</Button>

					<Button color='socialLogin' fullWidth onClick={handleKakaoLogin} className='bg-social-kakao border-none'>
						<KakaoIcon className='w-5.25 h-5.25' />
						카카오로 시작하기
					</Button>
					<Button color='auth' size='lg' fullWidth className='font-normal' onClick={() => setCurrentStep('form1')}>
						이메일로 시작하기
					</Button>
				</div>

				{/* OR */}
				<OR />

				<div className='flex justify-center items-center gap-3'>
					<span className='body-1 text-neutral-500'>이미 넥트 회원이신가요?</span>
					<span
						className='body-1 text-primary-400-normal cursor-pointer hover:underline'
						onClick={() => {
							//setIsSignup(false)
							navigate('/login')
						}}
					>
						로그인
					</span>
				</div>
			</div>
		</div>
	)
}

export default SignupMain
