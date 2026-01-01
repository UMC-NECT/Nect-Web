import { useEffect, useRef } from 'react'

interface UseSyncScrollProps {
	sourceRef: React.RefObject<HTMLDivElement | null>
	targetRef: React.RefObject<HTMLDivElement | null>
	onSync?: (scrollLeft: number) => void
	isDraggingRef?: React.RefObject<boolean> // 드래그 중인지 확인하는 ref
}

/**
 * 두 개의 스크롤 컨테이너를 양방향으로 동기화하는 훅
 */
export const useSyncScroll = ({ sourceRef, targetRef, onSync, isDraggingRef }: UseSyncScrollProps) => {
	const isSyncingRef = useRef(false)

	useEffect(() => {
		const sourceElement = sourceRef.current
		const targetElement = targetRef.current

		if (!sourceElement || !targetElement) return

		const syncToTarget = () => {
			// 드래그 중이면 동기화하지 않음
			if (isSyncingRef.current || isDraggingRef?.current) return

			// 스크롤 위치 차이가 1px 이하면 동기화하지 않음 (무한 루프 방지)
			if (Math.abs(sourceElement.scrollLeft - targetElement.scrollLeft) <= 1) return

			isSyncingRef.current = true
			targetElement.scrollLeft = sourceElement.scrollLeft
			onSync?.(sourceElement.scrollLeft)

			// 다음 프레임에 플래그 리셋
			requestAnimationFrame(() => {
				isSyncingRef.current = false
			})
		}

		const syncToSource = () => {
			// 드래그 중이면 동기화하지 않음
			if (isSyncingRef.current || isDraggingRef?.current) return

			// 스크롤 위치 차이가 1px 이하면 동기화하지 않음
			if (Math.abs(targetElement.scrollLeft - sourceElement.scrollLeft) <= 1) return

			isSyncingRef.current = true
			sourceElement.scrollLeft = targetElement.scrollLeft

			// 다음 프레임에 플래그 리셋
			requestAnimationFrame(() => {
				isSyncingRef.current = false
			})
		}

		sourceElement.addEventListener('scroll', syncToTarget, { passive: true })
		targetElement.addEventListener('scroll', syncToSource, { passive: true })

		// 초기 동기화
		syncToTarget()

		return () => {
			sourceElement.removeEventListener('scroll', syncToTarget)
			targetElement.removeEventListener('scroll', syncToSource)
		}
	}, [sourceRef, targetRef, onSync, isDraggingRef])
}

