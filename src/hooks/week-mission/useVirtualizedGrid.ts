import { useVirtualizer } from '@tanstack/react-virtual'

interface UseVirtualizedGridProps {
	totalItems: number
	itemWidth: number
	overscan?: number // 화면 밖에 추가로 렌더링할 아이템 수
	scrollElementRef?: React.RefObject<HTMLElement | null>
}

export const useVirtualizedGrid = ({ totalItems, itemWidth, overscan = 5, scrollElementRef }: UseVirtualizedGridProps) => {
	// react-virtual의 useVirtualizer 사용
	const virtualizer = useVirtualizer({
		count: totalItems,
		getScrollElement: () => scrollElementRef?.current || null,
		estimateSize: () => itemWidth,
		horizontal: true,
		overscan,
	})

	const virtualItems = virtualizer.getVirtualItems()

	// visibleItems 형식으로 변환 (기존 코드와 호환성 유지)
	const visibleItems = virtualItems.map(virtualItem => ({
		index: virtualItem.index,
		offset: virtualItem.start,
	}))

	const totalWidth = virtualizer.getTotalSize()
	// beforeWidth는 첫 번째 가상 아이템의 인덱스 * itemWidth로 계산 (더 정확함)
	const beforeWidth = virtualItems.length > 0 ? virtualItems[0].index * itemWidth : 0
	// afterWidth는 마지막 아이템 이후의 공간
	const afterWidth = virtualItems.length > 0 ? (totalItems - virtualItems[virtualItems.length - 1].index - 1) * itemWidth : 0

	const visibleRange =
		virtualItems.length > 0
			? {
					startIndex: virtualItems[0].index,
					endIndex: virtualItems[virtualItems.length - 1].index,
				}
			: { startIndex: 0, endIndex: 0 }

	const handleScroll = () => {
		// react-virtual이 자동으로 스크롤을 감지하므로 별도 처리 불필요
		// 하지만 기존 코드와의 호환성을 위해 유지
	}

	const setScrollLeft = (scrollLeft: number) => {
		if (scrollElementRef?.current) {
			scrollElementRef.current.scrollLeft = scrollLeft
		}
	}

	return {
		visibleItems,
		totalWidth,
		beforeWidth,
		afterWidth,
		handleScroll,
		scrollLeft: scrollElementRef?.current?.scrollLeft || 0,
		setScrollLeft,
		visibleRange,
		virtualizer, // react-virtual 인스턴스도 반환 (필요시 사용)
	}
}
