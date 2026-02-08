import { useEffect, useRef, useMemo, useCallback, useState } from 'react'
import { useWeekDates } from '@/hooks/week-mission/useWeekDates'
import { parseDate, calculateDateSpan } from '@/utils/dateUtils'
import { useVirtualizedGrid } from '@/hooks/week-mission/useVirtualizedGrid'
import { useDragScroll } from '@/hooks/week-mission/useDragScroll'
import { useSyncScroll } from '@/hooks/week-mission/useSyncScroll'
import { useMissionDragResize } from '@/hooks/week-mission/useMissionDragResize'
import { useInitialScroll } from '@/hooks/week-mission/useInitialScroll'
import { useMissionFilter } from '@/hooks/week-mission/useMissionFilter'
import { isSameDay } from 'date-fns'
import MissionBlock from './MissionBlock'
import PlusBlock from './PlusBlock'
import DateCell from './DateCell'
import { MissonPart_Title, MissionPart_Add } from './MissonPart'
import type { MissionStatus } from '@/types/missionStatus'
import type { StatusType } from '@/types/api/status'
import { useMissionModalStore } from '@/stores/mission-modal/missionModalStore'
import type { Mission, Section } from '@/types/mission'

const ITEM_WIDTH = 80 // WeekDates와 동일한 날짜 박스 너비

interface MissionBoardProps {
	missions: Mission[]
	sections?: Section[] // 섹션 제목 배열 (기본: 4개)
	projectId?: string // 기존 미션 조회 시 프로세스 상세 API용 (있으면 모달에 데이터 채움)
	onMissionUpdate?: (
		missionId: number,
		updates: { start_date?: string; dead_line?: string; sectionIndex?: number; status?: StatusType }
	) => void
	onDeleteMission?: (processId: number) => void
}

