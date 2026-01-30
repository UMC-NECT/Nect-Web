import { useEffect, useRef, useState } from 'react'

type ChatMenuType = 'room' | 'file'

interface ChatMenuProps {
	type: ChatMenuType
	// 공통 props
	onClose: () => void
	// Room menu props
	onTurnOffNotification?: () => void
	onInviteContact?: () => void
	onLeaveRoom?: () => void
	// File menu props
	x?: number
	y?: number
	onRegisterToSharedDocs?: () => void
	onDelete?: () => void
}

const ChatMenu = ({
	type,
	onClose,
	onTurnOffNotification,
	onInviteContact,
	onLeaveRoom,
	x,
	y,
	onRegisterToSharedDocs,
	onDelete,
}: ChatMenuProps) => {
	const menuRef = useRef<HTMLDivElement>(null)
	const [position, setPosition] = useState({ x: x || 0, y: y || 0 })

	// 파일 메뉴의 경우 위치 조정
	useEffect(() => {
		if (type === 'file' && x !== undefined && y !== undefined) {
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

			setPosition({ x, y })
			requestAnimationFrame(() => {
				requestAnimationFrame(adjustPosition)
			})
		}
	}, [type, x, y])

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

	// 파일 메뉴
	if (type === 'file') {
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

	// 채팅방 메뉴
	return (
		<>
			{/* 배경 오버레이 */}
			<div
				className="fixed inset-0 z-40"
				onClick={onClose}
			/>
			{/* 메뉴 모달 */}
			<div
				ref={menuRef}
				className="absolute top-[40px] right-0 bg-white rounded-[10px] shadow-drop-neutral-1 py-0.5 z-50 flex flex-col overflow-hidden min-w-[120px]"
			>
				{/* 알림 끄기 */}
				<button
					onClick={() => {
						onTurnOffNotification?.()
						onClose()
					}}
					className="flex items-center pl-5 pr-3 py-2 w-full hover:bg-neutral-50"
				>
					<span className="text-neutral-700 label font-medium tracking-[-0.26px] leading-normal">
						알림 끄기
					</span>
				</button>
				{/* 대화상대 초대 */}
				<button
					onClick={() => {
						onInviteContact?.()
						onClose()
					}}
					className="flex items-center pl-5 pr-3 py-2 w-full hover:bg-neutral-50"
				>
					<span className="text-neutral-700 label font-medium tracking-[-0.26px] leading-normal">
						대화상대 초대
					</span>
				</button>
				{/* 채팅방 나가기 */}
				<button
					onClick={() => {
						onLeaveRoom?.()
						onClose()
					}}
					className="flex items-center pl-5 pr-3 py-2 w-full hover:bg-neutral-50"
				>
					<span className="text-danger-700 label font-medium tracking-[-0.26px] leading-normal">
						채팅방 나가기
					</span>
				</button>
			</div>
		</>
	)
}

export default ChatMenu
