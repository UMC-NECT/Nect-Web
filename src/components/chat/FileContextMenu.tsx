import { useEffect, useRef, useState } from 'react'

interface FileContextMenuProps {
	x: number
	y: number
	onClose: () => void
	onRegisterToSharedDocs?: () => void
	onDelete?: () => void
}

const FileContextMenu = ({
	x,
	y,
	onClose,
	onRegisterToSharedDocs,
	onDelete,
}: FileContextMenuProps) => {
	const menuRef = useRef<HTMLDivElement>(null)
	const [position, setPosition] = useState({ x, y })

	useEffect(() => {
		// 메뉴가 화면 밖으로 나가지 않도록 위치 조정
		const adjustPosition = () => {
			if (menuRef.current) {
				const rect = menuRef.current.getBoundingClientRect()
				const viewportWidth = window.innerWidth
				const viewportHeight = window.innerHeight
				
				let adjustedX = x
				let adjustedY = y

				// 오른쪽 경계 체크
				if (x + rect.width > viewportWidth) {
					adjustedX = viewportWidth - rect.width - 10
				}

				// 아래쪽 경계 체크
				if (y + rect.height > viewportHeight) {
					adjustedY = viewportHeight - rect.height - 10
				}

				// 왼쪽 경계 체크
				if (adjustedX < 10) {
					adjustedX = 10
				}

				// 위쪽 경계 체크
				if (adjustedY < 10) {
					adjustedY = 10
				}

				setPosition({ x: adjustedX, y: adjustedY })
			}
		}

		// 초기 위치 설정 후 조정
		setPosition({ x, y })
		// 다음 프레임에서 조정 (렌더링 후)
		requestAnimationFrame(() => {
			requestAnimationFrame(adjustPosition)
		})
	}, [x, y])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				onClose()
			}
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleEscape)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [onClose])

	return (
		<>
			{/* 배경 오버레이 */}
			<div
				className="fixed inset-0 z-40"
				onClick={onClose}
			/>
			{/* 컨텍스트 메뉴 */}
			<div
				ref={menuRef}
				className="fixed bg-white rounded-[10px] shadow-drop-neutral-1 py-0.5 z-50 flex flex-col overflow-hidden min-w-[120px]"
				style={{
					left: `${position.x}px`,
					top: `${position.y}px`,
				}}
			>
				{/* 공유 문서함 등록 */}
				<button
					onClick={() => {
						onRegisterToSharedDocs?.()
						onClose()
					}}
					className="flex items-center pl-5 pr-3 py-2 w-full hover:bg-neutral-50"
				>
					<span className="text-neutral-700 label font-medium tracking-[-0.26px] leading-normal">
						공유 문서함 등록
					</span>
				</button>
				{/* 삭제 */}
				<button
					onClick={() => {
						onDelete?.()
						onClose()
					}}
					className="flex items-center pl-5 pr-3 py-2 w-full hover:bg-neutral-50"
				>
					<span className="text-danger-700 label font-medium tracking-[-0.26px] leading-normal">
						삭제
					</span>
				</button>
			</div>
		</>
	)
}

export default FileContextMenu
