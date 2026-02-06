import logo from '@/assets/icons/common/nect-logo.svg'
import { useNavigate } from 'react-router'
import { useState, useMemo, useEffect } from 'react'
import CheckItem from '@/components/analyze-report/CheckItem'
import { weeklyRoadmapData, checkPointsData } from '@/constants/analyzeReportData'
import { getAnalysis, postCreateProject } from '@/api/analysis'
import type { ResponseGetAnalysisDto } from '@/types/api/analysis'
import RoleTagChip from '@/components/mission-modal/RoleTagChip'
import NumberedSection from '@/components/common/NumberedSection'
import Button from '@/components/common/Button'
import WeeklyRoadmapSection from '@/components/common/WeeklyRoadmapSection'

const AnalyzeReportPage = () => {
	const navigate = useNavigate()
	const [reportBody, setReportBody] = useState<ResponseGetAnalysisDto['body'] | null>(null)

	useEffect(() => {
		let cancelled = false
		getAnalysis('0')
			.then(res => {
				if (!cancelled && res.body) setReportBody(res.body)
			})
			.catch(() => {})
		return () => {
			cancelled = true
		}
	}, [])

	const analysis = reportBody?.analysis

	const projectNameForTitle = analysis?.recommended_project_names?.[0] ?? '커넥트'
	const projectNamesList = analysis?.recommended_project_names?.length
		? analysis.recommended_project_names.join(', ')
		: '넥트(Nect), 커넥트, 넥트장'
	const teamTotal = analysis?.team_composition?.reduce((sum, r) => sum + r.required_count, 0)
	const teamCount = analysis?.team_composition?.length
	const teamSummary =
		teamTotal != null && teamCount != null
			? `최소 ${teamCount}파트, 총 ${teamTotal}명의 팀원이 필요해요!`
			: '최소 4파트, 총 6명의 팀원이 필요해요!'
	const teamTags = analysis?.team_composition?.length
		? analysis.team_composition.map(r => ({
				label: r.role_task_display_name,
				roleId: r.role_task_id,
				count: r.required_count,
			}))
		: [
				{ label: 'PM', roleId: 1, count: 1 },
				{ label: 'Design', roleId: 2, count: 1 },
				{ label: 'Frontend', roleId: 3, count: 2 },
				{ label: 'Backend', roleId: 4, count: 2 },
			]
	const improvementPoints = useMemo(() => {
		if (analysis?.improvement_points?.length) {
			return [...analysis.improvement_points]
				.sort((a, b) => a.order - b.order)
				.map((p, i) => ({ checkNumber: i + 1, title: p.title, description: p.description }))
		}
		return checkPointsData.map((p, i) => ({ checkNumber: i + 1, title: p.title, description: p.description }))
	}, [analysis])
	const roadmapItems = useMemo(() => {
		const raw = analysis?.weekly_roadmap
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
			week: `${item.week_number}`,
			title: item.week_title,
			role_tasks: item.role_tasks ?? [],
		}))
	}, [analysis])

	const handleCreateProject = async () => {
		const analysisId = analysis?.analysis_id
		if (analysisId == null) return
		try {
			await postCreateProject(String(analysisId))
			navigate('/')
		} catch (err) {
			console.error(err)
			alert('프로젝트 생성에 실패했습니다.')
		}
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
					<p className='heading-2 font-bold text-neutral-900 text-center'>시루님의 프로젝트 [{projectNameForTitle}]</p>
					<p className='title-2 font-medium text-neutral-900 text-center'>
						아이디어 분석과 팀원 매칭부터 협업 보드까지, 사이드 프로젝트 웹사이트 개발 아이디어를 가지고 계시군요 !
					</p>
				</div>

				<div className='flex flex-col gap-[88px] mt-[52px] w-[940px] mx-auto pr-[26px]'>
					{/* 01 프로젝트 기본 정보를 추천드려요 */}
					<NumberedSection number='01' title='프로젝트 기본 정보를 추천드려요!'>
						<h3 className='font-semibold text-[18px] mb-3'>추천 프로젝트 이름</h3>
						<div className='flex flex-col gap-2 bg-white rounded-xl py-5 px-5.5 mb-6'>
							<span className='title-3 font-semibold text-primary-600-normal'>{projectNamesList}</span>
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
							<h3 className='font-semibold text-[18px] mb-4'>{teamSummary}</h3>
							<div className='flex flex-wrap gap-2'>
								{teamTags.map(tag => (
									<RoleTagChip
										key={tag.roleId}
										roleId={tag.roleId}
										roleName={tag.label}
										state='default'
										count={tag.count}
									/>
								))}
							</div>
						</div>
					</NumberedSection>

					{/* 03 프로젝트 보완할 점을 발견했어요! */}
					<NumberedSection number='03' title='프로젝트 보완할 점을 발견했어요!'>
						<div className='space-y-3.5'>
							{improvementPoints.map((point, index) => (
								<CheckItem
									key={index}
									checkNumber={point.checkNumber}
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
							<Button
								color='secondary'
								size='xl'
								onClick={() => navigate('/idea-analyze')}
								fullWidth={true}
							>
								아이디어 다시 입력하기
							</Button>
							<Button
								color='primary'
								size='xl'
								onClick={handleCreateProject}
								fullWidth={true}
							>
								프로젝트 생성하기
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* 홈으로 이동 */}
			<div className='flex justify-center mb-80'>
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