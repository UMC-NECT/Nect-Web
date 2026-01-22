import { useState, useRef, useEffect } from 'react'
import SegmentsBar from '@/components/week-mission/SegmentsBar'
import StatusChip from '@/components/common/StatusChip'
import TodoSection from '@/components/work-status/TodoSection'
import WorkProgress from '@/components/work-status/WorkProgress'
import HistoryItem from '@/components/work-status/HistoryItem'
import TodoBlock from '@/components/work-status/TodoBlock'
import PlusIcon from '@/assets/icons/week-mission/plus.svg?react'
import type { MissionStatus } from '@/types/missionStatus'
import StudioTitle from '@/components/common/StudioTitle'
import { useWorkStatusStore } from '@/stores/work-status/workStatusStore'
import { useHistoryStore } from '@/stores/work-status/historyStore'

const WorkStatusPage = () => {
	const [selectedSegment, setSelectedSegment] = useState('Team')
	const [isScrolling, setIsScrolling] = useState(false)
	const scrollContainerRef = useRef<HTMLDivElement>(null)
	const scrollTimeoutRef = useRef<number | null>(null)
	const segments = ['Team', 'PM', 'Design', 'Backend', 'Frontend']

	const { getStatusCounts, getWorkStatusItemsByStatus, getWorkStatusItemsByTeam, getProgressByTeam } = useWorkStatusStore()
	const { getRecentHistory } = useHistoryStore()

	const statusCounts = getStatusCounts()
	const statuses: MissionStatus[] = ['planning', 'in_progress', 'completed', 'backlog']

	// 선택된 세그먼트에 따라 아이템 필터링
	const getFilteredItemsByStatus = (status: MissionStatus) => {
		if (selectedSegment === 'Team') {
			// Team 선택 시 모든 팀의 아이템 표시
			return getWorkStatusItemsByStatus(status)
		} else {
			// 특정 팀 선택 시 해당 팀의 아이템만 필터링
			const teamItems = getWorkStatusItemsByTeam(selectedSegment)
			return teamItems.filter(item => item.status === status)
		}
	}

	// 팀별 진행률 계산
	const teams = ['PM', 'Design', 'Backend', 'Frontend']
	const progressData = teams.reduce((acc, team) => {
		acc[team] = getProgressByTeam(team)
		return acc
	}, {} as Record<string, ReturnType<typeof getProgressByTeam>>)

	// 히스토리 데이터
	const historyItems = getRecentHistory(6)

	// 스크롤 감지
	useEffect(() => {
		const container = scrollContainerRef.current
		if (!container) return

		const handleScroll = () => {
			setIsScrolling(true)

			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current)
			}

			scrollTimeoutRef.current = setTimeout(() => {
				setIsScrolling(false)
			}, 150)
		}

		container.addEventListener('scroll', handleScroll, { passive: true })
		container.addEventListener('wheel', handleScroll, { passive: true })

		return () => {
			container.removeEventListener('scroll', handleScroll)
			container.removeEventListener('wheel', handleScroll)
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current)
			}
		}
	}, [])

	return (
		<div className='relative flex mt-16 h-[calc(100vh-66px-64px)] w-full ml-[72px] overflow-hidden'>
			{/* 메인 콘텐츠 영역 */}
			<div className='flex flex-col items-start relative shrink-0 w-auto h-full overflow-hidden'>

				{/* 페이지 헤더 */}
				<StudioTitle
					title='파트별 작업 현황'
					description='팀별 작업 상태와 진행 상황을 한눈에 확인하는 관리 영역'
				/>

				{/* 세그먼트 바 */}
				<div className='flex items-center relative shrink-0 my-8 '>
					<SegmentsBar
						segments={segments}
						defaultValue={selectedSegment}
						onChange={setSelectedSegment}
						editable={true}
					/>
				</div>

				{/* StatusChip 헤더 - 고정 */}
				<div className='flex gap-5 items-start relative shrink-0 w-full mb-3'>
					{statuses.map(status => (
						<div key={status} className='flex items-center justify-between relative shrink-0 w-[224px]'>
							<StatusChip state={status} />
							<div className='flex gap-2 items-center relative shrink-0'>
								<p className='body-1 text-primary-500-normal font-medium relative shrink-0'>
									{statusCounts[status]}
								</p>
								<button
									type='button'
									className='bg-neutral-000 flex gap-0.5 items-center justify-center p-1.5 relative rounded-full shrink-0 w-7 h-7 shadow-[0px_0px_2.68px_0px_rgba(165,165,165,0.3)] '
								>
									<PlusIcon className='w-4 h-4 shrink-0 stroke-neutral-700' />
								</button>
							</div>
						</div>
					))}
				</div>

				{/* 4개 컬럼 TodoSection 영역 - 함께 스크롤 */}
				<div
					ref={scrollContainerRef}
					className={`WorkStatusScrollbar flex gap-5 items-start relative shrink-0 w-full flex-1 min-h-0 overflow-y-auto pr-[6px] ${
						isScrolling ? 'scrolling' : ''
					}`}
					style={{ scrollbarGutter: 'stable' }}
				>
					{statuses.map(status => (
						<div key={status} className='flex flex-col gap-2 items-start relative shrink-0 w-[224px]'>
							<TodoSection status={status}>
								{getFilteredItemsByStatus(status).map(item => (
									<TodoBlock
										key={item.id}
										id={item.id}
										team={item.team}
										title={item.title}
										todo={item.todo}
										dueDate={item.dueDate}
										participants={item.participants}
										links={item.links}
										attachments={item.attachments}
										variant={status === 'backlog' ? 'Minimum' : 'Default'}
										isEdit={item.isEdit}
									/>
								))}
							</TodoSection>
						</div>
					))}
				</div>
			</div>

			{/* 오른쪽 사이드바 */}
			<div className='flex flex-col gap-16 items-start relative shrink-0 w-auto h-full overflow-y-hidden mt-[104px] ml-[6px] px-10 border-l border-neutral-200'>
				{/* 팀 작업 진행률 */}
				<div className='flex flex-col gap-[14px] items-start relative shrink-0 w-full'>
					<h2 className='title-2 text-neutral-900 font-bold relative shrink-0 w-full'>팀 작업 진행률</h2>
					<div className='flex flex-col gap-6 items-start relative shrink-0 w-full'>
						{Object.entries(progressData).map(([team, progress]) => (
							<WorkProgress key={team} title={team} progress={progress} />
						))}

						{/* 범례 */}
						<div className='flex gap-[9px] items-center relative shrink-0'>
							<div className='flex gap-1.5 items-center relative shrink-0'>
								<div className='w-2.5 h-2.5 rounded-full bg-primary-500-normal relative shrink-0' />
								<p className='caption-1 text-neutral-700 font-medium relative shrink-0'>완료</p>
							</div>
							<div className='flex gap-1.5 items-center relative shrink-0'>
								<div className='w-2.5 h-2.5 rounded-full bg-primary-300-light relative shrink-0' />
								<p className='caption-1 text-neutral-700 font-medium relative shrink-0'>진행 중</p>
							</div>
							<div className='flex gap-1.5 items-center relative shrink-0'>
								<div className='w-2.5 h-2.5 rounded-full bg-primary-150-light relative shrink-0' />
								<p className='caption-1 text-neutral-700 font-medium relative shrink-0'>계획 중</p>
							</div>
						</div>
					</div>
				</div>

				{/* 최근 히스토리 */}
				<div className='flex flex-col gap-5 items-start relative shrink-0 w-full'>
					<h2 className='title-2 text-neutral-900 font-bold relative shrink-0 w-full'>최근 히스토리</h2>
					<div className='flex flex-col gap-5 items-start relative shrink-0 w-full'>
						{historyItems.map((item, index) => (
							<HistoryItem
								key={item.id}
								team={item.team}
								user={item.user}
								action={item.action}
								time={item.time}
								iconVariant={item.iconVariant}
								app={item.app}
								isLast={index === historyItems.length - 1}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default WorkStatusPage