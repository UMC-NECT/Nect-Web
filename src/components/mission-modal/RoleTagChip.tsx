import { cn } from '@/utils/cn'
import { getRoleColorById, getRoleColorByField } from '@/utils/roleColor'
import { getRoleLabelEn } from '@/utils/enumUtils'
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'
import XIcon from '@/assets/icons/common/X-small.svg?react'
import DragIcon from '@/assets/icons/common/drag.svg?react'

interface RoleTagChipProps {
	/** part_id 등. 0이거나 없으면 roleField 기준 getRoleColorByField 사용 */
	roleId?: number
	roleName: string
	/** role_field value (API enum). 있으면 useOnboardingEnums로 label·색상 결정 */
	roleField?: string
	state: 'default' | 'clear' | 'disabled' | 'edit'
	onClick?: (e?: React.MouseEvent) => void
	className?: string
	count?: number
	/** 직무 미선택 등 placeholder 상태일 때 텍스트를 neutral-300으로 표시 */
	isPlaceholder?: boolean
	isLarge?: boolean
}

const RoleTagChip = ({ roleId = 0, roleName, roleField, state, onClick, className, count, isPlaceholder, isLarge }: RoleTagChipProps) => {
	const { roles, roleFields } = useOnboardingEnums()
	// CUSTOM 파트는 parts.label(실제 파트명)을 roleName으로 전달받으므로 roleName 우선, 그 외는 labelEn
	const displayName =
		roleField === 'CUSTOM' ? roleName : roleField ? getRoleLabelEn(roleField, null, roles, roleFields) || roleName : roleName
	const roleColor =
		roleId != null && roleId > 0 ? getRoleColorById(roleId) : (roleField ? getRoleColorByField(roleField, roleFields) : 'bg-roletag-gray')
	const isDisabled = state === 'disabled'
	const isClear = state === 'clear'
	const isEdit = state === 'edit'

	return (
		<div className='flex'>
			{isEdit && <DragIcon />}
			<div
				className={cn(
					'rounded-md py-0.5 w-fit min-h-6 flex items-center gap-1',
					isClear ? 'pl-2 pr-1' : 'px-2',
					isDisabled
						? cn(roleColor, 'bg-[linear-gradient(rgba(255,255,255,0.5),rgba(255,255,255,0.5))]', 'cursor-default')
						: cn(roleColor, 'shadow-drop-neutral-2', 'hover:cursor-pointer', className)
				)}
				onClick={!isDisabled && !isClear ? onClick : undefined}
			>
				<p className={cn('font-medium text-center whitespace-nowrap max-w-full', isDisabled || isPlaceholder ? 'text-neutral-300' : 'text-neutral-700', isLarge ? 'title-2' : 'button-1')}>
					{displayName}
				</p>
				{count && <span className='button-1 text-neutral-700'>({count})</span>}
				{isClear && !isDisabled && <XIcon className='cursor-pointer' onClick={onClick} />}
			</div>
		</div>
	)
}

export default RoleTagChip