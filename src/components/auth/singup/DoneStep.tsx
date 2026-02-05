import TeamIcon from '@/assets/icons/auth/team.svg?react'
import Button from '@/components/common/Button'
import { useNavigate } from 'react-router'
import { useSignup } from '@/stores/useSignup'

const DoneStep = () => {
	const { signupData, resetSignupData } = useSignup()
	const navigate = useNavigate()

	const handleSubmit = () => {
		resetSignupData()
		navigate('/login')
	}

	return (
		<div className='flex flex-col justify-center items-center mt-43.25'>
			<div className='flex flex-col justify-center items-center'>
				{/* 타이틀 */}
				<div className='flex flex-col justify-center items-center gap-3.5 mb-10.5'>
					<h1 className='heading-1 text-neutral-800 font-bold'>{signupData.name}님 가입이 완료됐어요!</h1>
					<div className='text-[24px] font-semibold text-primary-500-normal tracking-[-2px]'>
						팀 매칭부터 협업까지 넥트에서 다 가능해요
					</div>
				</div>

				{/* 리더 / 팀원 선택 */}
				<div className='flex gap-7.5 mb-17'>
					{/* 리더 */}
					<div className='flex flex-col justify-center items-center gap-4'>
						<TeamIcon className='w-42 h-42 p-2.25 bg-[#D9D9D9] mb-3' />
						<p className='text-[24px] font-semibold text-neutral-900'>리더</p>
						<div className='flex flex-col justify-center items-center'>
							<div>AI와 함께 프로젝트 아이디어를 분석하고,</div>
							<div>함께할 팀원을 추천받아요</div>
						</div>
					</div>

					{/* 팀원 */}
					<div>
						<div className='flex flex-col justify-center items-center gap-4'>
							<TeamIcon className='w-42 h-42 p-2.25 bg-[#D9D9D9] mb-3' />
							<p className='text-[24px] font-semibold text-neutral-900'>팀원</p>
							<div className='flex flex-col justify-center items-center text-neutral-900'>
								<div>관심사 성향 등 AI 분석을 통해</div>
								<div>함께할 팀원을 추천받아요</div>
							</div>
						</div>
					</div>
				</div>

				{/* 로그인 페이지로 버튼 */}
				<Button onClick={handleSubmit} fullWidth className='w-95 h-14'>
					로그인 페이지로
				</Button>
			</div>
		</div>
	)
}

export default DoneStep
