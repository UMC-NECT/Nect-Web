import ChevronLeftIcon from '@/assets/icons/common/chevron-left.svg?react'
import ChevronRightIcon from '@/assets/icons/common/chevron-right.svg?react'

interface BoardPaginationProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

const BoardPagination = ({ currentPage, totalPages, onPageChange }: BoardPaginationProps) => {
	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1)
		}
	}

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1)
		}
	}

	const handlePageClick = (page: number) => {
		onPageChange(page)
	}

	// 페이지 번호 생성
	// 1장에 10개까지, 10페이지까지는 화살표 없음, 11페이지 이상부터 화살표 표시
	const getPageNumbers = () => {
		const pages: number[] = []
		
		// 전체 페이지가 10개 이하면 모두 표시
		if (totalPages <= 10) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i)
			}
		} else {
			// 11페이지 이상일 때는 현재 페이지 기준으로 표시
			// 최대 10개 페이지 번호 표시
			const maxVisible = 10
			let start = Math.max(1, currentPage - 4)
			let end = Math.min(totalPages, start + maxVisible - 1)

			if (end - start < maxVisible - 1) {
				start = Math.max(1, end - maxVisible + 1)
			}

			for (let i = start; i <= end; i++) {
				pages.push(i)
			}
		}

		return pages
	}

	const pageNumbers = getPageNumbers()
	const showLeftArrow = currentPage > 1
	const showRightArrow = currentPage < totalPages

	return (
		<div className="flex items-center justify-center">
			{/* 왼쪽 영역 - 화살표 또는 빈 공간 */}
			<div className="w-6 h-6 flex items-center justify-center">
				{showLeftArrow && (
					<button
						onClick={handlePrevious}
						className="flex items-center justify-center w-6 h-6 cursor-pointer group"
					>
						<ChevronLeftIcon className="w-6 h-6 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
					</button>
				)}
			</div>

			{/* 페이지 번호 - 항상 중앙 정렬 */}
			<div className="flex gap-4 items-center mx-2.5">
				{pageNumbers.map((page) => (
					<button
						key={page}
						onClick={() => handlePageClick(page)}
						className={`relative flex items-center justify-center rounded-xl w-[30px] h-[30px] body-2 font-bold text-neutral-900 transition-colors ${
							page === currentPage
								? 'bg-neutral-100 shadow-inner-neutral-2'
								: 'hover:bg-neutral-100 hover:shadow-inner-neutral-2'
						}`}
					>
						{page}
						{/* 모든 페이지 번호에 inner shadow 적용 */}
						{page !== currentPage && (
							<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-inner-neutral-2" />
						)}
					</button>
				))}
			</div>

			{/* 오른쪽 영역 - 화살표 또는 빈 공간 */}
			<div className="w-6 h-6 flex items-center justify-center">
				{showRightArrow && (
					<button
						onClick={handleNext}
						className="flex items-center justify-center w-6 h-6 cursor-pointer transition-colors group"
					>
						<ChevronRightIcon className="w-6 h-6 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
					</button>
				)}
			</div>
		</div>
	)
}

export default BoardPagination
