import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useSignup } from '@/stores/useSignup'
import { useSignupStep } from '@/contexts/SignupStepContext'
import { useEffect, useRef, useState } from 'react'
import { useSignupForm2 } from '@/hooks/useForm'
import FormField from '@/components/auth/common/FormField'
import FieldMessage from '@/components/auth/common/FieldMessage'
import { useCheckMutation } from '@/hooks/auth/useUsersApi'

const EmailStep = () => {
	// 전역 상태
	const { setSignupData } = useSignup()
	const { setCurrentStep } = useSignupStep()
	// 지역 상태
	const [checkedEmail, setCheckedEmail] = useState<string>('') // 중복 확인한 이메일
	const [isSameEmail, setIsSameEmail] = useState<boolean>(false) // 이메일 중복인지
	const checkMutation = useCheckMutation()

	const handleSignupComplete = () => {
		setSignupData({ email, password, passwordConfirm: password2 ?? '' })
		setCurrentStep('agree')
	}

	// 유효성 검사
	const { register, errors, watch, clearErrors, setError } = useSignupForm2()
	const email = watch('email')
	const password = watch('password')
	const password2 = watch('password2')

	// 포커싱용 ref
	const emailInputRef = useRef<HTMLInputElement>(null) // 이름 필드
	const passwordInputRef = useRef<HTMLInputElement>(null) // 비밀번호 필드

	// ref 분리 (이름 필드 포커싱과 useForm사용시 ref가 겹침)
	const { ref: emailHookRef, ...emailRestRef } = register('email')
	const { ref: passwordHookRef, ...passwordRestRef } = register('password')
	const { onChange: password2OnChange, ...password2RestRef } = register('password2')

	// 다음으로 버튼 활성/비활성
	const isNextAvailable = password2 && !errors.password2

	// 초기 렌더링 시, 이름에 자동 포커싱
	useEffect(() => {
		emailInputRef.current?.focus()
	}, [])

	// 이메일(아이디) 중복 확인
	const handleSameEmail = async () => {
		if (!email) return

		clearErrors('email')

		try {
			const response = await checkMutation.mutateAsync({
				type: 'EMAIL',
				value: email,
			})

			setCheckedEmail(email)
			setIsSameEmail(response.body?.available === false)

			if (response.body?.available === true) {
				passwordInputRef.current?.focus()
			}
		} catch {
			setError('email', { type: 'manual', message: '중복 확인에 실패했습니다. 다시 시도해주세요.' })
		}
	}

	return (
		<div className='flex flex-col items-center justify-between h-full mt-42'>
			<div className='w-105'>
				<h2 className='heading-2 font-bold text-neutral-900 mb-9 text-center'>이메일로 가입</h2>

				{/* 폼 컨테이너 */}
				<div className='flex flex-col gap-4 mb-26.5'>
					{/* 이메일 */}
					<FormField
						label='이메일'
						messageArea={
							<>
								{/* 이메일 에러 메시지 */}
								{errors.email && <FieldMessage type='error' message={errors.email.message || ''} />}

								{/* 중복 이메일 */}
								{!errors.email && checkedEmail === email && checkedEmail !== '' && isSameEmail && (
									<FieldMessage type='error' message='이미 가입된 이메일입니다.' />
								)}
								{/* 사용 가능 이메일 */}
								{!errors.email && checkedEmail === email && checkedEmail !== '' && !isSameEmail && (
									<FieldMessage type='success' message='사용 가능한 이메일입니다.' />
								)}
							</>
						}
					>
						<div className='flex gap-1.5 w-full'>
							<Input
								category='auth'
								placeholder='이메일 입력해주세요'
								className={`placeholder:text-neutral-300 placeholder:title-2 flex-1 ${errors.email ? 'border-danger-700 focus:border-danger-700' : ''}`}
								ref={e => {
									emailHookRef(e)
									emailInputRef.current = e // 포커스용 ref 연결
								}}
								{...emailRestRef}
								onChange={e => {
									emailRestRef.onChange?.(e)
									if (checkedEmail) {
										setCheckedEmail('')
										setIsSameEmail(false)
									}
								}}
							/>

							{/* 중복 확인 버튼 */}
							<Button
								color='auth'
								className='w-40 h-14 title-2 px-5.5 py-3.5'
								onClick={handleSameEmail}
								disabled={!email || !!errors.email || checkMutation.isPending}
							>
								중복 확인
							</Button>
						</div>
					</FormField>

					{/* 비밀번호 */}
					<FormField
						label='비밀번호'
						messageArea={
							<>
								{/* 영문/숫자/특수문자를 포함 8자 이상 */}
								{errors.password && <FieldMessage type='error' message={errors.password.message || ''} />}

								{/* 사용 가능 */}
								{!errors.password && password && (
									<FieldMessage type='success' message='사용 가능한 비밀번호입니다.' />
								)}
							</>
						}
					>
						<Input
							type='password'
							category='auth'
							placeholder='비밀번호를 입력해주세요'
							className={`placeholder:text-neutral-300 placeholder:title-2 ${errors.password ? 'border-danger-700 focus:border-danger-700' : ''}`}
							ref={e => {
								passwordHookRef(e)
								passwordInputRef.current = e // 포커스용 ref 연결
							}}
							{...passwordRestRef}
						/>
					</FormField>

					{/* 비밀번호 재확인 */}
					<FormField
						label='비밀번호 확인'
						messageArea={
							<>
								{/* 비번 재확인 에러 메시지 */}
								{errors.password2 && <FieldMessage type='error' message={errors.password2.message || ''} />}

								{/* 비밀번호 확인 */}
								{!errors.password2 && password2 && (
									<FieldMessage type='success' message='비밀번호가 일치합니다.' />
								)}
							</>
						}
					>
						<Input
							type='password'
							category='auth'
							placeholder='비밀번호를 다시 입력해주세요'
							className={`placeholder:text-neutral-300 placeholder:title-2 ${errors.password2 ? 'border-danger-700 focus:border-danger-700' : ''}`}
							disabled={!password}
							{...password2RestRef}
							onChange={async e => {
								await password2OnChange(e)
								const password2 = e.target.value

								if (password2 !== password) {
									setError('password2', {
										type: 'manual',
										message: '비밀번호가 일치하지 않습니다.',
									})
								} else {
									clearErrors('password2')
								}
							}}
						/>
					</FormField>
				</div>

				<Button color='auth' onClick={handleSignupComplete} className='h-14' fullWidth disabled={!isNextAvailable}>
					다음
				</Button>
			</div>
		</div>
	)
}

export default EmailStep
