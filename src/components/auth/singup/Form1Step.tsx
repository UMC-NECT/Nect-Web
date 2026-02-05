import { useEffect, useRef, useState } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useSignup } from '@/stores/useSignup'
import { useSignupStep } from '@/contexts/SignupStepContext'
import { useSignupForm1 } from '@/hooks/useForm'
import FormField from '@/components/auth/common/FormField'
import FieldMessage from '@/components/auth/common/FieldMessage'
import { useCheckMutation } from '@/hooks/auth/useUsersApi'

const NameStep = () => {
	// 전역 상태
	const { setSignupData } = useSignup()
	const { setCurrentStep } = useSignupStep()
	// 지역 상태
	const [isCertificated, setIsCertificated] = useState<boolean>(false) // 전화번호 중복 확인 완료
	const checkMutation = useCheckMutation()

	// 유효성 검사 관련
	const { register, watch, handleSubmit, errors, setValue, setError, clearErrors } = useSignupForm1()
	const name = watch('name')
	const phone = watch('phone')

	// 포커싱용 ref
	const nameInputRef = useRef<HTMLInputElement>(null) // 이름 필드

	// ref 분리 (이름 필드 포커싱과 useForm 사용시 ref가 겹침)
	const { ref: nameHookRef, ...nameRestRef } = register('name')

	// 다음으로 버튼 활성/비활성
	const isNextAvailable = !name || !phone || !!errors.name || !!errors.phone || !isCertificated

	// 초기 렌더링 시, 이름에 자동 포커싱
	useEffect(() => {
		nameInputRef.current?.focus()
	}, [])

	// 전화번호 중복 확인
	const handleCertificatePhone = async () => {
		const phoneNumber = phone?.replace(/-/g, '') ?? ''
		if (!phoneNumber) return

		clearErrors('phone')

		try {
			const response = await checkMutation.mutateAsync({
				type: 'PHONE',
				value: phoneNumber,
			})

			if (response.body?.available === false) {
				setError('phone', { type: 'manual', message: '이미 사용 중인 전화번호입니다.' })
				return
			}

			setIsCertificated(true)
		} catch {
			setError('phone', { type: 'manual', message: '중복 확인에 실패했습니다. 다시 시도해주세요.' })
		}
	}

	// 전체 폼 제출시
	const onSubmit = () => {
		const phoneNumber = phone?.replace(/-/g, '') ?? ''
		setSignupData({ name: name ?? '', phoneNumber })
		setCurrentStep('form2')
	}

	return (
		<div className='flex flex-col items-center justify-between h-full mt-42'>
			<div className='w-105 h-42'>
				{/* 타이틀 */}
				<h2 className='heading-2 font-bold text-neutral-900 mb-9 text-center'>이메일로 가입</h2>

				{/* 폼 컨테이너 */}
				<div className='flex flex-col gap-4 mb-26.5'>
					{/* 이름 */}
					<FormField
						label='이름'
						messageArea={errors.name && <FieldMessage type='error' message={errors.name.message || ''} />}
					>
						<Input
							category='auth'
							placeholder='이름을 입력해주세요'
							className='placeholder:text-neutral-300 placeholder:title-2'
							{...nameRestRef}
							ref={e => {
								nameHookRef(e)
								nameInputRef.current = e // 포커스용 ref 연결
							}}
						/>
					</FormField>

					{/* 전화번호 */}
					<FormField
						label='전화번호'
						messageArea={errors.phone && <FieldMessage type='error' message={errors.phone.message || ''} />}
					>
						<div className='flex gap-1.5 w-full'>
							<Input
								category='auth'
								type='tel'
								placeholder='번호만 입력해주세요'
								className='placeholder:text-neutral-300 placeholder:title-2 flex-1'
								onKeyDown={e => {
									const allowedKeys = ['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'Enter']

									if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
										e.preventDefault()
									}
								}}
								{...register('phone', {
									onChange: e => {
										// 숫자만 추출
										const numbers = e.target.value.replace(/[^0-9]/g, '')

										// 010-1234-5678 형식으로 자동 포맷팅
										let formatted = numbers
										if (numbers.length > 3) {
											formatted = numbers.slice(0, 3) + '-' + numbers.slice(3)
										}
										if (numbers.length > 7) {
											formatted =
												numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11)
										}

										setValue('phone', formatted)
										setIsCertificated(false) // 전화번호 변경 시 중복 확인 초기화
									},
								})}
							/>

							<Button
								color='auth'
								className='w-40 h-14 title-2 px-5.5 py-3.5'
								disabled={!name || !phone || !!errors.phone || checkMutation.isPending || isCertificated}
								onClick={handleCertificatePhone}
							>
								중복 확인
							</Button>
						</div>
					</FormField>
				</div>

				<Button color='auth' onClick={handleSubmit(onSubmit)} className='h-14' fullWidth disabled={isNextAvailable}>
					다음
				</Button>
			</div>
		</div>
	)
}

export default NameStep
