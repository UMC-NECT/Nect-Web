import ChevronLeftIcon from '@/assets/icons/common/chevron-left.svg?react'
import SearchIcon from '@/assets/icons/sidebar/search.svg?react'
import MenuIcon from '@/assets/icons/sidebar/menu.svg?react'

interface ChatRoomHeaderProps {
	roomName: string
	memberCount?: number
	role?: string
	onBack?: () => void
	onSearch?: () => void
	onMenu?: () => void
}

const ChatRoomHeader = ({ roomName, memberCount, role, onBack, onSearch, onMenu }: ChatRoomHeaderProps) => {
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
						<div className="max-w-[150px] text-neutral-900 title-3 font-medium line-clamp-1">
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
						onClick={onSearch}
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

export default ChatRoomHeader
