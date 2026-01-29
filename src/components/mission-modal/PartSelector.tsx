import { cn } from '@/utils/cn'
import RoleTagChip from './RoleTagChip'
import PersonTagChip from './PersonTagChip'
import type { Role, Person } from '@/stores/mission-modal/missionModalStore'

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
				'flex flex-wrap gap-1 min-h-[28px] py-0.5 px-2 rounded-[6px] w-[266px] items-center cursor-pointer',
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
							key={role.id}
							onClick={e => {
								e.stopPropagation()
								onRoleRemove?.(role.id)
							}}
						>
							<RoleTagChip roleName={role.name} roleColor={role.color} state='clear' />
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
								personColor={person.color}
								personImage={person.image}
								state='default'
							/>
						</div>
					))
				)
			) : (
				<p className='button-1 font-medium text-neutral-300'>{placeholder}</p>
			)}
		</div>
	)
}

export default PartSelector
