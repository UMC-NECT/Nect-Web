import { useRef } from 'react'
import type { RoleType } from '@/types/mypage/ongoindProject'
import RoleTag from '../../RoleTag'
import SettingIcon from '@/assets/icons/common/setting.svg?react'
import { MOCK_TEAM_MEMBERS_BY_ROLE } from '@/mocks/ongoingProjectData'
import { usePartSettingsModal } from '@/stores/usePartSettingsModal'
import { useClickOutside } from '@/hooks/useClickOutside'

interface RoleValue {
	role: RoleType
}

interface IRoleSelectModal {
	isOpen: boolean
	onClose: () => void
	values: RoleValue[]
	onSelect: (part: RoleType) => void
}

const RoleSelectModal = ({ isOpen, onClose, values, onSelect }: IRoleSelectModal) => {
	const modalRef = useRef<HTMLDivElement>(null)
	const openPartSettings = usePartSettingsModal(state => state.open)

	// 모달 바깥 클릭 시 닫기
	useClickOutside(modalRef, onClose, isOpen)

	// 파트 설정 모달 열기
	const handleOpenPartSettings = () => {
		openPartSettings(MOCK_TEAM_MEMBERS_BY_ROLE)
	}

	// 멤버 클릭시, 모달 뜨도록 (추후 홈에서 모달 구현해주면 수정 예정)
	const handlePartClick = (partName: RoleType) => {
		onSelect(partName)
		onClose()
	}

	if (!isOpen) return null

	return (
		<div ref={modalRef} className='absolute top-10 left-0 z-50'>
			<div className='w-30 bg-neutral-000 rounded-6 border border-neutral-200 py-2.5'>
				{/* 헤더 */}
				<div className='flex justify-start items-center gap-7'>
					<span className='body-3 text-neutral-500 pl-3.5'>파트 선택</span>
					<SettingIcon
						onClick={handleOpenPartSettings}
						className='w-4 h-4 text-neutral-700 cursor-pointer hover:opacity-70'
					/>
				</div>

				{/* 파트 목록 */}
				<div className='flex flex-col gap-2.5 pl-3.5 pr-2 pt-2'>
					{values.map(item => (
						<RoleTag
							key={item.role}
							role={item.role}
							showTotal={false}
							onClick={() => handlePartClick(item.role)}
							className='cursor-pointer hover:opacity-80 transition-opacity'
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default RoleSelectModal
