import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import SignupIcon from '@/assets/icons/auth/auth-checkbox.svg?react'
import EyeClosed from '@/assets/icons/auth/eye-close.svg?react'
import EyeOpen from '@/assets/icons/auth/eye-open.svg?react'
import CheckIcon from '@/assets/icons/auth/check-icon.svg?react'

import { useState } from 'react'
import { useLoginForm } from '@/hooks/useForm'
import { Link, useNavigate } from 'react-router'

const AuthForm = () => {
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [loginError, setLoginError] = useState<string>('')
	const navigate = useNavigate()

	// 유효성 검사용
	const { register, handleSubmit, errors, watch } = useLoginForm()

	// 폼 데이터 감시
	const email = watch('email')
	const password = watch('password')
	const isAuthLogin = watch('autoLogin')

	// 이메일과 비밀번호가 모두 입력되었는지 확인 (버튼 활성/비활성화용)
	const isFormFilled = email && password

	// 폼 제출 (로그인 버튼 클릭)
	const onSubmit = () => {
		setLoginError('')

		// 나중에 api연결로 대체
		try {
			if (email === 'test@naver.com' && password === 'qwerty1!') {
				console.log('로그인 성공!', email, password)
				navigate('/')
			} else {
				setLoginError('가입되지 않은 계정이거나, 아이디/비밀번호가 일치하지 않습니다.')
			}
		} catch {
			setLoginError('가입되지 않은 계정이거나, 아이디/비밀번호가 일치하지 않습니다.')
		}
	}

	return (
		<div className=' w-105 mb-6.5'>
			<form className='flex flex-col' onSubmit={handleSubmit(onSubmit)} noValidate>
				<div className='flex flex-col gap-3'>
					{/* 이메일 */}
					<Input
						category='auth'
						type='email'
						placeholder='E-mail'
						{...register('email')}
						className={`${errors.email ? 'border-danger-700' : ''} `}
					/>

					{/* 비밀번호 */}
					<div className='relative'>
						<Input
							category='auth'
							type={showPassword ? 'text' : 'password'}
							placeholder='Password'
							{...register('password')}
						/>

						{/* 아이콘 (비번 보이게/안보이게) */}
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
				<label className=' w-fit h-5 flex justify-center items-center mt-3 mb-3.5 ml-1.25 gap-[2.5px] cursor-pointer '>
					<input type='checkbox' className='peer hidden' {...register('autoLogin')} />
					<SignupIcon
						className={`duration-200 ease-in-out ${isAuthLogin ? 'text-primary-500-normal' : 'text-neutral-300 '}`}
					/>
					<span className='body-2 text-neutral-500 ml-1.75 hover:text-neutral-700 duration-200 ease-in-out'>
						자동 로그인
					</span>
				</label>

				{/* 에러 메시지 영역 */}
				{(errors.email || loginError) && (
					<div className='flex items-center mb-3'>
						<CheckIcon className='w-3 h-3 text-danger-700 mr-1' />
						<p className='body-2 text-danger-700'>{errors.email?.message || loginError}</p>
					</div>
				)}

				{/* 로그인 버튼 */}
				<Button color='auth' size='lg' fullWidth disabled={!isFormFilled}>
					로그인
				</Button>
			</form>

			{/* 아이디/비번찾기 */}
			<div className='mt-4.5 flex justify-center items-center gap-4.5 '>
				<span className='body-1 text-neutral-500 cursor-pointer hover:underline'>아이디/비밀번호 찾기</span>
				<span className='text-neutral-300'>|</span>
				<Link to={'/signup'} className='body-1 text-primary-400-normal cursor-pointer hover:underline'>회원가입</Link>
			</div>
		</div>
	)
}

export default AuthForm
