interface ITeamMemberModal {
	onClose: () => void
	onChangeRole: () => void
	onSetLeader: () => void
	onKickMember: () => void
	position?: { top: number; left: number }
}

const TeamMemberModal = ({ onClose, onChangeRole, onSetLeader, onKickMember, position }: ITeamMemberModal) => {
	return (
		<>
			{/* 백드롭 */}
			<div className='fixed inset-0 z-40' onClick={onClose} />

			{/* 드롭다운 메뉴 */}
			<div
				className='fixed z-50 w-34.5 bg-neutral-000 rounded-10 shadow-drop-neutral-1 overflow-hidden'
				style={position ? { top: position.top, left: position.left } : undefined}
			>
				{/* 파트 변경 */}
				<button
					type='button'
					onClick={() => {
						onChangeRole()
						onClose()
					}}
					className='w-full text-left pl-5 py-2 text-[13px] font-medium text-neutral-900 hover:bg-neutral-100'
				>
					파트 변경
				</button>

				{/* 파트장 설정 (Lead) */}
				<button
					type='button'
					onClick={() => {
						onSetLeader()
						onClose()
					}}
					className='w-full text-left pl-5 py-2 text-[13px] font-medium text-neutral-900 hover:bg-neutral-100'
				>
					파트장 설정 (Lead)
				</button>

				{/* 팀원 강퇴 */}
				<button
					type='button'
					onClick={() => {
						onKickMember()
						onClose()
					}}
					className='w-full text-left pl-5 py-2 text-[13px] font-medium text-danger-700 hover:bg-neutral-100'
				>
					팀원 강퇴
				</button>
			</div>
		</>
	)
}

export default TeamMemberModal
