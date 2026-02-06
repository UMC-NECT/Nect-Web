import Button from '@/components/common/Button'
import { MyPageHeader } from '../MyPageHeader'

interface IEmptyProfileAnalysis {
	setHasReport: () => void
}

const EmptyProfileAnalysis = ({ setHasReport }: IEmptyProfileAnalysis) => {
	const handleAnalysis = () => {
		alert(`프로필 분석했다고 치고 넘어감`)
		// 임시로 버튼 누르면 아이디어 분석 됐다고 가정
		setHasReport()
	}
	return (
		<div className='flex flex-col min-w-229 w-full'>
			{/* 브레드크럼 + 타이틀 */}
			<MyPageHeader />

			{/* 컨텐츠 컨테이너 */}
			<div className='w-full flex items-center justify-center bg-bg-gray border border-neutral-200 rounded-12 px-11.5 py-14'>
				<div className='flex flex-col items-center gap-8 w-full'>
					{/* 설명글 */}
					<div className='flex flex-col items-center gap-5 w-full'>
						<span className='title-3 font-semibold text-primary-600-normal text-center'>NECT Analysis Report</span>
						<div className='flex flex-col items-center gap-3 w-full'>
							<span className='heading-3 font-bold text-neutral-900 text-center'>
								분석된 프로필 리포트가 없습니다.
							</span>
							<p className='title-3 text-neutral-600 text-center'>
								내 프로필을 등록하고 성장을 위한 AI 분석을 받아보세요!
							</p>
						</div>
					</div>

					{/* 썸네일 이미지 */}
					<div className='w-65 h-65 bg-[#D9D9D9]' />

					{/* AI 프로필 분석받기 버튼 */}
					<Button
						className='font-medium bg-primary-400-normal text-neutral-50 px-10 py-4 w-[320px] hover:bg-primary-500-normal'
						onClick={handleAnalysis}
					>
						AI 프로필 분석 받기
					</Button>
				</div>
			</div>
		</div>
	)
}

export default EmptyProfileAnalysis
