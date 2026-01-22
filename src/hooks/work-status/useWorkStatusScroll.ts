import { useState, useRef, useEffect } from 'react'

export const useWorkStatusScroll = () => {
	const [isScrolling, setIsScrolling] = useState(false)
	const scrollContainerRef = useRef<HTMLDivElement>(null)
	const scrollTimeoutRef = useRef<number | null>(null)

	useEffect(() => {
		const container = scrollContainerRef.current
		if (!container) return

		const handleScroll = () => {
			setIsScrolling(true)

			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current)
			}

			scrollTimeoutRef.current = setTimeout(() => {
				setIsScrolling(false)
			}, 150)
		}

		container.addEventListener('scroll', handleScroll, { passive: true })
		container.addEventListener('wheel', handleScroll, { passive: true })

		return () => {
			container.removeEventListener('scroll', handleScroll)
			container.removeEventListener('wheel', handleScroll)
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current)
			}
		}
	}, [])

	return {
		isScrolling,
		scrollContainerRef,
	}
}
