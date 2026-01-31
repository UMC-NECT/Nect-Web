import type { RoleType } from '@/types/mypage/ongoindProject'
import RoleTag from '../../RoleTag'
import SettingIcon from '@/assets/icons/common/setting.svg?react'

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
	if (!isOpen) return null

	const handlePartClick = (partName: RoleType) => {
		onSelect(partName)
		onClose()
	}

	return (
		<div className='absolute top-10 left-0 z-50'>
			<div className='w-30 bg-neutral-000 rounded-6 border border-neutral-200 py-2.5'>
				{/* 헤더 */}
				<div className='flex justify-start items-center gap-7'>
					<span className='body-3 text-neutral-500 pl-3.5'>파트 선택</span>
					<SettingIcon />
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
