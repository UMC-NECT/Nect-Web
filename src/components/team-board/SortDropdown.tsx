import { useState, useRef } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import ChevronDownIcon from '@/assets/icons/common/chevron-down.svg?react'

export type SortOption = 'latest' | 'oldest' | 'name' | 'fileType'

interface SortDropdownProps {
	currentSort: SortOption
	onSortChange: (sort: SortOption) => void
}

const sortOptions: { value: SortOption; label: string }[] = [
	{ value: 'latest', label: '최신 순' },
	{ value: 'oldest', label: '오래된 순' },
	{ value: 'name', label: '이름 순' },
	{ value: 'fileType', label: '파일 형식 순' },
]

const SortDropdown = ({ currentSort, onSortChange }: SortDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useClickOutside(dropdownRef, () => setIsOpen(false), isOpen)

	const currentLabel = sortOptions.find((opt) => opt.value === currentSort)?.label || '최신 순'

	const handleOptionClick = (value: SortOption) => {
		onSortChange(value)
		setIsOpen(false)
	}

	return (
		<div className="relative" ref={dropdownRef}>
			{/* 드롭다운 버튼 */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`bg-neutral-000 rounded-10 pl-4 pr-3 py-2 w-[120px] flex items-center justify-between ${
					isOpen ? 'border border-status-info-cool-gray-deep' : 'border border-neutral-000'
				}`}
			>
				<span className="body-2 font-bold text-neutral-700 tracking-[-0.14px]">{currentLabel}</span>
				<ChevronDownIcon
					className={`w-4 h-4 text-neutral-700 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
				/>
			</button>

			{/* 드롭다운 메뉴 */}
			{isOpen && (
				<div className="absolute top-full bg-neutral-000 border border-status-info-cool-gray-light rounded-10 shadow-drop-neutral-1 overflow-hidden z-50 w-[120px]">
					{sortOptions.map((option) => {
						const isSelected = option.value === currentSort
						return (
							<button
								key={option.value}
								onClick={() => handleOptionClick(option.value)}
								className={`w-[120px] h-[36px] pl-5 pr-3 py-2 text-left body-3 font-medium tracking-[-0.26px] transition-colors ${
									isSelected
										? 'bg-neutral-50 text-primary-500-normal'
										: 'text-neutral-700 hover:bg-neutral-50'
								}`}
							>
								{option.label}
							</button>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default SortDropdown
