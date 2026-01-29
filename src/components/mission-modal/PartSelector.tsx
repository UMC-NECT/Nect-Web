import { cn } from '@/utils/cn'
import RoleTagChip from './RoleTagChip'
import type { Role } from '@/stores/mission-modal/missionModalStore'

interface PartSelectorProps {
    selectedRoles?: Role[]
    placeholder?: string
    onRoleRemove?: (roleId: number) => void
    onClick?: () => void
    className?: string
}

const PartSelector = ({
    selectedRoles = [],
    placeholder = '선택해주세요',
    onRoleRemove,
    onClick,
    className,
}: PartSelectorProps) => {
    const hasSelection = selectedRoles.length > 0

    return (
        <div
            className={cn(
                'flex flex-wrap gap-1 min-h-[28px] py-0.5 px-2 rounded-[6px] bg-neutral-50 w-[266px] items-center cursor-pointer',
                'hover:bg-neutral-100 transition-colors',
                'shadow-inner-neutral-2',
                className
            )}
            onClick={onClick}
        >
            {hasSelection ? (
                selectedRoles.map((role) => (
                    <div
                        key={role.id}
                        onClick={(e) => {
                            e.stopPropagation()
                            onRoleRemove?.(role.id)
                        }}
                    >
                        <RoleTagChip
                            roleName={role.name}
                            roleColor={role.color}
                            state='default'
                        />
                    </div>
                ))
            ) : (
                <p className='button-1 font-medium text-neutral-300'>{placeholder}</p>
            )}
        </div>
    )
}

export default PartSelector
