import { useEffect, useRef, useMemo, useCallback, useState } from 'react'
import { useWeekDates } from '@/hooks/week-mission/useWeekDates'
import { parseDate, calculateDateSpan } from '@/utils/dateUtils'
import { useVirtualizedGrid } from '@/hooks/week-mission/useVirtualizedGrid'
import { useDragScroll } from '@/hooks/week-mission/useDragScroll'
import { useSyncScroll } from '@/hooks/week-mission/useSyncScroll'
import { getDate } from 'date-fns'
import MissionBlock from './MissionBlock'

const ITEM_WIDTH = 54 // WeekDates와 동일한 날짜 박스 너비

interface Mission {
    id: string
    isGoal?: boolean
    missionNumber: number
    title: string
    progress: number
    createdAt: string // "2025.11.17" 형식
    dueDate: string // "2025.11.30" 형식
    daysRemaining: number
    status: 'planning' | 'in_progress' | 'completed'
    sectionIndex: number // 0-3 사이의 섹션 인덱스
    participants?: string[]
    onClick?: () => void
}

interface MissionBoardProps {
    missions: Mission[]
    sections?: string[] // 섹션 제목 배열 (기본: 4개)
}

const MissionBoard = ({ missions, sections = ['섹션 1', '섹션 2', '섹션 3', '섹션 4'] }: MissionBoardProps) => {
    // 공유 스크롤 컨테이너 ref
    const boardScrollRef = useRef<HTMLDivElement>(null)
    const weekDatesRef = useRef<HTMLDivElement>(null)
    const { dates, totalDates, itemWidth, initialScrollPosition, handleScroll } = useWeekDates(weekDatesRef)
    const [containerWidth, setContainerWidth] = useState(0)
    const isInitializedRef = useRef(false)

    // 드래그 스크롤 훅
    const weekDatesDrag = useDragScroll({ scrollRef: weekDatesRef })
    const boardDrag = useDragScroll({ scrollRef: boardScrollRef })

    // WeekDates와 MissionBoard 스크롤 동기화
    // 드래그 중에는 동기화하지 않도록 isDraggingRef 전달
    useSyncScroll({
        sourceRef: weekDatesRef,
        targetRef: boardScrollRef,
        onSync: (scrollLeft) => setVirtualScrollLeft(scrollLeft),
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
            const index = dates.findIndex((date) => isSameDate(date, startDate))

            if (index === -1) {
                console.warn(`Date not found in dates array: ${createdAt}. Total dates: ${dates.length}`)
                if (dates.length > 0) {
                    console.log('First date:', dates[0])
                    console.log('Last date:', dates[dates.length - 1])
                }
            }

            return index !== -1 ? index + 1 : null // grid-column은 1부터 시작
        },
        [dates, isSameDate]
    )

    // MissionBlock들을 grid 위치에 맞게 배치
    const positionedMissions = useMemo(() => {
        return missions.map((mission) => {
            const columnStart = getMissionColumnStart(mission.createdAt)
            if (!columnStart) {
                console.warn(`Mission ${mission.id}: Could not find date ${mission.createdAt} in dates array`)
            }
            return {
                ...mission,
                columnStart,
            }
        })
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
    const { visibleItems, totalWidth, beforeWidth, afterWidth, handleScroll: handleVirtualScroll, visibleRange, setScrollLeft: setVirtualScrollLeft } =
        useVirtualizedGrid({
            totalItems: totalDates,
            itemWidth,
            containerWidth: containerWidth || 1000, // 초기값 설정
            overscan: 10,
        })

    // 초기 스크롤 위치 설정
    useEffect(() => {
        if (boardScrollRef.current && !isInitializedRef.current && initialScrollPosition > 0) {
            requestAnimationFrame(() => {
                if (boardScrollRef.current) {
                    boardScrollRef.current.scrollLeft = initialScrollPosition
                    setVirtualScrollLeft(initialScrollPosition)
                    isInitializedRef.current = true
                }
            })
        }
    }, [initialScrollPosition, setVirtualScrollLeft])

    // 스크롤 이벤트 핸들러 (드래그 중이 아닐 때만 weekOffset 업데이트)
    const combinedHandleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        handleVirtualScroll(e)
        // 드래그 중이 아닐 때만 handleScroll 호출 (weekOffset 업데이트)
        if (!boardDrag.isDraggingRef.current && !weekDatesDrag.isDraggingRef.current) {
            handleScroll()
        }
    }

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
        containerWidth: containerWidth || 1000,
        overscan: 10,
    })

    return (
        <div className='flex flex-col gap-0'>
            {/* WeekDates 컴포넌트 */}
            <div
                ref={weekDatesRef}
                className='flex items-center gap-0 overflow-x-auto cursor-grab active:cursor-grabbing'
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                }}
                onMouseDown={weekDatesDrag.handleMouseDown}
                onMouseUp={weekDatesDrag.handleMouseUp}
                onScroll={(e) => {
                    handleDateVirtualScroll(e)
                    handleScroll()
                }}
            >
                {/* 가상화: 앞쪽 여백 */}
                {dateBeforeWidth > 0 && <div style={{ width: `${dateBeforeWidth}px`, flexShrink: 0 }} />}

                {/* 가상화: 보이는 아이템만 렌더링 */}
                {dateVisibleItems.map(({ index }) => {
                    if (index >= dates.length) return null
                    const date = dates[index]
                    const day = getDate(date)
                    const isSunday = date.getDay() === 0

                    return (
                        <div key={index} className='h-6 relative shrink-0 w-[54px] flex items-center justify-center'>
                            <p
                                className={`font-medium text-[13px] leading-gutter text-center ${
                                    isSunday ? 'text-[#fc3333]' : 'text-[#333]'
                                }`}
                            >
                                {day}
                            </p>
                        </div>
                    )
                })}

                {/* 가상화: 뒤쪽 여백 */}
                {dateAfterWidth > 0 && <div style={{ width: `${dateAfterWidth}px`, flexShrink: 0 }} />}

                {/* 전체 너비를 위한 숨겨진 div */}
                <div style={{ width: `${dateTotalWidth}px`, height: '1px', opacity: 0, pointerEvents: 'none' }} />
            </div>

            {/* 그리드 영역 - 4개 섹션 */}
            <div
                ref={boardScrollRef}
                className='overflow-x-auto cursor-grab active:cursor-grabbing'
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                }}
                onMouseDown={boardDrag.handleMouseDown}
                onMouseUp={boardDrag.handleMouseUp}
                onScroll={combinedHandleScroll}
            >
                <div
                    className='grid gap-0 shrink-0 relative'
                    style={{
                        gridTemplateColumns: `repeat(${totalDates}, ${ITEM_WIDTH}px)`,
                        gridTemplateRows: `repeat(${sections.length}, minmax(100px, auto))`,
                        width: `${totalWidth}px`,
                    }}
                >
                    {/* 가상화: 앞쪽 여백 */}
                    {beforeWidth > 0 && (
                        <div
                            style={{
                                gridColumn: `1 / ${Math.ceil(beforeWidth / ITEM_WIDTH) + 1}`,
                                gridRow: `1 / ${sections.length + 1}`,
                            }}
                        />
                    )}

                    {/* 가상화: 보이는 세로선만 렌더링 */}
                    {visibleItems.map(({ index }) => {
                        const dateIndex = index
                        if (dateIndex >= dates.length) return null

                        return sections.map((_, sectionIndex) => (
                            <div
                                key={`line-${dateIndex}-${sectionIndex}`}
                                className='border-r border-neutral-200'
                                style={{
                                    gridColumn: dateIndex + 1,
                                    gridRow: sectionIndex + 1,
                                }}
                            />
                        ))
                    })}

                    {/* MissionBlock 배치 - 가상화 범위 내의 것만 (또는 containerWidth가 0이면 모두 표시) */}
                    {positionedMissions
                        .filter((mission) => {
                            if (!mission.columnStart) {
                                return false
                            }
                            // containerWidth가 0이거나 초기 렌더링이면 모두 표시 (가상화 비활성화)
                            if (containerWidth === 0) return true

                            // visibleRange가 없으면 모두 표시
                            if (!visibleRange || visibleRange.startIndex === undefined) return true

                            const startIdx = mission.columnStart - 1
                            const endIdx = startIdx + calculateDateSpan(mission.createdAt, mission.dueDate) - 1
                            return (
                                (startIdx >= visibleRange.startIndex && startIdx <= visibleRange.endIndex) ||
                                (endIdx >= visibleRange.startIndex && endIdx <= visibleRange.endIndex) ||
                                (startIdx < visibleRange.startIndex && endIdx > visibleRange.endIndex)
                            )
                        })
                        .map((mission) => {
                            if (!mission.columnStart) return null

                            const colSpan = calculateDateSpan(mission.createdAt, mission.dueDate)

                            return (
                                <div
                                    key={mission.id}
                                    style={{
                                        gridColumnStart: mission.columnStart,
                                        gridColumnEnd: `span ${colSpan}`,
                                        gridRow: mission.sectionIndex + 1,
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
                                        onClick={mission.onClick}
                                    />
                                </div>
                            )
                        })}

                    {/* 가상화: 뒤쪽 여백 */}
                    {afterWidth > 0 && (
                        <div
                            style={{
                                gridColumn: `${Math.floor((totalWidth - afterWidth) / ITEM_WIDTH) + 1} / ${totalDates + 1}`,
                                gridRow: `1 / ${sections.length + 1}`,
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default MissionBoard

