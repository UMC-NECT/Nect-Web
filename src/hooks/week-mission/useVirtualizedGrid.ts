import { useMemo, useState } from 'react'

interface UseVirtualizedGridProps {
    totalItems: number
    itemWidth: number
    containerWidth: number
    overscan?: number // 화면 밖에 추가로 렌더링할 아이템 수
}

export const useVirtualizedGrid = ({
    totalItems,
    itemWidth,
    containerWidth,
    overscan = 5,
}: UseVirtualizedGridProps) => {
    const [scrollLeft, setScrollLeft] = useState(0)

    const visibleRange = useMemo(() => {
        const startIndex = Math.max(0, Math.floor(scrollLeft / itemWidth) - overscan)
        const endIndex = Math.min(
            totalItems - 1,
            Math.ceil((scrollLeft + containerWidth) / itemWidth) + overscan
        )
        return { startIndex, endIndex }
    }, [scrollLeft, itemWidth, containerWidth, totalItems, overscan])

    const visibleItems = useMemo(() => {
        const items: { index: number; offset: number }[] = []
        for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
            items.push({
                index: i,
                offset: i * itemWidth,
            })
        }
        return items
    }, [visibleRange, itemWidth])

    const totalWidth = totalItems * itemWidth
    const beforeWidth = visibleRange.startIndex * itemWidth
    const afterWidth = (totalItems - visibleRange.endIndex - 1) * itemWidth

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollLeft(e.currentTarget.scrollLeft)
    }

    return {
        visibleItems,
        totalWidth,
        beforeWidth,
        afterWidth,
        handleScroll,
        scrollLeft,
        setScrollLeft,
        visibleRange,
    }
}

