import { useState } from 'react'
import { PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import type { MissionStatus } from '@/types/missionStatus'
import { useWorkStatusStore } from '@/stores/work-status/workStatusStore'
import type { WorkStatusItem } from '@/stores/work-status/workStatusStore'

interface UseWorkStatusDragAndDropProps {
	statuses: MissionStatus[]
	getFilteredItemsByStatus: (status: MissionStatus) => WorkStatusItem[]
	/** 상태(컬럼) 변경 시 콜백. orderedProcessIds = 목적지 컬럼의 새 순서(이동한 카드 포함) */
	onStatusChange?: (
		activeId: number,
		prevStatus: MissionStatus,
		newStatus: MissionStatus,
		options: { orderedProcessIds: number[]; newIndex: number }
	) => void
	/** 같은 컬럼 내 순서만 변경 시 콜백. orderedProcessIds = 해당 컬럼의 새 순서 */
	onOrderChange?: (activeId: number, status: MissionStatus, orderedProcessIds: number[]) => void
}

export const useWorkStatusDragAndDrop = ({
	statuses,
	getFilteredItemsByStatus,
	onStatusChange,
}: UseWorkStatusDragAndDropProps) => {
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
				const destItems = getFilteredItemsByStatus(newStatus)
				const orderedProcessIds = [activeId, ...destItems.map(i => i.id)]
				onStatusChange?.(activeId, activeStatus, newStatus, { orderedProcessIds, newIndex: 0 })
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
						const idsWithoutActive = items.map(i => i.id).filter(id => id !== activeId)
						const orderedProcessIds = [...idsWithoutActive.slice(0, newIndex), activeId, ...idsWithoutActive.slice(newIndex)]
						onOrderChange?.(activeId, targetStatus, orderedProcessIds)
						moveWorkStatusItem(activeId, targetStatus, newIndex)
					}
				} else {
					// 다른 컬럼으로 이동
					const destItems = getFilteredItemsByStatus(targetStatus)
					const orderedProcessIds = [...destItems.map(i => i.id).slice(0, newIndex), activeId, ...destItems.map(i => i.id).slice(newIndex)]
					onStatusChange?.(activeId, activeStatus, targetStatus, { orderedProcessIds, newIndex })
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
