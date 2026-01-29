import ChevronLeftIcon from '@/assets/icons/common/chevron-left.svg?react'
import SearchIcon from '@/assets/icons/sidebar/search.svg?react'
import NewMessageIcon from '@/assets/icons/sidebar/new-message.svg?react'

interface ChatMessageHeaderProps {
	title?: string
	onBack?: () => void
	onSearch?: () => void
	onNewMessage?: () => void
}

const ChatMessageHeader = ({ title = 'Nect 메세지함', onBack, onSearch, onNewMessage }: ChatMessageHeaderProps) => {
	return (
		<div className="w-[380px] h-[50px] px-3 py-2.5 bg-white border-b border-neutral-100 flex flex-col justify-start items-start gap-2.5">
			<div className="self-stretch flex justify-between items-center">
				{/* 왼쪽: 뒤로가기 버튼 + 타이틀 */}
				<div className="flex justify-start items-center gap-2">
					{/* 뒤로가기 버튼 */}
					<button
						onClick={onBack}
						className="relative w-7 h-7 p-1 rounded-lg shadow-inner-neutral-2 flex justify-center items-center"
					>
						<ChevronLeftIcon className="w-4 h-4 text-neutral-700" />
					</button>
					{/* 타이틀 */}
					<div className="h-5 flex justify-start items-center gap-1.5">
						<div className="max-w-44 justify-center text-neutral-900 title-3 font-medium line-clamp-1">
							{title}
						</div>
					</div>
				</div>

				{/* 오른쪽: 검색 + 새 메시지 버튼 */}
				<div className="flex justify-start items-center gap-1">
					{/* 검색 버튼 */}
					<button
						onClick={onSearch}
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
			</div>
		</div>
	)
}

export default ChatMessageHeader
