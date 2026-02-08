import type { AnalysisType } from '@/types/api/mypage'
import DoubleCheckIcon from '@/assets/icons/mypage/double-check.svg?react'

interface Section03ImprovementsProps {
	analysisData: AnalysisType
}

const Section03Improvements = ({ analysisData }: Section03ImprovementsProps) => {
	return (
		<div className='flex flex-col gap-4.5 w-full'>
			{/* 타이틀 */}
			<div className='flex items-center gap-3 w-full'>
				<span className='heading-3 font-bold text-neutral-900 text-center w-9.5'>03</span>
				<span className='title-2 font-bold text-primary-600-normal h-7.5 w-full'>프로젝트 보완할 점을 발견했어요!</span>
			</div>

			{/* 내용 */}
			<div className='flex flex-col gap-3.5 pl-12.5 w-full'>
				{analysisData.improvement_points.map(improvement => (
					<div
						key={improvement.order}
						className='flex items-center bg-neutral-000 rounded-12 px-5.5 py-5 gap-7.5 w-full'
					>
						{/* 좌측 - 아이콘 */}
						<div className='flex flex-col items-center gap-1'>
							<span className='body-2 font-bold text-primary-600-normal text-center'>
								Check {improvement.order}
							</span>
							<DoubleCheckIcon />
						</div>

						{/* 우측 - 컨텐츠 */}
						<div className='flex flex-col gap-3 flex-1'>
							<span className='title-3 font-bold text-neutral-900'>{improvement.title}</span>
							<p className='body-1 font-medium text-[#191919] tracking-[-0.08px] whitespace-pre-line'>
								{improvement.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Section03Improvements
