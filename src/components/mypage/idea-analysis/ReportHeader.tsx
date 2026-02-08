import type { AnalysisType } from '@/types/api/mypage'

interface ReportHeaderProps {
	analysisData: AnalysisType
	userName?: string
}

const ReportHeader = ({ analysisData, userName }: ReportHeaderProps) => {
	return (
		<div className='flex flex-col items-center justify-center gap-4.5 w-full'>
			<span className='title-3 font-semibold text-primary-600-normal text-center'>NECT Analysis Report</span>
			<div className='flex flex-col gap-3 w-full'>
				<span className='heading-2 font-bold text-neutral-900 text-center w-full'>
					{userName}님의 프로젝트 [{analysisData.recommended_project_names[0]}]
				</span>
				<p className='body-1 font-medium text-neutral-900 text-center w-full whitespace-pre-line'>
					{analysisData.description}
				</p>
			</div>
		</div>
	)
}

export default ReportHeader
