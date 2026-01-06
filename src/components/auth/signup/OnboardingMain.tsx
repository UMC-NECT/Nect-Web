import BackButton from '@/components/common/BackButton'
import ProgressBar from '@/components/common/ProgressBar'

const OnboardingMain = () => {
	return (
		<div className='relative min-h-screen w-screen flex pt-24.75 left-1/2 -translate-x-1/2'>
			{/* 뒤로가기 */}
			<div className='hidden md:block absolute left-18 top-[50%]'>
				<BackButton />
			</div>

			{/* 메인 영역 */}
			<div className='w-full flex flex-col items-center gap-18'>
				{/* 프로그레스바 */}
				<ProgressBar />

				{/* 컨텐츠 */}
			</div>
		</div>
	)
}

export default OnboardingMain
