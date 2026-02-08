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
import { useAnalysisQuery, useDeleteAnalysisMutation, useMypageProfileQuery } from '@/hooks/mypage/useMypageApi'

const IdeaAnalysis = () => {
	const [openWeeks, setOpenWeeks] = useState<number[]>([])
	const [page, setPage] = useState('0')

	const navigate = useNavigate()
	const { modalType, open, close } = useCTAModal()

	const { data: analysisResponse } = useAnalysisQuery(page)
	const { data: profileResponse } = useMypageProfileQuery()
	const { mutate: deleteAnalysis } = useDeleteAnalysisMutation()

	const analysisData = analysisResponse?.body?.analysis
	const pageInfo = analysisResponse?.body?.page_info
	const userName = profileResponse?.body?.name

	// 주차별 로드맵 토글용
	const toggleWeek = (week: number) => {
		setOpenWeeks(prev => (prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]))
	}

	// 페이지네이션
	const handlePrevPage = () => {
		if (pageInfo?.has_previous) {
			setPage(prev => String(Number(prev) - 1))
			setOpenWeeks([])
		}
	}

	const handleNextPage = () => {
		if (pageInfo?.has_next) {
			setPage(prev => String(Number(prev) + 1))
			setOpenWeeks([])
		}
	}

	// (모달 핸들러) 삭제 확인
	const handleDelete = () => {
		if (!analysisData) return
		deleteAnalysis(analysisData.analysis_id, {
			onSuccess: () => {
				setPage('0')
				open('deleteComplete')
			},
		})
	}

	// (모달 핸들러) 프로젝트 등록 후 이동
	const handleNavigateToProject = () => {
		close()
		navigate('/mypage/ongoing')
	}

	return (
		<div className='ml-7 w-full'>
			{!analysisData ? (
				// 리포트 없는 경우
				<EmptyIdeaAnalysis />
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
								<ReportHeader analysisData={analysisData} userName={userName} />
								<Section01BasicInfo analysisData={analysisData} />

								{/* 섹션 02. 원활한 진행을 위한 팀 구성은? */}
								<Section02TeamComposition analysisData={analysisData} />

								{/* 섹션 03. 프로젝트 보완할 점을 발견했어요! */}
								<Section03Improvements analysisData={analysisData} />

								{/* 섹션 04. 주차별 로드맵을 생성했어요! */}
								<Section04Roadmap analysisData={analysisData} openWeeks={openWeeks} toggleWeek={toggleWeek} />
							</div>

							{/* 프로젝트 생성하기 */}
							<div className='flex justify-between items-center w-full'>
								{pageInfo?.has_previous ? (
									<button
										className='w-10 h-10 p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100 rounded-12 duration-200 ease-in-out'
										onClick={handlePrevPage}
									>
										<ChevronLeftIcon className='w-full h-full' />
									</button>
								) : (
									<div className='w-10 h-10' />
								)}
								<Button
									color='onboarding'
									className='px-5 py-4 w-80 h-15 title-3 font-semibold bg-primary-400-normal'
									onClick={() => open('projectRegister')}
								>
									프로젝트 생성하기
								</Button>
								{pageInfo?.has_next ? (
									<button
										className='w-10 h-10 p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100 rounded-12 duration-200 ease-in-out'
										onClick={handleNextPage}
									>
										<ChevronRightIcon className='w-full h-full' />
									</button>
								) : (
									<div className='w-10 h-10' />
								)}
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
