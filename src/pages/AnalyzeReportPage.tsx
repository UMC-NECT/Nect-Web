import logo from '@/assets/icons/common/nect-logo.svg'
import { useNavigate } from 'react-router'
import { useMemo } from 'react'
import CheckItem from '@/components/analyze-report/CheckItem'
import { weeklyRoadmapData } from '@/constants/analyzeReportData'
import RoleTagChip from '@/components/mission-modal/RoleTagChip'
import NumberedSection from '@/components/common/NumberedSection'
import Button from '@/components/common/Button'
import WeeklyRoadmapSection from '@/components/common/WeeklyRoadmapSection'
import { useGetProfileQuery } from '@/hooks/auth/useUsersApi'
import { useGetAnalysisQuery, usePostCreateProjectMutation } from '@/hooks/analysis/useAnalysisApi'

const AnalyzeReportPage = () => {
	const navigate = useNavigate()
	const { data: profileData } = useGetProfileQuery()
	const { data: analysisData, isLoading: isAnalysisLoading } = useGetAnalysisQuery('0')
    const createProject = usePostCreateProjectMutation()

	const analysis = analysisData?.body?.analysis

	const roadmapItems = useMemo(() => {
		const raw = analysis?.weekly_roadmaps ?? analysis?.weekly_roadmap
		if (!raw) {
			return weeklyRoadmapData.map(item => ({
				week: item.week,
				title: item.title,
				role_tasks: item.details.map((tasks, i) => ({
					role_field: `fallback_${i}`,
					role_field_display_name: '업무',
					tasks,
				})),
			}))
		}
		const list = Array.isArray(raw) ? raw : [raw]
		return list.map(item => ({
			week: String(item.week_number),
			title: item.week_title ?? '',
			role_tasks: item.role_tasks ?? [],
		}))
	}, [analysis])

	if (isAnalysisLoading) {
		return <div></div>
	}
	if (!analysis) {
		return null
	}

	const handleCreateProject = () => {
		const analysisId = analysis?.analysis_id
		if (analysisId == null) return
		createProject.mutate(String(analysisId))
	}

	return (
		<div className='flex flex-col justify-center pt-32'>
			<div className='flex flex-col items-center px-4 mb-4'>
				<img src={logo} alt='NECT Logo' className='w-[226px] h-[40px] mb-[26px]' />
				<h1 className='heading-1 font-bold text-primary-800-dark text-center'>프로젝트 아이디어 분석 리포트</h1>
			</div>

			<div className='bg-bg-gray w-full rounded-100 mt-16 pt-20 pb-24 px-12 shadow-inner-neutral-1'>
				<h2 className='title-3 font-semibold text-center text-primary-600-normal mb-4.5'>NECT Analyze Report</h2>
				<div className='flex flex-col gap-3 mb-28'>
					<p className='heading-2 font-bold text-neutral-900 text-center'>
						{profileData?.body?.name}님의 프로젝트 [{analysis?.recommended_project_names?.[0]}]
					</p>
					<p className='title-2 font-medium text-neutral-900 text-center'>
						아이디어 분석과 팀원 매칭부터 협업 보드까지, 사이드 프로젝트 웹사이트 개발 아이디어를 가지고 계시군요 !
					</p>
				</div>

				<div className='flex flex-col gap-[88px] mt-[52px] w-[940px] mx-auto pr-[26px]'>
					{/* 01 프로젝트 기본 정보를 추천드려요 */}
					<NumberedSection number='01' title='프로젝트 기본 정보를 추천드려요!'>
						<h3 className='font-semibold text-[18px] mb-3'>추천 프로젝트 이름</h3>
						<div className='flex flex-col gap-2 bg-white rounded-xl py-5 px-5.5 mb-6'>
							<span className='title-3 font-semibold text-primary-600-normal'>
								{analysis?.recommended_project_names?.join(', ')}
							</span>
						</div>

						<h3 className='font-semibold text-[18px] mb-3'>예상 기간</h3>
						<p className='title-3 font-semibold text-neutral-800 bg-white rounded-xl py-5 px-5.5'>
							프로젝트의 완성을 위해{' '}
							<span className='text-primary-600-normal'>최소 {analysis?.project_duration.total_weeks}주</span>의
							기간이 필요해요.
						</p>
					</NumberedSection>

					{/* 02 원활한 진행을 위한 팀 구성은? */}
					<NumberedSection number='02' title='원활한 진행을 위한 팀 구성은?'>
						<div className='bg-white rounded-xl py-5 px-5.5'>
							<h3 className='font-semibold text-[18px] mb-4'>
								최소 {analysis?.team_composition?.length}파트, 총{' '}
								{analysis?.team_composition?.reduce((sum, r) => sum + r.required_count, 0)}명의 팀원이 필요해요!
							</h3>
							<div className='flex flex-wrap gap-2'>
								{analysis?.team_composition?.map((r, index) => (
									<RoleTagChip
										key={index}
										roleId={index + 1}
										roleName={r.role_field_display_name}
										state='default'
										count={r.required_count}
									/>
								))}
							</div>
						</div>
					</NumberedSection>

					{/* 03 프로젝트 보완할 점을 발견했어요! */}
					<NumberedSection number='03' title='프로젝트 보완할 점을 발견했어요!'>
						<div className='space-y-3.5'>
							{analysis?.improvement_points?.map((point, index) => (
								<CheckItem
									key={index}
									checkNumber={index + 1}
									title={point.title}
									description={point.description}
								/>
							))}
						</div>
					</NumberedSection>

					{/* 04 주차별 로드맵 */}
					<NumberedSection number='04' title='주차별 로드맵을 생성했어요!'>
						<WeeklyRoadmapSection roadmapItems={roadmapItems} />
					</NumberedSection>

					{/* 버튼들 */}
					<div className='flex flex-col items-center justify-center w-[660px] gap-4 mt-16 mb-8 mx-auto'>
						<div className='flex gap-4 w-full'>
							<Button color='secondary' size='xl' onClick={() => navigate('/idea-analyze')} fullWidth={true}>
								아이디어 다시 입력하기
							</Button>
							<Button color='primary' size='xl' onClick={handleCreateProject} fullWidth={true}>
								프로젝트 생성하기
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* 홈으로 이동 */}
			<div className='flex justify-center'>
				<button
					onClick={() => navigate('/')}
					className='title-3 font-semibold text-neutral-500 underline underline-offset-4 m-[44px] cursor-pointer hover:text-neutral-700'
				>
					홈으로 이동
				</button>
			</div>
		</div>
	)
}

export default AnalyzeReportPage;