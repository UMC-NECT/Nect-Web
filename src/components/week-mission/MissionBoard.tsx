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
import { useMissionModalStore } from '@/stores/mission-modal/missionModalStore'

const ITEM_WIDTH = 80 // WeekDates와 동일한 날짜 박스 너비

export interface Mission {
	id: number
	isGoal?: boolean
	missionNumber: number
	title: string
	progress: number
	createdAt: string // "2025.11.17" 형식
	dueDate: string // "2025.11.30" 형식
	daysRemaining: number
	status: MissionStatus
	sectionIndex: number // 0-3 사이의 섹션 인덱스
	participants?: string[]
	onClick?: () => void
}

export interface Section {
	id: number
	title: string
}

interface MissionBoardProps {
	missions: Mission[]
	sections?: Section[] // 섹션 제목 배열 (기본: 4개)
	onMissionUpdate?: (
		missionId: number,
		updates: { createdAt?: string; dueDate?: string; sectionIndex?: number; status?: MissionStatus }
	) => void
}

const MissionBoard = ({ missions, sections = [], onMissionUpdate }: MissionBoardProps) => {
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
		(createdAt: string): number | null => {
			const startDate = parseDate(createdAt)
			const index = dates.findIndex(date => isSameDate(date, startDate))
			return index !== -1 ? index + 1 : null
		},
		[dates, isSameDate]
	)

	// MissionBlock들을 grid 위치에 맞게 배치
	const positionedMissions = useMemo(() => {
		return missions.map(mission => ({
			...mission,
			columnStart: getMissionColumnStart(mission.createdAt),
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
				const endCol = startCol + calculateDateSpan(mission.createdAt, mission.dueDate) - 1
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
					<MissonPart_Title title='위크미션 Task' isGoal />
					{/* 나머지 줄들: 섹션 제목들 */}
					{sections.map((section, index) => (
						<MissonPart_Title key={index} title={section.title} />
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
							className='grid gap-x-0 gap-y-[12px] shrink-0 relative border-t border-neutral-200'
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
										className='border-r border-neutral-200'
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
								const isDragging = draggingMissionId === mission.id
								const tempColumnStart =
									isDragging && dragTempPosition ? dragTempPosition.columnIndex + 1 : mission.columnStart
								const tempSectionIndex =
									isDragging && dragTempPosition ? dragTempPosition.sectionIndex : mission.sectionIndex

								// 리사이즈 중이면 임시 크기 사용
								const isResizing = resizingMissionId === mission.id
								const originalColSpan = calculateDateSpan(mission.createdAt, mission.dueDate)
								let tempColSpan = originalColSpan
								if (isResizing && resizeTempPosition !== null) {
									// 리사이즈 시작 시점의 원래 위치 사용 (드래그 중이어도 원래 위치 기준)
									const resizeStartColumn = getResizeStartColumn(mission.id)
									const startColumnIndex = (resizeStartColumn || mission.columnStart || 1) - 1
									tempColSpan = resizeTempPosition - startColumnIndex + 1
								}

								return (
									<div
										key={mission.id}
										style={{
											gridColumnStart: tempColumnStart,
											gridColumnEnd: `span ${tempColSpan}`,
											gridRow: tempSectionIndex + 1,
										}}
									>
										<MissionBlock
											isGoal={mission.isGoal}
											missionNumber={mission.missionNumber}
											title={mission.title}
											progress={mission.progress}
											createdAt={mission.createdAt}
											dueDate={mission.dueDate}
											daysRemaining={mission.daysRemaining}
											status={mission.status}
											participants={mission.participants}
											gridColumnSize={tempColSpan}
											onClick={() => {
												if (!justDraggedRef.current) {
													openMissionModal(mission.id, mission.sectionIndex)
												}
											}}
											onDragStart={e => handleMissionDragStart(mission.id, e)}
											onResizeStart={() => handleMissionResizeStart(mission.id)}
											onStatusChange={newStatus => {
												if (onMissionUpdate) {
													onMissionUpdate(mission.id, { status: newStatus })
												}
											}}
											isDragging={isDragging}
											isResizing={isResizing}
										/>
									</div>
								)
							})}

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
												<PlusBlock onClick={() => {openMissionModal()}} />
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