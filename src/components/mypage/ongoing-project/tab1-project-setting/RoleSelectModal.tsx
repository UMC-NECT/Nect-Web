import { useRef } from 'react'
import type { RoleType } from '@/types/mypage/ongoindProject'
import RoleTagChip from '@/components/mission-modal/RoleTagChip'
import { useTeamMembersStore } from '@/stores/useTeamMembersStore'
import { useClickOutside } from '@/hooks/useClickOutside'

interface IRoleSelectModal {
	isOpen: boolean
	onClose: () => void
	onSelect: (part: RoleType) => void
	availableRoles?: string[]
}

const RoleSelectModal = ({ isOpen, onClose, onSelect, availableRoles }: IRoleSelectModal) => {
	const modalRef = useRef<HTMLDivElement>(null)
	const teamMembersByRole = useTeamMembersStore(state => state.teamMembersByRole)

	// availableRoles가 있으면 우선 사용, 없으면 Zustand 스토어 폴백
	const roles = availableRoles && availableRoles.length > 0
		? availableRoles
		: teamMembersByRole.map(item => item.role)

	// 모달 바깥 클릭 시 닫기
	useClickOutside(modalRef, onClose, isOpen)

	// (모달 핸들러) 파트 선택 클릭
	const handlePartClick = (partName: RoleType) => {
		onSelect(partName)
		onClose()
	}

	if (!isOpen) return null

	return (
		<div ref={modalRef} className='absolute top-10 left-0 z-50'>
			<div className='min-w-30 w-fit bg-neutral-000 rounded-6 border border-neutral-200 py-2.5'>
				{/* 헤더 */}
				<div className='flex justify-start items-center gap-7'>
					<span className='body-3 text-neutral-500 pl-3.5'>파트 선택</span>
				</div>

				{/* 파트 목록 */}
				<div className='flex flex-col gap-2.5 pl-3.5 pr-2 pt-2'>
					{roles.map((role, index) => (
						<div key={role} onClick={() => handlePartClick(role as RoleType)} className='cursor-pointer hover:opacity-80 transition-opacity'>
							<RoleTagChip
								roleId={index + 1}
								roleName={role}
								roleField={role}
								state='default'
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default RoleSelectModal
