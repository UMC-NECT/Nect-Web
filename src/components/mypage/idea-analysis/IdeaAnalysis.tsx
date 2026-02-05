import { useState } from 'react'
import EmptyIdeaAnalysis from './EmptyIdeaAnalysis'
import { MyPageHeader } from '../MyPageHeader'
import Button from '@/components/common/Button'
import ReportHeader from './ReportHeader'
import Section01BasicInfo from './sections/Section01BasicInfo'
import Section02TeamComposition from './sections/Section02TeamComposition'
import Section03Improvements from './sections/Section03Improvements'
import Section04Roadmap from './sections/Section04Roadmap'
import type { IdeaAnalysisData } from '@/types/mypage/ideaAnalysis'
import CTAModal from '@/components/common/CTAModal'
import { useNavigate } from 'react-router'
import { useCTAModal } from '@/stores/useCTAModal'
import ChevronLeftIcon from '@/assets/icons/common/chevron-left.svg?react'
import ChevronRightIcon from '@/assets/icons/common/chevron-right.svg?react'

// 필드별 색상 매핑
const getFieldColor = (fieldName: string): string => {
	const colorMap: { [key: string]: string } = {
		PM: 'var(--color-roletag-purple)',
		Design: 'var(--color-roletag-pink)',
		Frontend: 'var(--color-roletag-green)',
		Backend: 'var(--color-roletag-blue)',
	}
	return colorMap[fieldName] || 'var(--color-bg-gray)'
}

