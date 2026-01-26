import type { IdeaAnalysisData } from '@/types/mypage/ideaAnalysis'

interface ReportHeaderProps {
	analysisData: IdeaAnalysisData
}

const ReportHeader = ({ analysisData }: ReportHeaderProps) => {
	return (
		<div className='flex flex-col items-center justify-center gap-4.5 w-full'>
			<span className='title-3 font-semibold text-primary-600-normal text-center'>NECT Analysis Report</span>
			<div className='flex flex-col gap-3 w-full'>
				<span className='heading-2 font-bold text-neutral-900 text-center w-full'>
					{analysisData.idea.user_name}님의 프로젝트 [{analysisData.idea_analysis_result.project_name}]
				</span>
				<p className='body-1 font-medium text-neutral-900 text-center w-full whitespace-pre-line'>
					{analysisData.idea.one_line_description}
				</p>
			</div>
		</div>
	)
}

export default ReportHeader
