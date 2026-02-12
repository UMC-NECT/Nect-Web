import { cn } from '@/utils/cn'
import { getRoleColorById } from '@/utils/roleColor'
import { getRoleLabel } from '@/utils/enumUtils'
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'
import XIcon from '@/assets/icons/common/X-small.svg?react'
import DragIcon from '@/assets/icons/common/drag.svg?react'

interface RoleTagChipProps {
	roleId: number
	roleName: string
	/** role_field value (API enum). 있으면 useOnboardingEnums로 label·색상 결정 */
	roleField?: string
	state: 'default' | 'clear' | 'disabled' | 'edit'
	onClick?: (e?: React.MouseEvent) => void
	className?: string
	count?: number
	/** 직무 미선택 등 placeholder 상태일 때 텍스트를 neutral-300으로 표시 */
	isPlaceholder?: boolean
}

const RoleTagChip = ({ roleId, roleName, roleField, state, onClick, className, count, isPlaceholder }: RoleTagChipProps) => {
	const { roles, roleFields } = useOnboardingEnums()
	const displayName = roleField ? getRoleLabel(roleField, roles, roleFields) || roleName : roleName
	const roleColor = getRoleColorById(roleId)
	const isDisabled = state === 'disabled'
	const isClear = state === 'clear'
	const isEdit = state === 'edit'

	return (
		<div className='flex'>
			{isEdit && <DragIcon />}
			<div
				className={cn(
					'rounded-md py-0.5 w-fit h-6 flex items-center gap-1',
					isClear ? 'pl-2 pr-1' : 'px-2',
					isDisabled
						? cn(roleColor, 'bg-[linear-gradient(rgba(255,255,255,0.5),rgba(255,255,255,0.5))]', 'cursor-default')
						: cn(roleColor, 'shadow-drop-neutral-2', 'hover:cursor-pointer', className)
				)}
				onClick={!isDisabled && !isClear ? onClick : undefined}
			>
				<p className={cn('button-1 font-medium text-center whitespace-nowrap max-w-full', isDisabled || isPlaceholder ? 'text-neutral-300' : 'text-neutral-700')}>
					{displayName}
				</p>
				{count && <span className='button-1 text-neutral-700'>({count})</span>}
				{isClear && !isDisabled && <XIcon className='cursor-pointer' onClick={onClick} />}
			</div>
		</div>
	)
}

export default RoleTagChip