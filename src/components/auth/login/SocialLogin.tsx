import GoogleIcon from '@/assets/icons/signup/google.svg?react'
import KakaoIcon from '@/assets/icons/signup/kakao.svg?react'
import Button from '@/components/common/Button'

const SocialLogin = () => {
	return (
		<>
			{/* -- OR --  */}
			<div className='flex items-center mb-3.75'>
				<span className='w-20 h-px bg-neutral-200'></span>
				<span className='body-1 text-neutral-400 px-3'>or</span>
				<span className='w-20 h-px bg-neutral-200'></span>
			</div>

			{/* 소셜 로그인 */}
			<div className='w-[50%] flex flex-col gap-3'>
				<Button color='socialLogin' fullWidth>
					<GoogleIcon className='w-5.25 h-5.25' />
					Google 로그인
				</Button>

				<Button color='socialLogin' fullWidth>
					<KakaoIcon className='w-5.25 h-5.25' />
					카카오 로그인
				</Button>
			</div>
		</>
	)
}

export default SocialLogin
