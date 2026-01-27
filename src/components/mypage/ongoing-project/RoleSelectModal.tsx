import RoleTag from '../RoleTag'
import type { RoleType } from './OngoingProject'

type ColorType = 'purple' | 'pink' | 'green' | 'blue'

interface RoleValue {
	role: RoleType
	color: ColorType
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
				<span className='caption-3 text-neutral-500 pl-3.5'>파트 선택</span>

				{/* 파트 목록 */}
				<div className='flex flex-col gap-2.5 pl-3.5 pr-2'>
					{values.map(item => (
						<RoleTag
							key={item.role}
							role={item.role}
							color={item.color}
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
