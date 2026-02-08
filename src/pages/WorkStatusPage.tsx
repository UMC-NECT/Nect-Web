import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import SegmentsBar from '@/components/week-mission/SegmentsBar'
import StatusChip from '@/components/common/StatusChip'
import TodoSection from '@/components/work-status/TodoSection'
import WorkProgress from '@/components/work-status/WorkProgress'
import HistoryItem from '@/components/work-status/HistoryItem'
import TodoBlock from '@/components/work-status/TodoBlock'
import PlusIcon from '@/assets/icons/week-mission/plus.svg?react'
import type { MissionStatus } from '@/types/missionStatus'
import StudioTitle from '@/components/common/StudioTitle'
import type { WorkStatusItem } from '@/stores/work-status/workStatusStore'
import { useWorkStatusStore } from '@/stores/work-status/workStatusStore'
import { useWorkStatusDragAndDrop } from '@/hooks/work-status/useWorkStatusDragAndDrop'
import { useWorkStatusFilter } from '@/hooks/work-status/useWorkStatusFilter'
import { useWorkStatusScroll } from '@/hooks/work-status/useWorkStatusScroll'
import { useWorkStatusData } from '@/hooks/work-status/useWorkStatusData'
import { useMissionModalStore } from '@/stores/mission-modal/missionModalStore'
import { useTeamStore, getRoleDisplayName } from '@/stores/teamStore'
import useGetProjectUsers from '@/hooks/project-users/useGetProjectUsers'
import { useProgressSummaryQuery } from '@/hooks/process/useProcessApi'
import type { Progress } from '@/types/progress'

// Droppable 컬럼 컴포넌트
interface DroppableColumnProps {
	id: string
	children: React.ReactNode
}

const DroppableColumn = ({ id, children }: DroppableColumnProps) => {
	const { setNodeRef } = useDroppable({
		id,
	})

	return <div ref={setNodeRef}>{children}</div>
}

// 드래그 가능한 TodoBlock 래퍼 컴포넌트
interface SortableTodoBlockProps {
	item: WorkStatusItem
	status: MissionStatus
	onItemClick: (itemId: number) => void
}

const SortableTodoBlock = ({ item, status, onItemClick }: SortableTodoBlockProps) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: item.id,
	})
	const wasDraggingRef = useRef(false)

	// 드래그 상태 변화 감지
	useEffect(() => {
		if (isDragging) {
			wasDraggingRef.current = true
		}
	}, [isDragging])

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	}

	const handleClick = () => {
		// 드래그 직후에는 클릭 무시
		if (wasDraggingRef.current) {
			wasDraggingRef.current = false
			return
		}
		onItemClick(item.id)
	}

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<TodoBlock
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
				onClick={handleClick}
			/>
		</div>
	)
}

