import { cn } from '@/utils/cn'
import XIcon from '@/assets/icons/common/X-small.svg?react'
import DragIcon from '@/assets/icons/common/drag.svg?react'

interface RoleTagChipProps {
	roleName: string
	roleColor: string
	state: 'default' | 'clear' | 'disabled' | 'edit'
	onClick?: (e?: React.MouseEvent) => void
}

const RoleTagChip = ({ roleName, roleColor, state, onClick }: RoleTagChipProps) => {
	const isDisabled = state === 'disabled'
	const isClear = state === 'clear'
	const isEdit = state === 'edit'

	return (
		<div className='flex'>
			{isEdit && (
				<DragIcon />
			)}
			<div
				className={cn(
					'rounded-md py-0.5 w-fit h-6 flex items-center gap-1',
					isClear ? 'pl-2 pr-1' : 'px-2',
					isDisabled
						? cn(roleColor,'bg-[linear-gradient(rgba(255,255,255,0.5),rgba(255,255,255,0.5))]', 'cursor-default')
						: cn(roleColor, 'shadow-drop-neutral-2', 'hover:cursor-pointer'
						)
				)}
			>
				<p
					className={cn(
						'button-1 font-medium text-center',
						isDisabled ? 'text-neutral-300' : 'text-neutral-700'
					)}
				>
					{roleName}
				</p>
				{isClear && !isDisabled && (
					<XIcon className='cursor-pointer' onClick={onClick} />
				)}
			</div>
		</div>
	)
}

export default RoleTagChip