const MissionBoard = ({ missions, sections = [], projectId, onMissionUpdate, onDeleteMission }: MissionBoardProps) => {
	// 공유 스크롤 컨테이너 ref
	const boardScrollRef = useRef<HTMLDivElement>(null)
	const weekDatesRef = useRef<HTMLDivElement>(null)
	const { dates, totalDates, itemWidth, initialScrollPosition, handleScroll } = useWeekDates(weekDatesRef)
	const [containerWidth, setContainerWidth] = useState(0)
	const [hoveredCell, setHoveredCell] = useState<{ column: number; row: number } | null>(null)
	const gridContainerRef = useRef<HTMLDivElement>(null)

	// 드래그 스크롤 훅
	const weekDatesDrag = useDragScroll({ scrollRef: weekDatesRef })
	const boardDrag = useDragScroll({ scrollRef: boardScrollRef })
	const { openMissionModal } = useMissionModalStore()
	const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)
	const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null)

	const handleContextMenu = (processId: number, isTask: boolean, e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (isTask) return
		setDropdownPosition({
			top: e.clientY,
			left: e.clientX,
		})
		setOpenDropdownId(processId)
	}

	// WeekDates와 MissionBoard 스크롤 동기화
	// 드래그 중에는 동기화하지 않도록 isDraggingRef 전달
	useSyncScroll({
		sourceRef: weekDatesRef,
		targetRef: boardScrollRef,
		onSync: scrollLeft => setVirtualScrollLeft(scrollLeft),
		isDraggingRef: boardDrag.isDraggingRef,
	})

	// 반대 방향 동기화도 추가 (MissionBoard → WeekDates)
	useSyncScroll({
		sourceRef: boardScrollRef,
		targetRef: weekDatesRef,
		isDraggingRef: weekDatesDrag.isDraggingRef,
	})

	// 날짜가 같은지 확인 (시간 제외)
	const isSameDate = useCallback((date1: Date, date2: Date): boolean => {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		)
	}, [])

	// Mission의 시작 열 인덱스 찾기
	const getMissionColumnStart = useCallback(
		(start_date: string | undefined): number | null => {
			if (!start_date || typeof start_date !== 'string') return null
			const startDate = parseDate(start_date)
			const index = dates.findIndex(date => isSameDate(date, startDate))
			return index !== -1 ? index + 1 : null
		},
		[dates, isSameDate]
	)

	// MissionBlock들을 grid 위치에 맞게 배치
	const positionedMissions = useMemo(() => {
		return missions.map(mission => ({
			...mission,
			columnStart: getMissionColumnStart(mission.start_date),
		}))
	}, [missions, getMissionColumnStart])

	// 컨테이너 너비 업데이트
	useEffect(() => {
		const updateWidth = () => {
			if (boardScrollRef.current) {
				const width = boardScrollRef.current.clientWidth
				if (width > 0) {
					setContainerWidth(width)
				}
			}
		}
		// 초기 렌더링 후 바로 업데이트
		const timer = setTimeout(updateWidth, 0)
		updateWidth()
		window.addEventListener('resize', updateWidth)
		return () => {
			clearTimeout(timer)
			window.removeEventListener('resize', updateWidth)
		}
	}, [])

	// 가상화 훅 (containerWidth가 0이면 전체 렌더링으로 폴백)
	const {
		visibleItems,
		totalWidth,
		beforeWidth,
		afterWidth,
		handleScroll: handleVirtualScroll,
		visibleRange,
		setScrollLeft: setVirtualScrollLeft,
	} = useVirtualizedGrid({
		totalItems: totalDates,
		itemWidth,
		overscan: 10,
		scrollElementRef: boardScrollRef,
	})

	// 드래그/리사이즈 훅
	const {
		draggingMissionId,
		resizingMissionId,
		dragTempPosition,
		resizeTempPosition,
		getResizeStartColumn,
		handleMissionDragStart,
		handleMissionResizeStart,
		justDraggedRef,
	} = useMissionDragResize({
		dates,
		sections,
		positionedMissions,
		gridContainerRef,
		boardScrollRef,
		beforeWidth,
		onMissionUpdate,
	})

	// 오늘 날짜의 인덱스 찾기
	const todayIndex = useMemo(() => {
		const today = new Date()
		return dates.findIndex(date => isSameDay(date, today))
	}, [dates])

	// 초기 스크롤 위치 설정
	useInitialScroll({
		boardScrollRef,
		weekDatesRef,
		todayIndex,
		itemWidth,
		initialScrollPosition,
		setVirtualScrollLeft,
	})

	// 스크롤 이벤트 핸들러 (드래그 중이 아닐 때만 weekOffset 업데이트)
	const combinedHandleScroll = useCallback(() => {
		handleVirtualScroll()
		if (!boardDrag.isDraggingRef.current && !weekDatesDrag.isDraggingRef.current) {
			handleScroll()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleVirtualScroll, handleScroll])

	// WeekDates용 가상화 (위에 날짜 표시용)
	const {
		visibleItems: dateVisibleItems,
		beforeWidth: dateBeforeWidth,
		afterWidth: dateAfterWidth,
		totalWidth: dateTotalWidth,
		handleScroll: handleDateVirtualScroll,
	} = useVirtualizedGrid({
		totalItems: totalDates,
		itemWidth,
		overscan: 10,
		scrollElementRef: weekDatesRef,
	})

	// 필터링된 미션 목록
	const visibleMissions = useMissionFilter({
		positionedMissions,
		visibleRange,
		containerWidth,
	})

	// 날짜 스크롤 핸들러
	const handleDateScroll = useCallback(() => {
		handleDateVirtualScroll()
		handleScroll()
	}, [handleDateVirtualScroll, handleScroll])

	// 보드 마우스 다운 핸들러
	const handleBoardMouseDown = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!draggingMissionId && !resizingMissionId && !(e.target as HTMLElement).closest('[data-mission-block]')) {
				boardDrag.handleMouseDown(e)
			}
		},
		[draggingMissionId, resizingMissionId, boardDrag]
	)

	// 빈 셀 체크 함수
	const checkEmptyCell = useCallback(
		(dateIndex: number, sectionIndex: number): boolean => {
			return positionedMissions.some(mission => {
				if (!mission.columnStart) return false
				const startCol = mission.columnStart - 1
				const endCol = startCol + calculateDateSpan(mission.start_date, mission.dead_line) - 1
				return mission.sectionIndex === sectionIndex && dateIndex >= startCol && dateIndex <= endCol
			})
		},
		[positionedMissions]
	)

	return (
		<div className='flex flex-col gap-0'>
			{/* WeekDates 컴포넌트 */}
			<div className='flex'>
				{/* MissonPart 너비만큼 왼쪽 여백 */}
				<div className='w-[72px] shrink-0' />
				<div
					ref={weekDatesRef}
					className='flex-1 flex items-center gap-0 overflow-x-auto cursor-grab active:cursor-grabbing'
					style={{
						scrollbarWidth: 'none',
						msOverflowStyle: 'none',
						WebkitOverflowScrolling: 'touch',
					}}
					onMouseDown={weekDatesDrag.handleMouseDown}
					onMouseUp={weekDatesDrag.handleMouseUp}
					onScroll={handleDateScroll}
				>
					{/* 가상화: 앞쪽 여백 */}
					{dateBeforeWidth > 0 && <div style={{ width: `${dateBeforeWidth}px`, flexShrink: 0 }} />}

					{/* 가상화: 보이는 아이템만 렌더링 */}
					{dateVisibleItems.map(({ index }) => {
						if (index >= dates.length) return null
						return <DateCell key={index} date={dates[index]} index={index} />
					})}

					{/* 가상화: 뒤쪽 여백 */}
					{dateAfterWidth > 0 && <div style={{ width: `${dateAfterWidth}px`, flexShrink: 0 }} />}

					{/* 전체 너비를 위한 숨겨진 div */}
					<div style={{ width: `${dateTotalWidth}px`, height: '1px', opacity: 0, pointerEvents: 'none' }} />
				</div>
			</div>

			{/* 그리드 영역 - 4개 섹션 */}
			<div className='flex relative'>
				{/* 왼쪽 MissonPart 컴포넌트들 - 고정 위치 */}
				<div className='flex flex-col gap-y-[12px] pt-px shrink-0'>
					{/* 첫 번째 줄: 위크미션 Task */}
					<MissonPart_Title title='위크미션 Task' task />
					{/* 나머지 줄들: 파트 API로 조회한 섹션 제목들 (없으면 sections 폴백) */}
					{sections.map(section => (
						<MissonPart_Title key={section.id} title={section.title} />
					))}
					{/* 맨 아래줄: 팀 추가 */}
					<MissionPart_Add />
				</div>
				<div className='flex-1 relative overflow-hidden'>
					<div
						ref={boardScrollRef}
						className='h-full overflow-x-auto cursor-grab active:cursor-grabbing'
						style={{
							scrollbarWidth: 'none',
							msOverflowStyle: 'none',
							WebkitOverflowScrolling: 'touch',
						}}
						onMouseDown={handleBoardMouseDown}
						onMouseUp={boardDrag.handleMouseUp}
						onScroll={combinedHandleScroll}
					>
						<div
							ref={gridContainerRef}
							className='grid gap-x-0 gap-y-[12px] shrink-0 relative border-t border-neutral-100'
							style={{
								gridTemplateColumns: `repeat(${totalDates}, ${ITEM_WIDTH}px)`,
								gridTemplateRows: `repeat(${sections.length + 1}, 130px)`,
								width: `${totalWidth}px`,
							}}
						>
							{/* 가상화: 앞쪽 여백 */}
							{beforeWidth > 0 && (
								<div
									style={{
										gridColumn: `1 / ${Math.ceil(beforeWidth / ITEM_WIDTH) + 1}`,
										gridRow: `1 / ${sections.length + 2}`,
									}}
								/>
							)}

							{/* 가상화: 보이는 세로선만 렌더링 (모든 섹션에 걸쳐 연속된 선) */}
							{visibleItems.map(({ index }) => {
								const dateIndex = index
								if (dateIndex >= dates.length) return null

								return (
									<div
										key={`line-${dateIndex}`}
										className='border-r border-neutral-100'
										style={{
											gridColumn: dateIndex + 1,
											gridRow: `1 / ${sections.length + 2}`,
										}}
									/>
								)
							})}

							{/* MissionBlock 배치 - 가상화 범위 내의 것만 */}
							{visibleMissions.map(mission => {
								if (!mission.columnStart) return null

								// 드래그 중이면 임시 위치 사용
								const isDragging = draggingMissionId === mission.process_id
								const tempColumnStart =
									isDragging && dragTempPosition ? dragTempPosition.columnIndex + 1 : mission.columnStart
								const tempSectionIndex =
									isDragging && dragTempPosition ? dragTempPosition.sectionIndex : mission.sectionIndex

								// 리사이즈 중이면 임시 크기 사용
								const isResizing = resizingMissionId === mission.process_id
								const originalColSpan = calculateDateSpan(mission.start_date, mission.dead_line)
								let tempColSpan = originalColSpan
								if (isResizing && resizeTempPosition !== null) {
									const resizeStartColumn = getResizeStartColumn(mission.process_id)
									const startColumnIndex = (resizeStartColumn || mission.columnStart || 1) - 1
									tempColSpan = resizeTempPosition - startColumnIndex + 1
								}

								const statusToMissionStatus = (s: string): MissionStatus => {
									const map: Record<string, MissionStatus> = {
										PLANNING: 'planning',
										IN_PROGRESS: 'in_progress',
										DONE: 'completed',
										BACKLOG: 'backlog',
									}
									return map[s] ?? 'planning'
								}

								return (
									<div
										key={mission.process_id}
										onContextMenu={e => handleContextMenu(mission.process_id, !!mission.task, e)}
										style={{
											gridColumnStart: tempColumnStart,
											gridColumnEnd: `span ${tempColSpan}`,
											gridRow: tempSectionIndex + 1,
										}}
									>
										<MissionBlock
											task={mission.task}
											missionNumber={mission.mission_number}
											title={mission.title}
											progress={mission.progress}
											startDate={mission.start_date}
											dueDate={mission.dead_line}
											daysRemaining={mission.left_day}
											status={statusToMissionStatus(mission.status)}
											assignees={mission.assignee}
											gridColumnSize={tempColSpan}
											onClick={() => {
												if (!justDraggedRef.current) {
													openMissionModal(mission.process_id, mission.sectionIndex, projectId)
												}
											}}
											onDragStart={e => handleMissionDragStart(mission.process_id, e)}
											onResizeStart={() => handleMissionResizeStart(mission.process_id)}
											onStatusChange={newStatus => {
												if (onMissionUpdate) {
													const statusToApi: Record<MissionStatus, StatusType> = {
														planning: 'PLANNING',
														in_progress: 'IN_PROGRESS',
														completed: 'DONE',
														backlog: 'BACKLOG',
													}
													onMissionUpdate(mission.process_id, { status: statusToApi[newStatus] })
												}
											}}
											isDragging={isDragging}
											isResizing={isResizing}
										/>
									</div>
								)
							})}

							{openDropdownId && (
								<div className='fixed inset-0 z-40' onClick={() => setOpenDropdownId(null)}>
									<div className='fixed z-50 min-w-[138px] bg-neutral-000 rounded-10 shadow-drop-neutral-1 overflow-hidden py-0.5' style={dropdownPosition ? { top: dropdownPosition.top, left: dropdownPosition.left } : undefined}>
										<button
											type='button'
											className='body-3 text-danger-700 font-medium py-2 pl-5 pr-3 w-full text-left hover:bg-neutral-50 transition-colors duration-300'
											onClick={() => {
												onDeleteMission?.(openDropdownId)
												setOpenDropdownId(null)
											}}
										>
											삭제
										</button>
									</div>
								</div>
							)}
							{/* 빈 셀에 PlusBlock 표시 (호버 시) */}
							{visibleItems.map(({ index }) => {
								const dateIndex = index
								if (dateIndex >= dates.length) return null

								return [...sections, null].map((_, sectionIndex) => {
									const hasMission = checkEmptyCell(dateIndex, sectionIndex)

									if (hasMission) return null

									const isHovered = hoveredCell?.column === dateIndex && hoveredCell?.row === sectionIndex

									return (
										<div
											key={`empty-${dateIndex}-${sectionIndex}`}
											className='relative'
											style={{
												gridColumn: dateIndex + 1,
												gridRow: sectionIndex + 1,
											}}
											onMouseEnter={() => setHoveredCell({ column: dateIndex, row: sectionIndex })}
											onMouseLeave={() => setHoveredCell(null)}
										>
											<div
												className='absolute inset-0 flex items-center mt-3 justify-center transition-opacity duration-300'
												style={{
													opacity: isHovered ? 1 : 0,
													pointerEvents: isHovered ? 'auto' : 'none',
												}}
											>
												<PlusBlock onClick={() => openMissionModal(undefined, undefined, undefined, true)} />
											</div>
										</div>
									)
								})
							})}

							{/* 가상화: 뒤쪽 여백 */}
							{afterWidth > 0 && (
								<div
									style={{
										gridColumn: `${Math.floor((totalWidth - afterWidth) / ITEM_WIDTH) + 1} / ${totalDates + 1}`,
										gridRow: `1 / ${sections.length + 2}`,
									}}
								/>
							)}
						</div>
					</div>
					{/* 왼쪽 그라데이션 오버레이 */}
					<div className='absolute left-0 top-0 bottom-0 w-[72px] pointer-events-none z-10 bg-linear-to-l from-white/0 via-white/50 to-white' />
					{/* 오른쪽 그라데이션 오버레이 */}
					<div className='absolute right-0 top-0 bottom-0 w-[72px] pointer-events-none z-10 bg-linear-to-r from-white/0 via-white/50 to-white' />
				</div>
			</div>
		</div>
	)
}

export default MissionBoard