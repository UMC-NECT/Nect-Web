import { useState } from 'react'
import { PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import type { MissionStatus } from '@/types/missionStatus'
import { useWorkStatusStore } from '@/stores/work-status/workStatusStore'
import type { WorkStatusItem } from '@/stores/work-status/workStatusStore'

interface UseWorkStatusDragAndDropProps {
	statuses: MissionStatus[]
	getFilteredItemsByStatus: (status: MissionStatus) => WorkStatusItem[]
}

export const useWorkStatusDragAndDrop = ({ statuses, getFilteredItemsByStatus }: UseWorkStatusDragAndDropProps) => {
	const [activeId, setActiveId] = useState<number | null>(null)
	const { moveWorkStatusItem } = useWorkStatusStore()

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	)

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as number)
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		setActiveId(null)

		if (!over) return

		const activeId = active.id as number
		const overId = over.id

		// 현재 아이템이 속한 컬럼 찾기
		let activeStatus: MissionStatus | undefined
		for (const status of statuses) {
			const items = getFilteredItemsByStatus(status)
			if (items.some(item => item.id === activeId)) {
				activeStatus = status
				break
			}
		}

		if (!activeStatus) return

		// over.id가 status인 경우 (컬럼에 직접 드롭)
		if (typeof overId === 'string' && statuses.includes(overId as MissionStatus)) {
			const newStatus = overId as MissionStatus
			if (activeStatus !== newStatus) {
				// 다른 컬럼으로 이동
				moveWorkStatusItem(activeId, newStatus, 0)
			}
			return
		}

		// over.id가 다른 아이템인 경우 (아이템 위에 드롭)
		if (typeof overId === 'number') {
			// 타겟 아이템이 속한 컬럼 찾기
			let targetStatus: MissionStatus | undefined
			for (const status of statuses) {
				const items = getFilteredItemsByStatus(status)
				if (items.some(item => item.id === overId)) {
					targetStatus = status
					break
				}
			}

			if (!targetStatus) return

			const items = getFilteredItemsByStatus(targetStatus)
			const newIndex = items.findIndex(item => item.id === overId)

			if (newIndex !== -1) {
				if (activeStatus === targetStatus) {
					// 같은 컬럼 내에서 순서 변경
					const oldIndex = items.findIndex(item => item.id === activeId)
					if (oldIndex !== newIndex) {
						// 이동 방향에 따라 인덱스 조정
						const adjustedIndex = oldIndex < newIndex ? newIndex : newIndex
						moveWorkStatusItem(activeId, targetStatus, adjustedIndex)
					}
				} else {
					// 다른 컬럼으로 이동
					moveWorkStatusItem(activeId, targetStatus, newIndex)
				}
			}
		}
	}

	return {
		activeId,
		sensors,
		handleDragStart,
		handleDragEnd,
	}
}
