import GoogleIcon from '@/assets/icons/auth/google.svg?react'
import KakaoIcon from '@/assets/icons/auth/kakao.svg?react'
import Button from '@/components/common/Button'
import OR from '@/components/common/OR'

const SocialLogin = () => {
	return (
		<>
			{/* -- OR --  */}
			<OR />

			{/* 소셜 로그인 */}
			<div className='w-105 flex flex-col gap-3'>
				<Button color='socialLogin' fullWidth>
					<GoogleIcon className='w-5.25 h-5.25' />
					Google 로그인
				</Button>

				<Button color='socialLogin' fullWidth className='bg-social-kakao border-none'>
					<KakaoIcon className='w-5.25 h-5.25' />
					카카오 로그인
				</Button>
			</div>
		</>
	)
}

export default SocialLogin
