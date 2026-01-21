import Button from '@/components/common/Button'
import CheckIcon from '@/assets/icons/auth/check-icon.svg?react'
import CheckboxIcon from '@/assets/icons/auth/checkbox.svg?react'
import { useState } from 'react'
import { useSignup } from '@/stores/useSignup'

const AgreeStep = () => {
	const textEmail = 'Next2u@naver.com'
	const [allAgree, setAllAgree] = useState<boolean>(true)
	const { setCurrentStep } = useSignup()

	const handleSubmit = () => {
		setCurrentStep('done')
	}

	return (
		<div className='flex flex-col items-center justify-start mt-50.5'>
			<div className='w-105 h-124'>
				{/* 타이틀 */}
				<div className='flex flex-col justify-center items-center'>
					<div className='heading-2 text-neutral-900 font-bold mb-11'>계정 확인 및 약관 동의</div>
					<div className='title-2 text-neutral-900 px-30 py-4.5 bg-primary-100-light rounded-12 mb-8.5'>
						{textEmail}
					</div>
				</div>

				{/* 모두 동의합니다. */}
				<label className='w-fit flex justify-center items-center cursor-pointer'>
					<input type='checkbox' className='peer hidden' />
					<CheckboxIcon
						className={`mr-3.5 
						${allAgree ? 'text-primary-150-light' : 'text-primary-500-normal'}`}
					/>
					<div className='title-2 text-neutral-900'>모두 동의합니다.</div>
				</label>

				{/* 구분선 */}
				<div className='w-105 h-px bg-neutral-200 my-4'></div>

				{/* 동의 항목 4개 */}
				<div className='flex flex-col items-start gap-3 mb-13.5'>
					<label className='flex justify-center items-center gap-2'>
						<CheckIcon className='w-3.5 h-2.5 mx-1.75 my-2.25 text-primary-200-light cursor-pointer' />
						<div className='title-3 text-neutral-500'>만 14세 이상 입니다</div>
					</label>

					<label className='flex justify-center items-center gap-2'>
						<CheckIcon className='w-3.5 h-2.5 mx-1.75 my-2.25 text-primary-200-light cursor-pointer' />
						<div className='title-3 text-neutral-500'>
							(필수) <span>서비스 이용약관</span> 동의
						</div>
					</label>

					<label className='flex justify-center items-center gap-2'>
						<CheckIcon className='w-3.5 h-2.5 mx-1.75 my-2.25 text-primary-200-light cursor-pointer' />
						<div className='title-3 text-neutral-500'>
							(필수) <span>개인정보 수집 이용</span> 동의
						</div>
					</label>

					<label className='flex justify-center items-center gap-2'>
						<CheckIcon className='w-3.5 h-2.5 mx-1.75 my-2.25 text-primary-200-light cursor-pointer' />
						<div className='title-3 text-neutral-500'>
							(선택) <span>마케팅 정보 이메일 수신</span> 동의
						</div>
					</label>
				</div>

				<Button onClick={handleSubmit} fullWidth className='h-14'>
					가입하기
				</Button>
			</div>
		</div>
	)
}

export default AgreeStep
