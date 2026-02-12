import { cn } from '@/utils/cn'
import RoleTagChip from './RoleTagChip'
import PersonTagChip from './PersonTagChip'
import type { Role, Person } from '@/stores/teamStore'

type PartSelectorVariant = 'role' | 'person'

interface PartSelectorProps {
	variant?: PartSelectorVariant
	selectedRoles?: Role[]
	selectedPersons?: Person[]
	placeholder?: string
	onRoleRemove?: (roleId: number) => void
	onPersonRemove?: (personId: number) => void
	onClick?: () => void
	className?: string
}

const PartSelector = ({
	variant = 'role',
	selectedRoles = [],
	selectedPersons = [],
	placeholder = '선택해주세요',
	onRoleRemove,
	onPersonRemove,
	onClick,
	className,
}: PartSelectorProps) => {
	const hasSelection = variant === 'role' ? selectedRoles.length > 0 : selectedPersons.length > 0

	return (
		<div
			className={cn(
				'flex flex-wrap gap-1 min-h-[28px] py-0.5 rounded-6 w-[266px] items-center cursor-pointer',
				!hasSelection && 'bg-neutral-50 hover:bg-neutral-100 shadow-inner-neutral-2',
				'transition-colors',
                'hover:bg-neutral-100',
				className
			)}
			onClick={onClick}
		>
			{hasSelection ? (
				variant === 'role' ? (
					selectedRoles.map(role => (
						<div
							key={role.part_id}
							onClick={e => {
								e.stopPropagation()
								onRoleRemove?.(role.part_id)
							}}
						>
							<RoleTagChip
								roleId={role.part_id}
								roleName={role.part_label ?? role.custom_role_field_name ?? ''}
								state='clear'
							/>
						</div>
					))
				) : (
					selectedPersons.map(person => (
						<div
							key={person.id}
							onClick={e => {
								e.stopPropagation()
								onPersonRemove?.(person.id)
							}}
						>
							<PersonTagChip
								personName={person.name}
								roleId={person.roleId}
								personImage={person.image}
								state='default'
							/>
						</div>
					))
				)
			) : (
				<p className='button-1 font-normal text-neutral-300 px-2'>{placeholder}</p>
			)}
		</div>
	)
}

export default PartSelector
