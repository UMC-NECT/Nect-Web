import { useState } from 'react'
import SearchIcon from '@/assets/icons/sidebar/search.svg?react'
import CloseIcon from '@/assets/icons/sidebar/close.svg?react'

interface ChatSearchHeaderProps {
	onClose?: () => void
	onSearch?: (query: string) => void
}

const ChatSearchHeader = ({ onClose, onSearch }: ChatSearchHeaderProps) => {
	const [searchQuery, setSearchQuery] = useState('')

	const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
		e?.preventDefault()
		onSearch?.(searchQuery)
	}

	return (
		<div className="w-full h-[50px] px-3 py-2.5 bg-white border-b border-neutral-100 flex flex-col justify-center">
			<div className="flex gap-1 items-center h-[30px]">
				{/* 검색 입력 필드 */}
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							handleSearch(e)
						}
					}}
					placeholder="대화 내용 검색"
					className="flex-1 h-[34px] px-2 bg-neutral-50 border border-neutral-100 rounded-md text-neutral-900 label font-medium tracking-[-0.26px] leading-[1.4] placeholder:text-neutral-300 outline-none"
				/>

				{/* 검색 + 닫기 버튼 */}
				<div className="flex justify-start items-center gap-1 shrink-0">
					{/* 검색 버튼 */}
					<button
						onClick={handleSearch}
						className="relative w-7 h-7 rounded-lg shadow-inner-neutral-2 flex justify-center items-center overflow-hidden"
					>
						<SearchIcon className="w-7 h-7 text-neutral-700" />
					</button>
					{/* 닫기 버튼 (메뉴 버튼 대신) */}
					<button
						onClick={onClose}
						className="relative w-7 h-7 rounded-lg shadow-inner-neutral-2 flex justify-center items-center overflow-hidden"
					>
						<CloseIcon className="w-7 h-7 text-neutral-700" />
					</button>
				</div>
			</div>
		</div>
	)
}

export default ChatSearchHeader
