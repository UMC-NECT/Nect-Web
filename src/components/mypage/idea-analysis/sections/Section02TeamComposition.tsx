import type { IdeaAnalysisData } from '@/types/mypage/ideaAnalysis'

interface Section02TeamCompositionProps {
	analysisData: IdeaAnalysisData
	getFieldColor: (fieldName: string) => string
}

const Section02TeamComposition = ({ analysisData, getFieldColor }: Section02TeamCompositionProps) => {
	return (
		<div className='flex flex-col gap-4.5 w-full'>
			{/* 타이틀 */}
			<div className='flex items-center gap-3 w-full'>
				<span className='heading-3 font-bold text-neutral-900 text-center w-9.5'>02</span>
				<span className='title-2 font-bold text-primary-600-normal h-7.5 w-full'>원활한 진행을 위한 팀 구성은?</span>
			</div>

			<div className='flex flex-col gap-2.5 pl-12.5 w-full'>
				<div className='flex flex-col justify-center bg-neutral-000 rounded-12 px-5.5 py-5 w-full'>
					<div className='flex flex-col gap-3.5 w-full'>
						{/* 최소 n명의 팀원이 필요해요! */}
						<span className='title-3 font-semibold text-neutral-900 h-6.5 tracking-[-0.09px] w-full'>
							최소 {analysisData.idea_analysis_result_fields.length}파트, 총{' '}
							{analysisData.idea_analysis_result_fields.reduce((sum, field) => sum + field.count, 0)}명의 팀원이
							필요해요!
						</span>

						{/* 태그 모음 */}
						<div className='flex items-center gap-3'>
							{analysisData.idea_analysis_result_fields.map(field => (
								<div
									key={field.idea_analysis_result_field_id}
									className='flex items-center justify-center gap-2.5 rounded-[6px] px-2 py-0.5 h-6 shadow-drop-neutral-3'
									style={{ backgroundColor: getFieldColor(field.field_name) }}
								>
									<span className='body-2 font-medium text-neutral-800'>
										{field.field_name} ({field.count})
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Section02TeamComposition