const WorkStatusPage = () => {
	const [selectedSegment, setSelectedSegment] = useState('Team')
	const { roles } = useTeamStore()
	const segments = ['Team', ...roles.map(role => getRoleDisplayName(role))]
	const statuses: MissionStatus[] = ['planning', 'in_progress', 'completed', 'backlog']
	const { openMissionModal } = useMissionModalStore()

	// 커스텀 훅들
	const { getFilteredItemsByStatus } = useWorkStatusFilter(selectedSegment)
	const { isScrolling, scrollContainerRef } = useWorkStatusScroll()
	const { statusCounts, historyItems } = useWorkStatusData()
	const { projectId } = useGetProjectUsers()
	const { data: progressSummaryData } = useProgressSummaryQuery(projectId ?? '')

	// 진행률: 초기값은 API, 변경분은 드래그 시 deltas로만 반영 (effect 없이 파생)
	const progressFromApi = useMemo(
		() =>
			progressSummaryData?.body?.lanes?.length
				? progressSummaryData.body.lanes.reduce(
						(acc, lane) => {
							acc[lane.lane_name] = {
								planning: lane.planning,
								inProgress: lane.in_progress,
								completed: lane.done,
							}
							return acc
						},
						{} as Record<string, Progress>
					)
				: {},
		[progressSummaryData]
	)
	type ProgressDelta = { team: string; prevStatus: MissionStatus; newStatus: MissionStatus }
	const [deltas, setDeltas] = useState<ProgressDelta[]>([])
	const workStatusItems = useWorkStatusStore(s => s.workStatusItems)
	const progressData = useMemo(() => {
		const base: Record<string, Progress> = {}
		for (const [name, p] of Object.entries(progressFromApi)) {
			base[name] = { planning: p.planning, inProgress: p.inProgress, completed: p.completed }
		}
		const toKey = (s: MissionStatus): keyof Progress | null =>
			s === 'backlog' ? null : s === 'in_progress' ? 'inProgress' : s === 'completed' ? 'completed' : 'planning'
		for (const { team, prevStatus, newStatus } of deltas) {
			const lane = base[team]
			if (!lane) continue
			const next: Progress = { ...lane }
			const prevKey = toKey(prevStatus)
			const newKey = toKey(newStatus)
			if (prevKey) next[prevKey] = Math.max(0, next[prevKey] - 1)
			if (newKey) next[newKey] = next[newKey] + 1
			base[team] = next
		}
		return base
	}, [progressFromApi, deltas])
	const updateProgressOnMove = useCallback((team: string, prevStatus: MissionStatus, newStatus: MissionStatus) => {
		setDeltas(prev => [...prev, { team, prevStatus, newStatus }])
	}, [])

	const { activeId, sensors, handleDragStart, handleDragEnd } = useWorkStatusDragAndDrop({
		statuses,
		getFilteredItemsByStatus,
		onStatusChange: (activeId, prevStatus, newStatus) => {
			const item = workStatusItems.find(i => i.id === activeId)
			if (item) updateProgressOnMove(item.team, prevStatus, newStatus)
		},
	})

	// 드래그 중인 아이템 찾기 (필터링 없이 전체 아이템에서 찾음)
	const activeItem = activeId ? workStatusItems.find(item => item.id === activeId) : undefined

	return (
		<div className='relative flex mt-16 h-[calc(100vh-66px-64px)] w-full ml-[72px] overflow-hidden'>
			{/* 메인 콘텐츠 영역 */}
			<div
				ref={scrollContainerRef}
				className={`WorkStatusScrollbar flex flex-col items-start relative shrink-0 w-auto h-full overflow-y-auto pr-[6px] ${
					isScrolling ? 'scrolling' : ''
				}`}
				style={{ scrollbarGutter: 'stable' }}
			>

				{/* 페이지 헤더 */}
				<StudioTitle
					title='파트별 작업 현황'
					description='팀별 작업 상태와 진행 상황을 한눈에 확인하는 관리 영역'
				/>

				{/* 세그먼트 바 - sticky */}
				<div className='flex items-center w-full shrink-0 py-8 sticky top-0 z-10 bg-neutral-000'>
					<SegmentsBar
						segments={segments}
						defaultValue={selectedSegment}
						onChange={setSelectedSegment}
					/>
				</div>

				{/* StatusChip 헤더 - sticky */}
				<div className='flex gap-5 items-start shrink-0 w-full mb-3 sticky top-[88px] z-10 bg-neutral-000 pb-3'>
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
									onClick={() => {openMissionModal()}}
								>
									<PlusIcon className='w-4 h-4 shrink-0 stroke-neutral-700' />
								</button>
							</div>
						</div>
					))}
				</div>

				{/* 4개 컬럼 TodoSection 영역 */}
				<DndContext
					sensors={sensors}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					modifiers={[]}
				>
					<div className='flex gap-5 items-start relative shrink-0 w-full '>
					{statuses.map(status => {
						const items = getFilteredItemsByStatus(status)
						return (
							<DroppableColumn key={status} id={status}>
								<SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
									<div className='flex flex-col gap-2 items-start relative shrink-0 w-[224px]'>
										<TodoSection status={status}>
											{items.map(item => (
												<SortableTodoBlock
													key={item.id}
													item={item}
													status={status}
													onItemClick={(itemId) => openMissionModal(itemId)}
												/>
											))}
										</TodoSection>
									</div>
								</SortableContext>
							</DroppableColumn>
						)
					})}
					</div>
					{activeItem && (
						<DragOverlay style={{ cursor: 'grabbing', zIndex: 9999 }}>
							<div style={{ opacity: 0.9, transform: 'rotate(2deg)', pointerEvents: 'none' }}>
								<TodoBlock
									id={activeItem.id}
									team={activeItem.team}
									title={activeItem.title}
									todo={activeItem.todo}
									dueDate={activeItem.dueDate}
									participants={activeItem.participants}
									links={activeItem.links}
									attachments={activeItem.attachments}
									variant={activeItem.status === 'backlog' ? 'Minimum' : 'Default'}
									isEdit={activeItem.isEdit}
								/>
							</div>
						</DragOverlay>
					)}
				</DndContext>
			</div>

			{/* 오른쪽 사이드바 */}
			<div className='flex flex-col gap-16 items-start relative shrink-0 w-auto h-[calc(100%-104px)] mt-[104px] ml-[6px] px-10 pb-8 border-l border-neutral-200 overflow-y-auto WorkStatusScrollbar'>
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
						{historyItems.slice(0, 10).map((item, index, arr) => (
							<HistoryItem
								key={item.id}
								team={item.team}
								user={item.user}
								action={item.action}
								time={item.time}
								iconVariant={item.iconVariant}
								app={item.app}
								isLast={index === arr.length - 1}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default WorkStatusPage