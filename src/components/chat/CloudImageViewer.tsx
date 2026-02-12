import { useRef, useState } from 'react'
import CloseIcon from '@/assets/icons/sidebar/close.svg?react'
import DownloadIcon from '@/assets/icons/sidebar/download.svg?react'
import MoreIcon from '@/assets/icons/sidebar/more.svg?react'
import ChatMenu from './ChatMenu'

interface CloudImageViewerProps {
	imageUrl: string
	onClose: () => void
	onDownload?: () => void
	onMore?: () => void
	onForward?: () => void
	onDelete?: () => void
}

const CloudImageViewer = ({ imageUrl, onClose, onDownload, onMore, onForward, onDelete }: CloudImageViewerProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const moreButtonRef = useRef<HTMLButtonElement>(null)

	const handleMoreClick = () => {
		setIsMenuOpen(true)
		onMore?.()
	}

	const getMenuPosition = () => {
		if (moreButtonRef.current) {
			const rect = moreButtonRef.current.getBoundingClientRect()
			return {
				x: rect.left,
				y: rect.bottom + 4, // 버튼 아래 4px
			}
		}
		return { x: 0, y: 0 }
	}

	return (
		<>
			<div className="bg-white border border-neutral-200 rounded-xl shadow-drop-neutral-1 p-1 flex flex-col w-full h-full relative">
				<div className="flex flex-1 flex-col gap-[2px] min-h-0">
					{/* 헤더 */}
					<div className="flex items-center justify-between shrink-0">
						{/* 왼쪽: 더보기 + 다운로드 */}
						<div className="flex gap-[6px] items-center">
							{/* 더보기 버튼 */}
							<button
								ref={moreButtonRef}
								onClick={handleMoreClick}
								className="w-[30px] h-[30px] rounded-lg shadow-inner-neutral-2 flex items-center justify-center"
							>
								<MoreIcon className="w-[30px] h-[30px] text-neutral-700" />
							</button>
						
						{/* 다운로드 버튼 */}
						<button
							onClick={onDownload}
							className="w-[30px] h-[30px] rounded-lg shadow-inner-neutral-2 flex items-center justify-center"
						>
							<DownloadIcon className="w-[30px] h-[30px] text-neutral-700" />
						</button>
					</div>
					
					{/* 오른쪽: 닫기 버튼 */}
					<button
						onClick={onClose}
						className="w-[30px] h-[30px] rounded-lg shadow-inner-neutral-2 flex items-center justify-center"
					>
						<CloseIcon className="w-[30px] h-[30px] text-neutral-700" />
					</button>
				</div>
				
				{/* 이미지 */}
				<div className="flex-1 flex items-center justify-center min-h-0 relative">
					<div className="aspect-[432/300] w-full relative">
						<img
							src={imageUrl}
							alt="Cloud image"
							className="absolute inset-0 w-full h-full object-contain"
						/>
					</div>
				</div>
			</div>
		</div>

		{/* 더보기 메뉴 */}
		{isMenuOpen && (
			<ChatMenu
				type="image"
				onClose={() => setIsMenuOpen(false)}
				x={getMenuPosition().x}
				y={getMenuPosition().y}
				onForward={() => {
					onForward?.()
					setIsMenuOpen(false)
				}}
				onDelete={() => {
					onDelete?.()
					setIsMenuOpen(false)
				}}
			/>
		)}
		</>
	)
}

export default CloudImageViewer
