import { useRef } from 'react'
import type { RoleType } from '@/types/mypage/ongoindProject'
import RoleTag from '../../RoleTag'
import SettingIcon from '@/assets/icons/common/setting.svg?react'
import { usePartSettingsModal } from '@/stores/usePartSettingsModal'
import { useTeamMembersStore } from '@/stores/useTeamMembersStore'
import { useClickOutside } from '@/hooks/useClickOutside'

interface IRoleSelectModal {
	isOpen: boolean
	onClose: () => void
	onSelect: (part: RoleType) => void
}

const RoleSelectModal = ({ isOpen, onClose, onSelect }: IRoleSelectModal) => {
	const modalRef = useRef<HTMLDivElement>(null)
	const openPartSettings = usePartSettingsModal(state => state.open)
	const teamMembersByRole = useTeamMembersStore(state => state.teamMembersByRole)

	// 모달 바깥 클릭 시 닫기
	useClickOutside(modalRef, onClose, isOpen)

	// (버튼 핸들러) 파트 설정
	const handleSettingsClick = () => {
		openPartSettings(teamMembersByRole)
	}

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
					<SettingIcon
						onClick={handleSettingsClick}
						className='w-4 h-4 text-neutral-700 cursor-pointer hover:opacity-70'
					/>
				</div>

				{/* 파트 목록 */}
				<div className='flex flex-col gap-2.5 pl-3.5 pr-2 pt-2'>
					{teamMembersByRole.map(item => (
						<RoleTag
							key={item.role}
							role={item.role as RoleType}
							showTotal={false}
							onClick={() => handlePartClick(item.role as RoleType)}
							className='cursor-pointer hover:opacity-80 transition-opacity'
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default RoleSelectModal
