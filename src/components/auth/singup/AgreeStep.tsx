import Button from '@/components/common/Button'
import CheckIcon from '@/assets/icons/auth/check-icon.svg?react'
import CheckboxIcon from '@/assets/icons/auth/checkbox.svg?react'
import { useSignup } from '@/stores/useSignup'
import { useSignupStep } from '@/contexts/SignupStepContext'
import { useAgreeForm } from '@/hooks/useForm'
import { useState } from 'react'
import { useSignupMutation, useAgreeMutation } from '@/hooks/auth/useUsersApi'

const AgreeStep = () => {
	const { signupData } = useSignup()
	const { setCurrentStep } = useSignupStep()
	const [errorMessage, setErrorMessage] = useState('')
	const signupMutation = useSignupMutation()
	const agreeMutation = useAgreeMutation()
	const isSubmitting = signupMutation.isPending || agreeMutation.isPending

	// 유효성 검사 관련
	const { register, watch, setValue, handleSubmit } = useAgreeForm()
	const agree1 = watch('agree1')
	const agree2 = watch('agree2')
	const agree3 = watch('agree3')
	const agree4 = watch('agree4')

	// 모두 동의 상태 계산
	const agreeAll = agree1 && agree2 && agree3 && agree4

	// 필수 약관 동의 여부 (agree1, agree2, agree3)
	const isRequiredAgree = agree1 && agree2 && agree3

	// 모두 동의 토글
	const handleAgreeAll = (e: React.MouseEvent) => {
		e.preventDefault() // 기본 동작 방지
		const newValue = !agreeAll
		setValue('agree1', newValue)
		setValue('agree2', newValue)
		setValue('agree3', newValue)
		setValue('agree4', newValue)
	}

	const onSubmit = async () => {
		setErrorMessage('')

		try {
			await signupMutation.mutateAsync({
				email: signupData.email,
				password: signupData.password,
				passwordConfirm: signupData.passwordConfirm,
				name: signupData.name,
				phoneNumber: signupData.phoneNumber,
			})
			await agreeMutation.mutateAsync({
				termsAgreed: agree2,
				privacyAgreed: agree3,
				marketingAgreed: agree4 ?? false,
			})
			setCurrentStep('done')
		} catch {
			setErrorMessage('회원가입에 실패했습니다. 다시 시도해주세요.')
		}
	}

	return (
		<div className='flex flex-col items-center justify-start mt-50.5'>
			<div className='w-105 h-124'>
				{/* 타이틀 */}
				<div className='flex flex-col justify-center items-center'>
					<div className='heading-2 text-neutral-900 font-bold mb-11'>계정 확인 및 약관 동의</div>
					<div className='title-2 text-neutral-900 px-30 py-4.5 bg-primary-100-light rounded-12 mb-8.5'>
						{signupData.email}
					</div>
					{errorMessage && <div className='title-2 text-danger-700 mb-4'>{errorMessage}</div>}
				</div>

				{/* 모두 동의합니다. */}
				<div className='w-fit flex justify-center items-center cursor-pointer' onClick={handleAgreeAll}>
					<CheckboxIcon
						className={`mr-3.5 text-primary-150-light ${agreeAll ? 'text-primary-500-normal' : 'text-primary-150-light'}`}
					/>
					<div className='title-2'>모두 동의합니다.</div>
				</div>
				{/* 구분선 */}
				<div className='w-105 h-px bg-neutral-200 my-4'></div>

				{/* 동의 항목 4개 */}
				<div className='flex flex-col items-start gap-3 mb-13.5'>
					{/* 만 14세 이상 입니다 */}
					<label className='flex justify-center items-center gap-2 cursor-pointer'>
						<input
							type='checkbox'
							className='peer hidden'
							{...register('agree1', {
								onChange: () => {
									setValue('agree1', !agree1)
								},
							})}
						/>
						<CheckIcon
							className={`w-3.5 h-2.5  mx-1.75 my-2.25 cursor-pointer  transition-colors ${agree1 ? 'text-primary-400-normal' : 'text-primary-200-light'}`}
						/>
						<div className='title-3 text-neutral-500'>만 14세 이상 입니다</div>
					</label>

					{/* (필수) 서비스 이용약관 동의 */}
					<label className='flex justify-center items-center gap-2 cursor-pointer'>
						<input type='checkbox' className='peer hidden' {...register('agree2')} />
						<CheckIcon
							className={`w-3.5 h-2.5  mx-1.75 my-2.25 cursor-pointer  transition-colors ${agree2 ? 'text-primary-400-normal' : 'text-primary-200-light'}`}
						/>
						<div className='title-3 text-neutral-500'>
							(필수) <span>서비스 이용약관</span> 동의
						</div>
					</label>

					{/* (필수) 개인정보 수집 이용 동의 */}
					<label className='flex justify-center items-center gap-2 cursor-pointer'>
						<input type='checkbox' className='peer hidden' {...register('agree3')} />
						<CheckIcon
							className={`w-3.5 h-2.5  mx-1.75 my-2.25 cursor-pointer  transition-colors ${agree3 ? 'text-primary-400-normal' : 'text-primary-200-light'}`}
						/>
						<div className='title-3 text-neutral-500'>
							(필수) <span>개인정보 수집 이용</span> 동의
						</div>
					</label>

					{/* (선택) 마케팅 정보 이메일 수신 동의 */}
					<label className='flex justify-center items-center gap-2 cursor-pointer'>
						<input type='checkbox' className='peer hidden' {...register('agree4')} />
						<CheckIcon
							className={`w-3.5 h-2.5  mx-1.75 my-2.25 cursor-pointer  transition-colors ${agree4 ? 'text-primary-400-normal' : 'text-primary-200-light'}`}
						/>
						<div className='title-3 text-neutral-500'>
							(선택) <span>마케팅 정보 이메일 수신</span> 동의
						</div>
					</label>
				</div>

				{/* 가입하기 */}
				<Button onClick={handleSubmit(onSubmit)} disabled={!isRequiredAgree || isSubmitting} fullWidth className='h-14'>
					{isSubmitting ? '가입 중...' : '가입하기'}
				</Button>
			</div>
		</div>
	)
}

export default AgreeStep
