import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useSignup } from '@/stores/useSignup'

const NameStep = () => {
	const { setCurrentStep } = useSignup()

	const handleSignupComplete = () => {
		//setIsSignup(true)
		setCurrentStep('form2')
	}

	return (
		<div className='flex flex-col items-center justify-between h-full mt-42'>
			<div className='w-105'>
				<h2 className='heading-2 font-bold text-neutral-900 mb-9 text-center'>이메일로 가입</h2>

				<div className='flex flex-col gap-4 mb-26.5'>
					{/* 이름 */}
					<div className='flex flex-col items-start gap-2'>
						<div className='title-3 text-neutral-900'>이름</div>
						<Input
							category='auth'
							placeholder='이름을 입력해주세요'
							className='placeholder:text-neutral-300 placeholder:title-2'
						/>
					</div>

					{/* 전화번호 */}
					<div className='flex flex-col items-start gap-2'>
						<div className='title-3 text-neutral-900'>전화번호</div>
						<div className='flex gap-1.5 w-full'>
							<Input
								category='auth'
								placeholder='번호만 입력해주세요'
								className='placeholder:text-neutral-300 placeholder:title-2 flex-1'
							/>

							<Button color='auth' className='w-40 h-14 title-2 px-5.5 py-3.5' disabled>
								인증 요청
							</Button>
						</div>
					</div>

					{/* 인증번호 */}
					<div className='flex flex-col items-start gap-2'>
						<div className='title-3 text-neutral-900'>인증번호</div>
						<Input category='auth' placeholder='6자리' className='placeholder:text-neutral-300 placeholder:title-2' />
					</div>
				</div>
				<Button color='auth' onClick={handleSignupComplete} className='h-14' fullWidth>
					다음
				</Button>
			</div>
		</div>
	)
}

export default NameStep
