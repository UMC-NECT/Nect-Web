import { useEffect, useRef, useState } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useSignup } from '@/stores/useSignup'
import { useSignupForm1 } from '@/hooks/useForm'
import type { SignupForm1Type } from '@/utils/validate'
import FormField from '@/components/auth/common/FormField'
import FieldMessage from '@/components/auth/common/FieldMessage'

const NameStep = () => {
	// 전역 상태
	const { setCurrentStep } = useSignup()
	// 지역 상태
	const [isCertificated, setIsCertificated] = useState<boolean>(false) // 인증 요청 유무
	const [certNumber, setCertNumber] = useState<string>('') // 임시 인증번호
	const [isCorrect, setIsCorrect] = useState<boolean>(false) // 인증번호 일치 여부
	const [timer, setTimer] = useState<number>(180) // 타이머
	const isTimerExpired = timer === 0 && isCertificated // 타이머 만료 여부

	// 유효성 검사 관련
	const { register, watch, handleSubmit, errors, setValue, setError } = useSignupForm1()
	const name = watch('name')
	const phone = watch('phone')
	const certificationNumber = watch('certificationNumber')

	// 포커싱용 ref
	const nameInputRef = useRef<HTMLInputElement>(null) // 이름 필드
	const certInputRef = useRef<HTMLInputElement>(null) // 인증번호 필드

	// ref 분리 (이름 필드 포커싱과 useForm 사용시 ref가 겹침)
	const { ref: nameHookRef, ...nameRestRef } = register('name')
	const { ref: certificateHookRef, ...certificateRestRef } = register('certificationNumber', {
		onChange: e => {
			const output = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
			e.target.value = output

			// 6자리 입력 시 인증번호 검증
			if (output.length === 6) {
				if (output === certNumber) {
					setIsCorrect(true)
				} else {
					setIsCorrect(false)
				}
			} else {
				// 6자리 미만일 때는 에러 상태 초기화
				setIsCorrect(false)
			}
		},
	})

	// 다음으로 버튼 활성/비활성
	const isNextAvailable =
		!name ||
		!phone ||
		!certificationNumber ||
		!!errors.name ||
		!!errors.phone ||
		!!errors.certificationNumber ||
		!isCertificated ||
		!isCorrect ||
		isTimerExpired

	// 초기 렌더링 시, 이름에 자동 포커싱
	useEffect(() => {
		nameInputRef.current?.focus()
	}, [])

	// 타이머 카운트다운
	useEffect(() => {
		if (isCertificated && timer > 0 && !isCorrect) {
			const countdown = setInterval(() => {
				setTimer(prev => prev - 1)
			}, 1000)

			return () => clearInterval(countdown)
		}
	}, [isCertificated, timer, isCorrect])

	// 타이머를 mm:ss 형식으로 변환
	const formatTimer = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${minutes}:${secs.toString().padStart(2, '0')}`
	}

	// 전화번호 인증요청시
	const handleCertificatePhone = () => {
		// 추후 api로 변경
		const certNumber = '112233'
		setCertNumber(certNumber)
		alert(`인증 요청 버튼 클릭함.\n 전번: ${phone} | 인증번호: ${certNumber}`)
		setIsCertificated(true)

		// 타이머 리셋
		setTimer(180)
		setIsCorrect(false)
		setValue('certificationNumber', '')

		// 인증 번호 입력 필드로 포커싱
		setTimeout(() => {
			certInputRef.current?.focus()
		}, 0)
	}

	// 전체 폼 제출시
	const onSubmit = (data: SignupForm1Type) => {
		console.log('폼 데이터:', data)

		// 추후 api로 대체
		if (certificationNumber === certNumber) {
			setCurrentStep('form2')
		} else {
			setError('certificationNumber', {
				type: 'manual',
			})
		}
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
						messageArea={
							errors.phone && !isTimerExpired && <FieldMessage type='error' message={errors.phone.message || ''} />
						}
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

										// 폼 값 업데이트
										setValue('phone', formatted)
									},
								})}
							/>

							<Button
								color='auth'
								className='w-40 h-14 title-2 px-5.5 py-3.5'
								disabled={!name || !phone || !!errors.phone}
								onClick={handleCertificatePhone}
							>
								{isCertificated ? '다시 요청' : '인증 요청'}
							</Button>
						</div>
					</FormField>

					{/* 인증번호 */}
					<FormField
						label='인증번호'
						messageArea={
							<div className='w-full flex items-center mt-1.5'>
								{/* 성공 */}
								{isCorrect && <FieldMessage type='success' message='인증이 완료되었습니다.' />}

								{/* 인증시간 만료 or 인증번호 일치 x */}
								{certificationNumber?.length === 6 && !isCorrect && (
									<FieldMessage
										type='error'
										message={isTimerExpired ? '인증 시간 만료' : '인증번호가 일치하지 않습니다.'}
									/>
								)}

								<span className='ml-auto body-2 text-neutral-400 underline cursor-pointer'>
									인증 번호가 안오시나요?
								</span>
							</div>
						}
					>
						<div className='relative w-full'>
							<Input
								category='auth'
								placeholder='6자리'
								maxLength={6}
								className='placeholder:text-neutral-300 placeholder:title-2'
								disabled={!isCertificated || isTimerExpired}
								{...certificateRestRef}
								ref={e => {
									certificateHookRef(e)
									certInputRef.current = e // 포커스용 ref 연결
								}}
							/>
							{/* 타이머 표시 */}
							{isCertificated && (
								<div
									className={`absolute right-4 top-1/2 -translate-y-1/2 title-2 ${isTimerExpired ? 'text-danger-700' : 'text-primary-500-normal'}`}
								>
									{formatTimer(timer)}
								</div>
							)}
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
