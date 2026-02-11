import { useState } from 'react'
import ChevronLeftIcon from '@/assets/icons/common/chevron-left.svg?react'
import SearchIcon from '@/assets/icons/sidebar/search.svg?react'
import MenuIcon from '@/assets/icons/sidebar/menu.svg?react'
import NewMessageIcon from '@/assets/icons/sidebar/new-message.svg?react'
import CloseIcon from '@/assets/icons/sidebar/close.svg?react'

type ChatHeaderType = 'list' | 'room' | 'search'

interface ChatHeaderProps {
	type: ChatHeaderType
	// List type props
	title?: string
	onNewMessage?: () => void
	showActions?: boolean // 오른쪽 버튼 표시 여부
	// Room type props
	roomName?: string
	memberCount?: number
	role?: string
	onBack?: () => void
	onMenu?: () => void
	// Search type props
	onClose?: () => void
	onSearch?: (query: string) => void
	// Common props
	onSearchClick?: () => void
}

const ChatHeader = ({
	type,
	title = 'Nect 메세지함',
	onNewMessage,
	showActions = true, // 기본값은 true
	roomName,
	memberCount,
	role,
	onBack,
	onMenu,
	onClose,
	onSearch,
	onSearchClick,
}: ChatHeaderProps) => {
	const [searchQuery, setSearchQuery] = useState('')

	const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
		e?.preventDefault()
		onSearch?.(searchQuery)
	}

	// 검색 헤더
	if (type === 'search') {
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
						{/* 닫기 버튼 */}
						<button
							onClick={() => {
								// X 아이콘 클릭 시 입력한 검색어도 함께 초기화
								setSearchQuery('')
								onClose?.()
							}}
							className="relative w-7 h-7 rounded-lg shadow-inner-neutral-2 flex justify-center items-center overflow-hidden"
						>
							<CloseIcon className="w-7 h-7 text-neutral-700" />
						</button>
					</div>
				</div>
			</div>
		)
	}

	// 채팅방 헤더
	if (type === 'room') {
		return (
			<div className="w-full h-[50px] px-3 py-2.5 bg-white border-b border-neutral-100 flex flex-col justify-center items-start gap-2.5">
				<div className="self-stretch flex justify-between items-center">
					{/* 왼쪽: 뒤로가기 버튼 + 방 이름 + 멤버 수 */}
					<div className="flex justify-start items-center gap-2">
						{/* 뒤로가기 버튼 */}
						<button
							onClick={onBack}
							className="relative w-7 h-7 rounded-lg shadow-inner-neutral-2 flex justify-center items-center overflow-hidden"
						>
							<ChevronLeftIcon className="w-4 h-4 text-neutral-700" />
						</button>
						{/* 방 이름 + 멤버 수 / 역할 */}
						<div className="flex items-center gap-1.5">
							<div className="max-w-[150px] text-neutral-900 title-3 font-semibold line-clamp-1">
								{roomName}
							</div>
							{memberCount !== undefined && (
								<div className="text-neutral-900 button-1 font-medium opacity-65 line-clamp-1">
									{memberCount}
								</div>
							)}
							{role && memberCount === undefined && (
								<div className="text-neutral-900 button-1 font-medium opacity-65 line-clamp-1">
									{role}
								</div>
							)}
						</div>
					</div>

					{/* 오른쪽: 검색 + 메뉴 버튼 */}
					<div className="flex justify-start items-center gap-1">
						{/* 검색 버튼 */}
						<button
							onClick={onSearchClick}
							className="relative w-7 h-7 rounded-lg shadow-inner-neutral-2 flex justify-center items-center overflow-hidden"
						>
							<SearchIcon className="w-7 h-7 text-neutral-700" />
						</button>
						{/* 메뉴 버튼 */}
						<button
							onClick={onMenu}
							className="relative w-7 h-7 rounded-lg shadow-inner-neutral-2 flex justify-center items-center overflow-hidden"
						>
							<MenuIcon className="w-7 h-7 text-neutral-700" />
						</button>
					</div>
				</div>
			</div>
		)
	}

	// 채팅 목록 헤더
	return (
		<div className="w-[380px] h-[50px] px-3 py-2.5 bg-white border-b border-neutral-100 flex flex-col justify-center items-start gap-2.5">
			<div className="self-stretch flex justify-between items-center">
				{/* 왼쪽: 타이틀 */}
				<div className="flex justify-start items-center">
					<div className="h-5 flex justify-start items-center ml-3">
						<div className="max-w-44 justify-center text-neutral-900 title-3 font-semibold line-clamp-1">
							{title}
						</div>
					</div>
				</div>

				{/* 오른쪽: 검색 + 새 메시지 버튼 */}
				{showActions && (
					<div className="flex justify-start items-center gap-1">
						{/* 검색 버튼 */}
						<button
							onClick={onSearchClick}
							className="relative w-7 h-7 rounded-lg shadow-inner-neutral-2 flex justify-center items-center overflow-hidden"
						>
							<SearchIcon className="w-7 h-7 text-neutral-700" />
						</button>
						{/* 새 메시지 버튼 */}
						<button
							onClick={onNewMessage}
							className="w-7 h-7 relative overflow-hidden flex justify-center items-center"
						>
							<NewMessageIcon className="w-7 h-7 text-neutral-700" />
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default ChatHeader
