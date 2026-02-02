import type { IdeaAnalysisData } from '@/types/mypage/ideaAnalysis'

interface Section01BasicInfoProps {
	analysisData: IdeaAnalysisData
}

const Section01BasicInfo = ({ analysisData }: Section01BasicInfoProps) => {
	return (
		<div className='flex flex-col gap-4.5 w-full'>
			{/* 타이틀 */}
			<div className='flex items-center gap-3 w-full'>
				<span className='heading-3 font-bold text-neutral-900 text-center w-'>01</span>
				<span className='title-2 font-bold text-primary-600-normal h-7.5 w-full'>프로젝트 기본 정보를 추천드려요!</span>
			</div>

			<div className='flex flex-col gap-6 pl-12.5 w-full'>
				{/* 추천 프로젝트 이름 */}
				<div className='flex flex-col gap-3 w-full'>
					<div className='flex items-center gap-2 h-6.5 px-2.5'>
						<span className='title-3 font-semibold text-neutral-900'>추천 프로젝트 이름</span>
					</div>
					<div className='flex flex-col justify-center bg-neutral-000 rounded-12 px-5.5 py-5 gap-2.5 w-full'>
						<div className='flex flex-col gap-3 w-full'>
							<span className='title-3 font-bold text-primary-600-normal'>
								{analysisData.idea_analysis_result.recommended_names.join(', ')}
							</span>
							<span className='body-1 font-medium text-neutral-900'>
								연결되는 이미지를 강화하는 것이 좋습니다 !
							</span>
						</div>
					</div>
				</div>

				{/* 예상 기간 */}
				<div className='flex flex-col gap-3 w-full'>
					<div className='flex items-center gap-2 h-6.5 px-2.5'>
						<span className='title-3 font-semibold text-neutral-900'>예상 기간</span>
					</div>
					<div className='flex flex-col justify-center bg-neutral-000 rounded-12 px-5.5 py-5 gap-2.5 w-full'>
						<div className='flex flex-col gap-3 w-full'>
							<span className='body-1 font-medium text-neutral-900 w-full'>
								프로젝트 [{analysisData.idea_analysis_result.project_name}]의 완성을 위해{' '}
								<span className='text-primary-600-normal font-semibold'>
									최소 {analysisData.idea_analysis_result.estimated_duration_weeks}
								</span>
								의 기간이 필요해요.
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Section01BasicInfo
