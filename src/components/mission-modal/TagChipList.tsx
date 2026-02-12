
import { cn } from '@/utils/cn'
import { useMissionModalStore, type Mission } from '@/stores/mission-modal/missionModalStore'
import { useTeamStore, getRoleDisplayName, type Person, type Role } from '@/stores/teamStore'
import PersonTagChip from './PersonTagChip'
import RoleTagChip from './RoleTagChip'
import MissionTagChip from './MissionTagChip'

type TagChipListVariant = 'person' | 'role' | 'mission'

interface TagChipListProps {
	variant: TagChipListVariant
	title?: string
	className?: string
	onPersonClick?: (person: Person) => void
	onRoleClick?: (role: Role) => void
	onMissionClick?: (mission: Mission) => void
	showClearButton?: boolean
	disabledRoleIds?: number[]
	disabledPersonIds?: number[]
	// 커스텀 선택 상태 지원
	customSelectedPersonIds?: number[]
	customSelectedRoleIds?: number[]
	onPersonSelect?: (person: Person, isSelected: boolean) => void
	onRoleSelect?: (role: Role, isSelected: boolean) => void
	// 필터링 지원
	filterQuery?: string
	filteredPersonIds?: number[]
}

const defaultTitles: Record<TagChipListVariant, string> = {
	person: '담당자 선택',
	role: '파트 선택',
	mission: '미션 선택',
}

const TagChipList = ({
	variant,
	title,
	className,
	onPersonClick,
	onRoleClick,
	onMissionClick,
	showClearButton = false,
	disabledRoleIds = [],
	disabledPersonIds = [],
	customSelectedPersonIds,
	customSelectedRoleIds,
	onPersonSelect,
	onRoleSelect,
	filterQuery = '',
	filteredPersonIds,
}: TagChipListProps) => {
	const { persons, roles } = useTeamStore()
	const {
		missions,
		selectedPersons,
		selectedRoles,
		selectedMission,
		addSelectedPerson,
		removeSelectedPerson,
		addSelectedRole,
		removeSelectedRole,
		setSelectedMission,
	} = useMissionModalStore()

	const displayTitle = title ?? defaultTitles[variant]

	// 커스텀 선택 상태 사용 여부
	const useCustomPersonSelection = customSelectedPersonIds !== undefined
	const useCustomRoleSelection = customSelectedRoleIds !== undefined

	const isPersonSelected = (personId: number) => {
		if (useCustomPersonSelection) {
			return customSelectedPersonIds.includes(personId)
		}
		return selectedPersons.some(p => p.id === personId)
	}

	const isRoleSelected = (roleId: number) => {
		if (useCustomRoleSelection) {
			return customSelectedRoleIds.includes(roleId)
		}
		return selectedRoles.some(r => r.part_id === roleId)
	}

	const handlePersonClick = (person: Person) => {
		if (disabledPersonIds.includes(person.id)) return

		const isSelected = isPersonSelected(person.id)

		if (onPersonSelect) {
			onPersonSelect(person, !isSelected)
		} else if (useCustomPersonSelection) {
			// customSelectedPersonIds만 있고 onPersonSelect가 없는 경우는 무시
		} else {
			if (showClearButton && isSelected) {
				removeSelectedPerson(person.id)
			} else {
				addSelectedPerson(person)
			}
		}
		onPersonClick?.(person)
	}

	const handleRoleClick = (role: Role) => {
		if (disabledRoleIds.includes(role.part_id)) return

		const isSelected = isRoleSelected(role.part_id)

		if (onRoleSelect) {
			onRoleSelect(role, !isSelected)
		} else if (useCustomRoleSelection) {
			// customSelectedRoleIds만 있고 onRoleSelect가 없는 경우는 무시
		} else {
			if (showClearButton && isSelected) {
				removeSelectedRole(role.part_id)
			} else {
				addSelectedRole(role)
			}
		}
		onRoleClick?.(role)
	}

	const handleMissionClick = (mission: Mission) => {
		if (selectedMission?.id === mission.id) {
			setSelectedMission(null)
		} else {
			setSelectedMission(mission)
		}
		onMissionClick?.(mission)
	}

	const getPersonState = (person: Person): 'default' | 'filter' | 'clear' | 'disabled' => {
		const isSelected = isPersonSelected(person.id)
		const isDisabled = disabledPersonIds.includes(person.id)
		const isFiltered = filteredPersonIds?.includes(person.id)

		if (isDisabled) return 'disabled'
		if (showClearButton && isSelected) return 'clear'
		if (isSelected || isFiltered) return 'filter'
		return 'default'
	}

	const renderPersonChips = () => {
		const filteredPersons = filterQuery
			? persons.filter(person => person.name.toLowerCase().includes(filterQuery.toLowerCase()))
			: persons

		return (
			<div className='flex flex-col gap-2 w-full mt-2 max-h-[316px] overflow-y-auto WorkStatusScrollbar'>
				{filteredPersons.map(person => (
					<PersonTagChip
						key={person.id}
						personName={person.name}
						roleId={person.roleId}
						personImage={person.image}
						state={getPersonState(person)}
						onClick={() => handlePersonClick(person)}
					/>
				))}
			</div>
		)
	}

	const getRoleState = (role: Role): 'default' | 'clear' | 'disabled' | 'edit' => {
		const isSelected = isRoleSelected(role.part_id)
		const isDisabled = disabledRoleIds.includes(role.part_id)

		if (isDisabled) return 'disabled'
		if (showClearButton && isSelected) return 'clear'
		return 'default'
	}

	const renderRoleChips = () => (
		<div className='flex flex-col gap-2 w-full mt-2'>
			{roles.map(role => (
				<RoleTagChip
					key={role.part_id}
					roleId={role.part_id}
					roleName={getRoleDisplayName(role)}
					state={getRoleState(role)}
					onClick={() => handleRoleClick(role)}
				/>
			))}
		</div>
	)

	const renderMissionChips = () => (
		<div className='flex flex-col gap-2.5 w-full mt-2'>
			{missions.map(mission => (
				<div key={mission.id} onClick={() => handleMissionClick(mission)} className='cursor-pointer'>
					<MissionTagChip missionNumber={mission.missionNumber} />
				</div>
			))}
		</div>
	)

	const renderChips = () => {
		switch (variant) {
			case 'person':
				return renderPersonChips()
			case 'role':
				return renderRoleChips()
			case 'mission':
				return renderMissionChips()
			default:
				return null
		}
	}

	return (
		<div
			className={cn(
				'flex flex-col w-fit border border-neutral-200 rounded-6 px-3.5 pt-2.5 pb-3 shadow-drop-neutral-1 bg-white',
				className
			)}
		>
			<div className='flex items-center  justify-between'>
				<p className='pl-0.5 caption-1 font-medium text-neutral-500'>{displayTitle}</p>
			</div>
			{renderChips()}
		</div>
	)
}

export default TagChipList
