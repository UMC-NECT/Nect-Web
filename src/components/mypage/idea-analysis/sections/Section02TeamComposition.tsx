import type { AnalysisType } from '@/types/api/mypage'
import RoleTagChip from '@/components/mission-modal/RoleTagChip'

interface Section02TeamCompositionProps {
	analysisData: AnalysisType
}

const Section02TeamComposition = ({ analysisData }: Section02TeamCompositionProps) => {
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
							최소 {analysisData.team_composition.length}파트, 총{' '}
							{analysisData.team_composition.reduce((sum, field) => sum + field.required_count, 0)}명의 팀원이
							필요해요!
						</span>

						{/* 태그 모음 */}
						<div className='flex items-center gap-3'>
							{analysisData.team_composition.map((field, index) => (
								<RoleTagChip
									key={index}
									roleId={index + 1}
									roleName={field.role_field_display_name}
									roleField={field.role_field}
									state='default'
									count={field.required_count}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Section02TeamComposition
