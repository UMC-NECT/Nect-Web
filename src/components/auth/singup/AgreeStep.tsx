import { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import Button from '@/components/common/Button'
import CheckIcon from '@/assets/icons/auth/check-icon.svg?react'
import CheckboxIcon from '@/assets/icons/auth/checkbox.svg?react'
import { useSignup } from '@/stores/useSignup'
import { useSignupStep } from '@/contexts/SignupStepContext'
import { useAgreeForm, useSocialAgreeForm } from '@/hooks/useForm'
import { useSignupMutation, useAgreeMutation, useCheckMutation } from '@/hooks/auth/useUsersApi'
import FormField from '../common/FormField'
import FieldMessage from '../common/FieldMessage'
import Input from '@/components/common/Input'

const AgreeStep = () => {
	const navigate = useNavigate()
	const { signupData } = useSignup()
	const { setCurrentStep } = useSignupStep()
	const [errorMessage, setErrorMessage] = useState('')
	const signupMutation = useSignupMutation()
	const agreeMutation = useAgreeMutation()
	const checkMutation = useCheckMutation()
	const isSubmitting = signupMutation.isPending || agreeMutation.isPending
	const isSocial = typeof window !== 'undefined' && localStorage.getItem('isSocial') === 'true'

	// 약관 동의 폼 (공통)
	const { register, watch, setValue, handleSubmit } = useAgreeForm()
	const agree1 = watch('agree1')
	const agree2 = watch('agree2')
	const agree3 = watch('agree3')
	const agree4 = watch('agree4')
	const agreeAll = agree1 && agree2 && agree3 && agree4
	const isRequiredAgree = agree1 && agree2 && agree3

	const handleAgreeAll = (e: React.MouseEvent) => {
		e.preventDefault()
		const newValue = !agreeAll
		setValue('agree1', newValue)
		setValue('agree2', newValue)
		setValue('agree3', newValue)
		setValue('agree4', newValue)
	}

	// 소셜: 이메일 폼 + 중복 확인 (Form2Step과 동일 로직)
	const socialForm = useSocialAgreeForm()
	const [checkedEmail, setCheckedEmail] = useState('')
	const [isSameEmail, setIsSameEmail] = useState(false)
	const emailInputRef = useRef<HTMLInputElement>(null)
	const { ref: emailHookRef, ...emailRestRef } = socialForm.register('email')
	const socialEmail = socialForm.watch('email')

	const handleSameEmail = async () => {
		if (!socialEmail) return
		socialForm.clearErrors('email')
		try {
			const response = await checkMutation.mutateAsync({
				type: 'EMAIL',
				value: socialEmail,
			})
			setCheckedEmail(socialEmail)
			setIsSameEmail(response.body?.available === false)
			if (response.body?.available === true) {
				emailInputRef.current?.focus()
			}
		} catch {
			socialForm.setError('email', { type: 'manual', message: '중복 확인에 실패했습니다. 다시 시도해주세요.' })
		}
	}

	const onSubmit = async () => {
		setErrorMessage('')
		try {
			if (isSocial) {
				await agreeMutation.mutateAsync({
					termsAgreed: agree2,
					privacyAgreed: agree3,
					marketingAgreed: agree4 ?? false,
					email: socialEmail?.trim(),
				})
				localStorage.removeItem('isSocial')
				navigate('/onboarding', { replace: true })
			} else {
				const signupResponse = await signupMutation.mutateAsync({
					email: signupData.email,
					password: signupData.password,
					passwordConfirm: signupData.passwordConfirm,
					name: signupData.name,
					phoneNumber: signupData.phoneNumber,
				})
				if (!signupResponse.body?.accessToken || !signupResponse.body?.refreshToken) {
					setErrorMessage('회원가입 응답 오류입니다. 다시 시도해주세요.')
					return
				}
				await agreeMutation.mutateAsync({
					termsAgreed: agree2,
					privacyAgreed: agree3,
					marketingAgreed: agree4 ?? false,
				})
				setCurrentStep('done')
			}
		} catch {
			setErrorMessage(
				isSocial ? '약관 동의에 실패했습니다. 다시 시도해주세요.' : '회원가입에 실패했습니다. 다시 시도해주세요.'
			)
		}
	}

	const isSocialSubmitReady =
		isRequiredAgree &&
		!!socialEmail?.trim() &&
		!socialForm.errors.email &&
		checkedEmail === socialEmail &&
		checkedEmail !== '' &&
		!isSameEmail
	const isSubmitDisabled = isSocial ? !isSocialSubmitReady || isSubmitting : !isRequiredAgree || isSubmitting

	return (
		<div className='flex flex-col items-center justify-start mt-50.5'>
			<div className='w-105 h-124'>
				<div className='flex flex-col justify-center items-center'>
					<div className='heading-2 text-neutral-900 font-bold mb-11'>계정 확인 및 약관 동의</div>
					{isSocial ? (
						<div className='mb-[46px]'>
							<FormField
								label='이메일'
								messageArea={
									<>
										{socialForm.errors.email && (
											<FieldMessage type='error' message={socialForm.errors.email.message || ''} />
										)}
										{!socialForm.errors.email &&
											checkedEmail === socialEmail &&
											checkedEmail !== '' &&
											isSameEmail && <FieldMessage type='error' message='이미 가입된 이메일입니다.' />}
										{!socialForm.errors.email &&
											checkedEmail === socialEmail &&
											checkedEmail !== '' &&
											!isSameEmail && <FieldMessage type='success' message='사용 가능한 이메일입니다.' />}
									</>
								}
							>
								<div className='flex gap-1.5 w-full'>
									<Input
										category='auth'
										placeholder='이메일 입력해주세요'
										className={`placeholder:text-neutral-300 placeholder:title-2 flex-1 ${socialForm.errors.email ? 'border-danger-700 focus:border-danger-700' : ''}`}
										ref={e => {
											emailHookRef(e)
											emailInputRef.current = e
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
									<Button
										color='auth'
										className='w-40 h-14 title-2 px-5.5 py-3.5'
										onClick={handleSameEmail}
										disabled={!socialEmail || !!socialForm.errors.email || checkMutation.isPending}
									>
										중복 확인
									</Button>
								</div>
							</FormField>
						</div>
					) : (
						<div className='title-2 text-neutral-900 px-30 py-4.5 bg-primary-100-light rounded-12 mb-8.5'>
							{signupData.email}
						</div>
					)}

					{errorMessage && <div className='title-2 text-danger-700 mb-4'>{errorMessage}</div>}
				</div>

				<div className='w-fit flex justify-center items-center cursor-pointer' onClick={handleAgreeAll}>
					<CheckboxIcon
						className={`mr-3.5 text-primary-150-light ${agreeAll ? 'text-primary-500-normal' : 'text-primary-150-light'}`}
					/>
					<div className='title-2'>모두 동의합니다.</div>
				</div>
				<div className='w-105 h-px bg-neutral-200 my-4'></div>

				<div className='flex flex-col items-start gap-3 mb-13.5'>
					<label className='flex justify-center items-center gap-2 cursor-pointer'>
						<input
							type='checkbox'
							className='peer hidden'
							{...register('agree1', {
								onChange: () => setValue('agree1', !agree1),
							})}
						/>
						<CheckIcon
							className={`w-3.5 h-2.5 mx-1.75 my-2.25 cursor-pointer transition-colors ${agree1 ? 'text-primary-400-normal' : 'text-primary-200-light'}`}
						/>
						<div className='title-3 text-neutral-500'>만 14세 이상 입니다</div>
					</label>
					<label className='flex justify-center items-center gap-2 cursor-pointer'>
						<input type='checkbox' className='peer hidden' {...register('agree2')} />
						<CheckIcon
							className={`w-3.5 h-2.5 mx-1.75 my-2.25 cursor-pointer transition-colors ${agree2 ? 'text-primary-400-normal' : 'text-primary-200-light'}`}
						/>
						<div className='title-3 text-neutral-500'>
							(필수) <span>서비스 이용약관</span> 동의
						</div>
					</label>
					<label className='flex justify-center items-center gap-2 cursor-pointer'>
						<input type='checkbox' className='peer hidden' {...register('agree3')} />
						<CheckIcon
							className={`w-3.5 h-2.5 mx-1.75 my-2.25 cursor-pointer transition-colors ${agree3 ? 'text-primary-400-normal' : 'text-primary-200-light'}`}
						/>
						<div className='title-3 text-neutral-500'>
							(필수) <span>개인정보 수집 이용</span> 동의
						</div>
					</label>
					<label className='flex justify-center items-center gap-2 cursor-pointer'>
						<input type='checkbox' className='peer hidden' {...register('agree4')} />
						<CheckIcon
							className={`w-3.5 h-2.5 mx-1.75 my-2.25 cursor-pointer transition-colors ${agree4 ? 'text-primary-400-normal' : 'text-primary-200-light'}`}
						/>
						<div className='title-3 text-neutral-500'>
							(선택) <span>마케팅 정보 이메일 수신</span> 동의
						</div>
					</label>
				</div>

				<Button onClick={handleSubmit(onSubmit)} disabled={isSubmitDisabled} fullWidth className='h-14'>
					{isSubmitting ? (isSocial ? '처리 중...' : '가입 중...') : isSocial ? '동의하고 계속하기' : '가입하기'}
				</Button>
			</div>
		</div>
	)
}

export default AgreeStep
