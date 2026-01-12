import ChipButton from '@/components/common/ChipButton'

const goals = ['포트폴리오 제작', '프로젝트 경험 및 팀 협업 능력 향상', '다른 분야의 프로젝트 경험', '기타']

const Step5 = () => {
	return (
		<>
			{/* 타이틀 */}
			<div className='flex flex-col justify-center items-center gap-3.25'>
				<div className='heading-3 text-neutral-900'>
					넥트를 통해 이루고 싶은 <span className='text-primary-500-normal'>첫번째 목표</span>를 알려주세요 !
				</div>
				<div className='title-2 text-neutral-500'>넥트가 함께 도와드릴게요</div>
			</div>

			{/* 컨텐츠 */}
			<div className='flex flex-col justify-center items-center w-[392px] gap-3'>
				{goals.map(goal => (
					<>
						<ChipButton key={goal} text={goal} className='title-3' />
					</>
				))}
			</div>
		</>
	)
}

export default Step5
