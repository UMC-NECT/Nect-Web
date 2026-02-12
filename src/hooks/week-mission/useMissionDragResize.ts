import { useState, useCallback, useEffect, useRef } from 'react'
import type { Mission } from '@/types/mission'
import { calculateDateSpan, parseDate } from '@/utils/dateUtils'
import { addDays } from 'date-fns'

const ITEM_WIDTH = 80 // WeekDates와 동일한 날짜 박스 너비

interface UseMissionDragResizeProps {
	dates: Date[]
	sections: { id: number; title: string }[]
	positionedMissions: (Mission & { columnStart?: number | null })[]
	gridContainerRef: React.RefObject<HTMLDivElement | null>
	boardScrollRef: React.RefObject<HTMLDivElement | null>
	beforeWidth?: number // 가상화 앞쪽 여백
	onMissionUpdate?: (missionId: number, updates: { start_date?: string; dead_line?: string; sectionIndex?: number }) => void
}

export const useMissionDragResize = ({
	dates,
	sections,
	positionedMissions,
	gridContainerRef,
	boardScrollRef,
	beforeWidth = 0,
	onMissionUpdate,
}: UseMissionDragResizeProps) => {
	const [draggingMissionId, setDraggingMissionId] = useState<number | null>(null)
	const [resizingMissionId, setResizingMissionId] = useState<number | null>(null)
	// 드래그 중 임시 위치 (시각적 피드백용)
	const [dragTempPosition, setDragTempPosition] = useState<{ columnIndex: number; sectionIndex: number } | null>(null)
	// 리사이즈 중 임시 위치 (시각적 피드백용)
	const [resizeTempPosition, setResizeTempPosition] = useState<number | null>(null)
	// 드래그/리사이즈 시작 시점의 원래 위치 저장
	const dragStartPositionRef = useRef<{ columnStart: number; sectionIndex: number; start_date: string; dead_line: string; clickOffset: number } | null>(null)
	const resizeStartPositionRef = useRef<{ columnStart: number; dueDateColumnIndex: number } | null>(null)
	// 드래그/리사이즈 직후 클릭 방지용 ref
	const justDraggedRef = useRef<boolean>(false)
	// 마우스 다운 위치 (드래그 임계값 체크용)
	const mouseDownPositionRef = useRef<{ x: number; y: number } | null>(null)
	// 실제 드래그가 발생했는지 여부
	const hasDraggedRef = useRef<boolean>(false)
	// 드래그 종료 시점의 '의도된' 행(클램프 전) - 프로세스 블록을 1번째 줄에 놓았는지 판단용
	const lastRawSectionIndexRef = useRef<number>(0)
	const DRAG_THRESHOLD = 5

	// 최신 값을 참조하기 위한 ref
	const positionedMissionsRef = useRef(positionedMissions)
	const onMissionUpdateRef = useRef(onMissionUpdate)
	const sectionsRef = useRef(sections)
	const beforeWidthRef = useRef(beforeWidth)

	useEffect(() => {
		positionedMissionsRef.current = positionedMissions
		onMissionUpdateRef.current = onMissionUpdate
		sectionsRef.current = sections
		beforeWidthRef.current = beforeWidth
	}, [positionedMissions, onMissionUpdate, sections, beforeWidth])

	// 그리드 좌표를 날짜 인덱스로 변환 (스냅 기능)
	const getGridColumnFromX = useCallback(
		(x: number, snapToRight: boolean = false): number | null => {
			if (!gridContainerRef.current || !boardScrollRef.current) {
				return null
			}
			const scrollRect = boardScrollRef.current.getBoundingClientRect()
			const scrollLeft = boardScrollRef.current.scrollLeft

			if (x < scrollRect.left || x > scrollRect.right) {
				return null
			}

			const relativeX = x - scrollRect.left + scrollLeft

			let columnIndex: number
			if (snapToRight) {
				const cellIndex = Math.floor(relativeX / ITEM_WIDTH)
				const offsetInCell = relativeX % ITEM_WIDTH
				columnIndex = offsetInCell < ITEM_WIDTH / 2 ? cellIndex - 1 : cellIndex
			} else {
				columnIndex = Math.round(relativeX / ITEM_WIDTH)
			}

			if (columnIndex < 0) {
				return null
			}

			if (columnIndex >= dates.length) {
				return dates.length - 1
			}

			return columnIndex
		},
		[dates.length, gridContainerRef, boardScrollRef]
	)

	// 날짜 인덱스를 날짜 문자열로 변환
	const getDateStringFromIndex = useCallback(
		(index: number): string | null => {
			if (index < 0 || index >= dates.length) return null
			const date = dates[index]
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			return `${year}.${month}.${day}`
		},
		[dates]
	)

	// 드래그 핸들러
	const handleMissionDragStart = useCallback(
		(missionId: number, e: React.MouseEvent) => {
			const mission = positionedMissionsRef.current.find(m => m.process_id === missionId)
			if (mission && mission.columnStart) {
				const clickColumnIndex = getGridColumnFromX(e.clientX)
				const missionStartColumnIndex = mission.columnStart - 1
				const clickOffset = clickColumnIndex !== null ? clickColumnIndex - missionStartColumnIndex : 0

				dragStartPositionRef.current = {
					columnStart: mission.columnStart,
					sectionIndex: mission.sectionIndex,
					start_date: mission.start_date,
					dead_line: mission.dead_line,
					clickOffset,
				}
			}
			// 마우스 시작 위치 저장
			mouseDownPositionRef.current = { x: e.clientX, y: e.clientY }
			hasDraggedRef.current = false
			setDraggingMissionId(missionId)
			setDragTempPosition(null)
		},
		[getGridColumnFromX]
	)

	const handleMissionDrag = useCallback(
		(e: MouseEvent, missionId: number) => {
			if (!draggingMissionId || draggingMissionId !== missionId || !dragStartPositionRef.current) {
				return
			}

			// 드래그 임계값 체크 - 충분히 이동했을 때만 드래그로 인식
			if (mouseDownPositionRef.current && !hasDraggedRef.current) {
				const dx = Math.abs(e.clientX - mouseDownPositionRef.current.x)
				const dy = Math.abs(e.clientY - mouseDownPositionRef.current.y)
				if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
					return // 아직 임계값을 넘지 않음
				}
				hasDraggedRef.current = true // 임계값을 넘었으므로 드래그로 인식
			}

			const clickColumnIndex = getGridColumnFromX(e.clientX)
			if (clickColumnIndex === null) {
				return
			}

			const columnIndex = clickColumnIndex - dragStartPositionRef.current.clickOffset

			const gridRect = gridContainerRef.current?.getBoundingClientRect()
			if (!gridRect) {
				return
			}
			const relativeY = e.clientY - gridRect.top
			const rowHeight = 130 + 26
			const rawSectionIndex = Math.max(0, Math.min(sectionsRef.current.length, Math.floor(relativeY / rowHeight)))
			lastRawSectionIndexRef.current = rawSectionIndex
			let sectionIndex = rawSectionIndex
			// 프로세스 블록(1번째 줄 이하)은 1번째 줄(위크미션 Task, sectionIndex 0)로 시각적 이동 불가
			if (dragStartPositionRef.current.sectionIndex > 0) {
				sectionIndex = Math.max(1, sectionIndex)
			}

			setDragTempPosition({ columnIndex, sectionIndex })
		},
		[draggingMissionId, getGridColumnFromX, gridContainerRef]
	)

	const handleMissionDragEnd = useCallback(() => {
		// 실제 드래그가 발생한 경우에만 업데이트
		if (hasDraggedRef.current && draggingMissionId && dragTempPosition && onMissionUpdateRef.current && dragStartPositionRef.current) {
			const { columnIndex, sectionIndex } = dragTempPosition
			// 프로세스 블록을 1번째 줄(위크미션 Task)에 드롭한 경우: API 호출 없이 원래 위치 유지 (의도된 행은 lastRawSectionIndexRef에 저장됨)
			const isProcessBlock = dragStartPositionRef.current.sectionIndex > 0
			const droppedOnFirstRow = isProcessBlock && lastRawSectionIndexRef.current === 0
			if (droppedOnFirstRow) {
				// onMissionUpdate 호출하지 않음 → API 요청 없음
			} else {
				const newCreatedAt = getDateStringFromIndex(columnIndex)

				if (newCreatedAt) {
					const originalSpan = calculateDateSpan(
						dragStartPositionRef.current.start_date,
						dragStartPositionRef.current.dead_line
					)

					const newCreatedAtDate = parseDate(newCreatedAt)
					const newDueDateDate = addDays(newCreatedAtDate, originalSpan - 1)
					const newDueDateIndex = dates.findIndex(date =>
						date.getFullYear() === newDueDateDate.getFullYear() &&
						date.getMonth() === newDueDateDate.getMonth() &&
						date.getDate() === newDueDateDate.getDate()
					)
					const newDeadLine = newDueDateIndex !== -1 ? getDateStringFromIndex(newDueDateIndex) : null

					onMissionUpdateRef.current(draggingMissionId, {
						start_date: newCreatedAt,
						dead_line: newDeadLine || dragStartPositionRef.current.dead_line,
						sectionIndex,
					})
				}
			}
		}

		// 실제 드래그가 발생한 경우에만 클릭 방지
		if (hasDraggedRef.current) {
			justDraggedRef.current = true
			setTimeout(() => {
				justDraggedRef.current = false
			}, 100)
		}

		mouseDownPositionRef.current = null
		hasDraggedRef.current = false
		dragStartPositionRef.current = null
		lastRawSectionIndexRef.current = 0
		setDragTempPosition(null)
		setDraggingMissionId(null)
	}, [draggingMissionId, dragTempPosition, getDateStringFromIndex, dates])

	// 리사이즈 핸들러
	const handleMissionResizeStart = useCallback((missionId: number) => {
		const mission = positionedMissionsRef.current.find(m => m.process_id === missionId)
		if (mission && mission.columnStart) {
			const startCol = mission.columnStart - 1
			const colSpan = calculateDateSpan(mission.start_date, mission.dead_line)
			const dueDateColumnIndex = startCol + colSpan - 1

			resizeStartPositionRef.current = {
				columnStart: mission.columnStart,
				dueDateColumnIndex,
			}
		}
		setResizingMissionId(missionId)
		setResizeTempPosition(null)
	}, [])

	const handleMissionResize = useCallback(
		(e: MouseEvent, missionId: number) => {
			if (!resizingMissionId || resizingMissionId !== missionId || !resizeStartPositionRef.current) {
				return
			}

			const columnIndex = getGridColumnFromX(e.clientX, true)
			if (columnIndex === null) {
				return
			}

			const startColumnIndex = resizeStartPositionRef.current.columnStart - 1

			if (columnIndex < startColumnIndex) {
				return
			}

			setResizeTempPosition(columnIndex)
		},
		[resizingMissionId, getGridColumnFromX]
	)

	const handleMissionResizeEnd = useCallback(() => {
		if (resizingMissionId && resizeTempPosition !== null && onMissionUpdateRef.current) {
			const newDueDate = getDateStringFromIndex(resizeTempPosition)

			if (newDueDate) {
				onMissionUpdateRef.current(resizingMissionId, {
					dead_line: newDueDate,
				})
			}
		}

		// 리사이즈 직후 클릭 방지
		justDraggedRef.current = true
		setTimeout(() => {
			justDraggedRef.current = false
		}, 100)

		resizeStartPositionRef.current = null
		setResizeTempPosition(null)
		setResizingMissionId(null)
	}, [resizingMissionId, resizeTempPosition, getDateStringFromIndex])

	// 전역 마우스 이벤트 리스너
	useEffect(() => {
		if (draggingMissionId) {
			const handleMouseMove = (e: MouseEvent) => handleMissionDrag(e, draggingMissionId)
			const handleMouseUp = () => handleMissionDragEnd()

			window.addEventListener('mousemove', handleMouseMove)
			window.addEventListener('mouseup', handleMouseUp)

			return () => {
				window.removeEventListener('mousemove', handleMouseMove)
				window.removeEventListener('mouseup', handleMouseUp)
			}
		}
	}, [draggingMissionId, handleMissionDrag, handleMissionDragEnd])

	useEffect(() => {
		if (resizingMissionId) {
			const handleMouseMove = (e: MouseEvent) => handleMissionResize(e, resizingMissionId)
			const handleMouseUp = () => handleMissionResizeEnd()

			window.addEventListener('mousemove', handleMouseMove)
			window.addEventListener('mouseup', handleMouseUp)

			return () => {
				window.removeEventListener('mousemove', handleMouseMove)
				window.removeEventListener('mouseup', handleMouseUp)
			}
		}
	}, [resizingMissionId, handleMissionResize, handleMissionResizeEnd])

	// 리사이즈 시작 위치를 MissionBoard에서 사용할 수 있도록 반환
	const getResizeStartColumn = useCallback(
		(missionId: number): number | null => {
			if (resizingMissionId === missionId && resizeStartPositionRef.current) {
				return resizeStartPositionRef.current.columnStart
			}
			return null
		},
		[resizingMissionId]
	)

	return {
		draggingMissionId,
		resizingMissionId,
		dragTempPosition,
		resizeTempPosition,
		getResizeStartColumn,
		handleMissionDragStart,
		handleMissionResizeStart,
		justDraggedRef,
	}
}
