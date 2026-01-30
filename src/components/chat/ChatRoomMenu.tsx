interface ChatRoomMenuProps {
	onClose?: () => void
	onTurnOffNotification?: () => void
	onInviteContact?: () => void
	onLeaveRoom?: () => void
}

const ChatRoomMenu = ({
	onClose,
	onTurnOffNotification,
	onInviteContact,
	onLeaveRoom,
}: ChatRoomMenuProps) => {
	return (
		<>
			{/* 배경 오버레이 */}
			<div
				className="fixed inset-0 z-40"
				onClick={onClose}
			/>
			{/* 메뉴 모달 */}
			<div className="absolute top-[40px] right-0 bg-white rounded-[10px] shadow-drop-neutral-1 py-0.5 z-50 flex flex-col overflow-hidden min-w-[120px]">
				{/* 알림 끄기 */}
				<button
					onClick={() => {
						onTurnOffNotification?.()
						onClose?.()
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
						onClose?.()
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
						onClose?.()
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

export default ChatRoomMenu
