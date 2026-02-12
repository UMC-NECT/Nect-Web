import Button from '@/components/common/Button'
import { MyPageHeader } from '../MyPageHeader'
import { useNavigate } from 'react-router'
import NecttyIcon from '@/assets/nectty.png'

const EmptyIdeaAnalysis = () => {
	const navigate = useNavigate()

	return (
		<div className='flex flex-col min-w-229 w-full'>
			{/* 브레드크럼 + 타이틀 */}
			<MyPageHeader />

			{/* 컨텐츠 컨테이너 */}
			<div className='w-full flex items-center justify-center bg-bg-gray border border-neutral-200 rounded-12 px-11.5 py-14'>
				<div className='flex flex-col items-center w-full'>
					{/* 설명글 */}
					<div className='flex flex-col items-center gap-5 w-full'>
						<span className='title-3 font-semibold text-primary-600-normal text-center'>NECT Analysis Report</span>
						<div className='flex flex-col items-center gap-3 w-full'>
							<span className='heading-3 font-bold text-neutral-900 text-center'>
								분석된 아이디어 리포트가 없습니다.
							</span>
							<p className='title-3 text-neutral-600 text-center'>
								프로젝트 아이디어를 등록하면 AI 분석을 제공해드릴게요!
							</p>
						</div>
					</div>

					{/* 썸네일 이미지 */}
					<img src={NecttyIcon} className='w-58.25 h-58.25 px-[22.25px] py-[37.5px] mt-4 mb-12' />

					{/* AI 아이디어 분석하기 버튼 */}
					<Button
						className='font-medium bg-primary-400-normal text-neutral-50 px-10 py-4 w-[320px] hover:bg-primary-500-normal'
						onClick={() => navigate('/idea-analyze')}
					>
						AI 아이디어 분석 받기
					</Button>
				</div>
			</div>
		</div>
	)
}

export default EmptyIdeaAnalysis
