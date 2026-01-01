import { useCallback, useRef, useState, useEffect } from 'react'

interface UseDragScrollProps {
	scrollRef: React.RefObject<HTMLDivElement | null>
}

export const useDragScroll = ({ scrollRef }: UseDragScrollProps) => {
	const [isDragging, setIsDragging] = useState(false)
	const isDraggingRef = useRef(false) // ref로 드래그 상태 관리 (동기화 훅에서 사용)
	const startXRef = useRef(0)
	const startScrollLeftRef = useRef(0)

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (!scrollRef.current) return
			isDraggingRef.current = true
			setIsDragging(true)
			startXRef.current = e.pageX
			startScrollLeftRef.current = scrollRef.current.scrollLeft
			e.preventDefault()
		},
		[scrollRef]
	)

	// document 레벨에서 이벤트 리스너 등록
	useEffect(() => {
		if (!isDragging) return

		const handleMouseMove = (e: MouseEvent) => {
			if (!scrollRef.current || !isDraggingRef.current) return
			e.preventDefault()
			const deltaX = e.pageX - startXRef.current
			const walk = deltaX * 2 // 스크롤 속도 조절
			scrollRef.current.scrollLeft = startScrollLeftRef.current - walk
		}

		const handleMouseUp = () => {
			isDraggingRef.current = false
			setIsDragging(false)
		}

		document.addEventListener('mousemove', handleMouseMove, { passive: false })
		document.addEventListener('mouseup', handleMouseUp)

		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isDragging, scrollRef])

	return {
		isDragging,
		isDraggingRef,
		handleMouseDown,
		handleMouseUp: () => {
			isDraggingRef.current = false
			setIsDragging(false)
		},
	}
}