// 더미 데이터 (추후 API 호출로 대체)
const dummyAnalysisData: IdeaAnalysisData = {
	idea: {
		idea_id: 1,
		user_id: 100,
		user_name: '이방토',
		title: '커넥트',
		one_line_description:
			'아이디어 분석과 팀원 매칭부터 협업 보드까지,\n사이드 프로젝트 웹사이트 개발 아이디어를 가지고 계시군요!',
		target_and_problem: '사이드 프로젝트를 하고 싶은데 팀원을 찾기 어려운 개발자들',
		platform_type: 'Web',
		core_feature1: '아이디어 분석',
		core_feature2: '팀원 매칭',
		core_feature3: '협업 보드',
		benchmark_services: '디스콰이엇, 오픈채팅',
		prototype_due_date: '2026-04-30',
		technical_challenges: '실시간 협업 기능 구현',
		status: 'analyzed',
		created_at: '2026-01-20T10:00:00Z',
		updated_at: '2026-01-27T10:00:00Z',
	},
	idea_analysis_result: {
		idea_analysis_result_id: 1,
		idea_id: 1,
		project_name: '넥트(Nect)',
		recommended_names: ['넥트(Nect)', '커넥트', '매칭잇'],
		estimated_duration_weeks: '8주',
		created_at: '2026-01-27T10:00:00Z',
	},
	idea_analysis_result_fields: [
		{
			idea_analysis_result_field_id: 1,
			idea_analysis_result_id: 1,
			field_id: 1,
			field_name: 'PM',
			count: 1,
		},
		{
			idea_analysis_result_field_id: 2,
			idea_analysis_result_id: 1,
			field_id: 2,
			field_name: 'Design',
			count: 1,
		},
		{
			idea_analysis_result_field_id: 3,
			idea_analysis_result_id: 1,
			field_id: 3,
			field_name: 'Frontend',
			count: 2,
		},
		{
			idea_analysis_result_field_id: 4,
			idea_analysis_result_id: 1,
			field_id: 4,
			field_name: 'Backend',
			count: 2,
		},
	],
	idea_analysis_weekly_plans: [
		{
			weekly_plan_id: 1,
			idea_analysis_result_id: 1,
			week_number: 1,
			goal: '아이디어 확정 및 요구사항 정의',
			tasks: [
				{
					task_id: 1,
					weekly_plan_task_id: 1,
					weekly_plan_id: 1,
					field_id: 1,
					field_name: 'PM',
					content: '서비스 기획안 확정, 요구사항 정리, 기능 명세서 초안, 유저 플로우 초안',
				},
				{
					task_id: 2,
					weekly_plan_task_id: 2,
					weekly_plan_id: 1,
					field_id: 2,
					field_name: 'Design',
					content: '디자인 시스템 초기 설계(메인 컬러/폰트 방향 정의)',
				},
				{
					task_id: 3,
					weekly_plan_task_id: 3,
					weekly_plan_id: 1,
					field_id: 3,
					field_name: 'Frontend',
					content: '초기 개발 환경 세팅',
				},
				{
					task_id: 4,
					weekly_plan_task_id: 4,
					weekly_plan_id: 1,
					field_id: 4,
					field_name: 'Backend',
					content: 'ERD 설계(초안)',
				},
			],
		},
		{
			weekly_plan_id: 2,
			idea_analysis_result_id: 1,
			week_number: 2,
			goal: '와이어프레임 및 시스템 설계',
			tasks: [
				{
					task_id: 5,
					weekly_plan_task_id: 5,
					weekly_plan_id: 2,
					field_id: 1,
					field_name: 'PM',
					content: '주요 화면 와이어프레임 작성, 사용자 시나리오 구체화',
				},
				{
					task_id: 6,
					weekly_plan_task_id: 6,
					weekly_plan_id: 2,
					field_id: 2,
					field_name: 'Design',
					content: '컴포넌트 디자인 시스템 구축',
				},
				{
					task_id: 7,
					weekly_plan_task_id: 7,
					weekly_plan_id: 2,
					field_id: 3,
					field_name: 'Frontend',
					content: '컴포넌트 구조 설계',
				},
				{
					task_id: 8,
					weekly_plan_task_id: 8,
					weekly_plan_id: 2,
					field_id: 4,
					field_name: 'Backend',
					content: 'API 설계 및 ERD 확정',
				},
			],
		},
		{
			weekly_plan_id: 8,
			idea_analysis_result_id: 1,
			week_number: 8,
			goal: '최종 배포 및 안정화 / 프로젝트 종료 및 성과 발표',
			tasks: [
				{
					task_id: 29,
					weekly_plan_task_id: 29,
					weekly_plan_id: 8,
					field_id: 1,
					field_name: 'PM',
					content: '최종 배포 체크리스트 확인, 프로젝트 회고',
				},
				{
					task_id: 30,
					weekly_plan_task_id: 30,
					weekly_plan_id: 8,
					field_id: 2,
					field_name: 'Design',
					content: '최종 디자인 QA',
				},
				{
					task_id: 31,
					weekly_plan_task_id: 31,
					weekly_plan_id: 8,
					field_id: 3,
					field_name: 'Frontend',
					content: '프로덕션 배포 및 모니터링',
				},
				{
					task_id: 32,
					weekly_plan_task_id: 32,
					weekly_plan_id: 8,
					field_id: 4,
					field_name: 'Backend',
					content: '서버 안정화 및 모니터링',
				},
			],
		},
	],
	idea_analysis_improvements: [
		{
			improvement_id: 1,
			idea_analysis_result_id: 1,
			title: '팀원 매칭의 신뢰도 확보',
			content:
				"온라인 팀 빌딩은 소위 '탈주(중도 포기)' 인원이 발생할 위험이 큽니다. 과거 프로젝트 완주율, 혹은 팀원 상호 평가 기반의 '협업 온도'나 '활동 뱃지' 시스템을 도입하여 신뢰도를 시각화해야 합니다.",
		},
		{
			improvement_id: 2,
			idea_analysis_result_id: 1,
			title: '주차별 "산출물 체크포인트"',
			content:
				"앞서 짠 8주 일정을 시스템에 녹여, 주차별로 반드시 제출해야 하는 '증거물' 업로드 칸을 만듭니다.\n이를 통해 프로젝트가 잘 진행되고 있는지 시각적으로 관리합니다.",
		},
		{
			improvement_id: 3,
			idea_analysis_result_id: 1,
			title: '프로젝트 리스크 사전 합의 시스템',
			content:
				"팀이 매칭된 직후, 첫 페이지에서 팀원들이 각자의 '프로젝트 몰입도'와 '중단 조건'에 대한\n설문에 응답하고 이를 팀 대시보드에 고정합니다. 이를 통해 중도 하차율을 낮추고 규칙을 설정합니다.",
		},
	],
}

