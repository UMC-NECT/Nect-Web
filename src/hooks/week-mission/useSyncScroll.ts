import { useEffect, useRef } from 'react'

interface UseSyncScrollProps {
	sourceRef: React.RefObject<HTMLDivElement | null>
	targetRef: React.RefObject<HTMLDivElement | null>
	onSync?: (scrollLeft: number) => void
	isDraggingRef?: React.RefObject<boolean> // 드래그 중인지 확인하는 ref
}

/**
 * 두 개의 스크롤 컨테이너를 양방향으로 동기화하는 훅.
 * onSync는 ref에 담아 effect 의존성에서 제외해, 매 렌더마다 effect가 재실행되며 스크롤이 덮어씌워지는 것을 방지.
 */
export const useSyncScroll = ({ sourceRef, targetRef, onSync, isDraggingRef }: UseSyncScrollProps) => {
	const isSyncingRef = useRef(false)
	const onSyncRef = useRef(onSync)
	onSyncRef.current = onSync

	useEffect(() => {
		const sourceElement = sourceRef.current
		const targetElement = targetRef.current

		if (!sourceElement || !targetElement) return

		const syncToTarget = () => {
			if (isSyncingRef.current || isDraggingRef?.current) return
			if (Math.abs(sourceElement.scrollLeft - targetElement.scrollLeft) <= 1) return

			isSyncingRef.current = true
			targetElement.scrollLeft = sourceElement.scrollLeft
			onSyncRef.current?.(sourceElement.scrollLeft)

			requestAnimationFrame(() => {
				isSyncingRef.current = false
			})
		}

		const syncToSource = () => {
			if (isSyncingRef.current || isDraggingRef?.current) return
			if (Math.abs(targetElement.scrollLeft - sourceElement.scrollLeft) <= 1) return

			isSyncingRef.current = true
			sourceElement.scrollLeft = targetElement.scrollLeft

			requestAnimationFrame(() => {
				isSyncingRef.current = false
			})
		}

		sourceElement.addEventListener('scroll', syncToTarget, { passive: true })
		targetElement.addEventListener('scroll', syncToSource, { passive: true })

		// 마운트 시 한 번만 초기 동기화
		syncToTarget()

		return () => {
			sourceElement.removeEventListener('scroll', syncToTarget)
			targetElement.removeEventListener('scroll', syncToSource)
		}
	}, [sourceRef, targetRef, isDraggingRef])
}

