import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import SignupIcon from '@/assets/icons/signup/auth-checkbox.svg?react'
import EyeClosed from '@/assets/icons/signup/eye-close.svg?react'
import EyeOpen from '@/assets/icons/signup/eye-open.svg?react'

import { useState, type FormEvent } from 'react'

const AuthForm = () => {
	const [autoLogin, setAutoLogin] = useState<boolean>(true) // 자동 로그인 여부
	const [showPassword, setShowPassword] = useState<boolean>(false) // 비번 보이게/안보이게

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log('로그인 버튼 누름')
	}

	return (
		<div className=' w-[50%] mb-6.5'>
			<form className='flex flex-col' onSubmit={handleSubmit}>
				{/* input 모음 */}
				<div className='flex flex-col gap-3'>
					<Input category='auth' type='email' placeholder='E-mail' />
					<div className='relative'>
						<Input category='auth' type={showPassword ? 'text' : 'password'} placeholder='Password' />

						{showPassword ? (
							<EyeOpen
								className='w-6 h-6 absolute right-4 top-4 cursor-pointer'
								onClick={() => setShowPassword(false)}
							/>
						) : (
							<EyeClosed
								className='w-6 h-6 absolute right-4 top-4 cursor-pointer'
								onClick={() => setShowPassword(true)}
							/>
						)}
					</div>
				</div>

				{/* 자동 로그인 */}
				<label className='w-fit flex justify-center items-center mt-3 mb-3.5 ml-1.25 gap-[2.5px] cursor-pointer '>
					<input
						type='checkbox'
						className='peer hidden'
						checked={autoLogin}
						onChange={() => setAutoLogin(prev => !prev)}
					/>
					<SignupIcon
						className={`duration-200 ease-in-out ${autoLogin ? 'text-primary-500-normal' : 'text-neutral-300 '}`}
					/>
					<span className='body-2 text-neutral-500 ml-1.75 hover:text-neutral-700 duration-200 ease-in-out'>
						자동 로그인
					</span>
				</label>

				{/* 로그인 버튼 */}
				<Button color='auth' size='lg' fullWidth>
					로그인
				</Button>
			</form>

			{/* 아이디/비번찾기 */}
			<div className='mt-4.5 flex justify-center items-center gap-4.5 '>
				<span className='body-1 text-neutral-500 cursor-pointer hover:text-neutral-700 duration-300 ease-in-out'>
					아이디/비밀번호 찾기
				</span>
				<span className='text-neutral-300'>|</span>
				<span className='body-1 text-primary-400-normal cursor-pointer hover:text-primary-600-normal duration-300 ease-in-out'>
					회원가입
				</span>
			</div>
		</div>
	)
}

export default AuthForm