const IdeaAnalysis = () => {
	const [openWeeks, setOpenWeeks] = useState<number[]>([])
	const [hasReport, setHasReport] = useState<boolean>(false)
	const [analysisData] = useState<IdeaAnalysisData>(dummyAnalysisData)

	const navigate = useNavigate()
	const { modalType, open, close } = useCTAModal()

	// 주차별 로드맵 토글용
	const toggleWeek = (week: number) => {
		setOpenWeeks(prev => (prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]))
	}

	// 임시
	const handleReport = () => {
		setHasReport(true)
	}

	// (모달 핸들러) 삭제 확인
	const handleDelete = () => {
		open('deleteComplete')
	}

	// (모달 핸들러) 프로젝트 등록 후 이동
	const handleNavigateToProject = () => {
		close()
		navigate('/mypage/ongoing')
	}

	return (
		<div className='ml-7 w-full'>
			{!hasReport ? (
				// 리포트 없는 경우
				<EmptyIdeaAnalysis setHasReport={handleReport} />
			) : (
				// 리포트 있는 경우
				<div className='flex flex-col items-center'>
					{/* 브레드크럼 + 타이틀 */}
					<MyPageHeader
						action={
							<Button
								color='socialLogin'
								size='sm'
								className='text-neutral-400 px-3.25 py-2.5 w-38.5 h-11 hover:bg-neutral-100'
								onClick={() => navigate('/idea-analyze')}
							>
								+ AI 아이디어 분석
							</Button>
						}
					/>

					{/* 전체 컨테이너 */}
					<div className='flex items-center justify-center w-full bg-bg-gray border border-neutral-200 rounded-12 px-11.5 py-14'>
						{/* 헤더 + 섹션 1~4 */}
						<div className='flex flex-col items-center gap-22 w-full max-w-full'>
							<div className='flex flex-col gap-22'>
								{/* 리포트 헤더 */}
								<ReportHeader analysisData={analysisData} />
								<Section01BasicInfo analysisData={analysisData} />

								{/* 섹션 02. 원활한 진행을 위한 팀 구성은? */}
								<Section02TeamComposition analysisData={analysisData} getFieldColor={getFieldColor} />

								{/* 섹션 03. 프로젝트 보완할 점을 발견했어요! */}
								<Section03Improvements analysisData={analysisData} />

								{/* 섹션 04. 주차별 로드맵을 생성했어요! */}
								<Section04Roadmap analysisData={analysisData} openWeeks={openWeeks} toggleWeek={toggleWeek} />
							</div>

							{/* 프로젝트 생성하기 */}
							<div className='flex justify-between items-center w-full'>
								<ChevronLeftIcon className='w-10 h-10 px-2 py-2 cursor-pointer text-neutral-700 hover:bg-neutral-000 rounded-12 duration-200 ease-in-out' />
								<Button
									color='onboarding'
									className='px-5 py-4 w-80 h-15 title-3 font-semibold bg-primary-400-normal'
									onClick={() => open('projectRegister')}
								>
									프로젝트 생성하기
								</Button>
								<ChevronRightIcon className='w-10 h-10 px-2 py-2 cursor-pointer text-neutral-700 hover:bg-neutral-000 rounded-12 duration-200 ease-in-out' />
							</div>
						</div>
					</div>

					{/* 삭제하기 버튼 */}
					<Button color='text' className='underline mt-6' onClick={() => open('delete')}>
						삭제하기
					</Button>
				</div>
			)}

			{/* 삭제 모달 */}
			{modalType === 'delete' && (
				<CTAModal
					message='{삭제} 하시겠습니까?'
					isMessageHighlight={false}
					leftButtonMsg='돌아가기'
					rightButtonMsg='삭제'
					onLeftClick={close}
					onRightClick={handleDelete}
				/>
			)}

			{/* 삭제 완료 모달 */}
			{modalType === 'deleteComplete' && (
				<CTAModal message='삭제 되었습니다' isMessageHighlight={true} rightButtonMsg='확인' onRightClick={close} />
			)}

			{/* 프로젝트 등록 확인 모달 */}
			{modalType === 'projectRegister' && (
				<CTAModal
					message='프로젝트 생성이 완료 됐습니다!'
					subMessage='해당 프로젝트 페이지로 이동하시겠습니까?'
					isMessageHighlight={false}
					fixedHeight={true}
					leftButtonMsg='돌아가기'
					rightButtonMsg='이동하기'
					onLeftClick={close}
					onRightClick={handleNavigateToProject}
				/>
			)}
		</div>
	)
}

export default IdeaAnalysis
