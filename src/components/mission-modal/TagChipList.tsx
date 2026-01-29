import { useState } from 'react'
import { cn } from '@/utils/cn'
import { useMissionModalStore, type Person, type Role, type Mission } from '@/stores/mission-modal/missionModalStore'
import PersonTagChip from './PersonTagChip'
import RoleTagChip from './RoleTagChip'
import MissionTagChip from './MissionTagChip'
import SettingIcon from '@/assets/icons/common/setting.svg?react'
import PlusIcon from '@/assets/icons/week-mission/plus.svg?react'

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
}: TagChipListProps) => {
    const {
        persons,
        roles,
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

    const [isEditMode, setIsEditMode] = useState(false)

    const handleSettingClick = () => {
        setIsEditMode(prev => !prev)
    }

    const handlePersonClick = (person: Person) => {
        if (showClearButton && selectedPersons.some(p => p.id === person.id)) {
            removeSelectedPerson(person.id)
        } else {
            addSelectedPerson(person)
        }
        onPersonClick?.(person)
    }

    const handleRoleClick = (role: Role) => {
        if (disabledRoleIds.includes(role.id)) return

        if (showClearButton && selectedRoles.some(r => r.id === role.id)) {
            removeSelectedRole(role.id)
        } else {
            addSelectedRole(role)
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

    const renderPersonChips = () => (
        <div className='flex flex-col gap-2 w-full mt-2 max-h-[316px] overflow-y-auto WorkStatusScrollbar'>
            {persons.map((person) => {
                const isSelected = selectedPersons.some(p => p.id === person.id)

                return (
                    <PersonTagChip
                        key={person.id}
                        personName={person.name}
                        personColor={person.color}
                        personImage={person.image}
                        state={showClearButton && isSelected ? 'clear' : 'default'}
                        onClick={() => handlePersonClick(person)}
                    />
                )
            })}
        </div>
    )

    const getRoleState = (role: Role): 'default' | 'clear' | 'disabled' | 'edit' => {
        const isSelected = selectedRoles.some(r => r.id === role.id)
        const isDisabled = disabledRoleIds.includes(role.id)

        if (isDisabled) return 'disabled'
        if (isEditMode) return 'edit'
        if (showClearButton && isSelected) return 'clear'
        return 'default'
    }

    const renderRoleChips = () => (
        <div className='flex flex-col gap-2 w-full mt-2'>
            {roles.map((role) => (
                <RoleTagChip
                    key={role.id}
                    roleName={role.name}
                    roleColor={role.color}
                    state={getRoleState(role)}
                    onClick={() => handleRoleClick(role)}
                />
            ))}
            {isEditMode && (
                <PlusIcon className='mx-auto hover:cursor-pointer stroke-neutral-300' />
            )}
        </div>
    )

    const renderMissionChips = () => (
        <div className='flex flex-col gap-2.5 w-full mt-2'>
            {missions.map((mission) => (
                <div
                    key={mission.id}
                    onClick={() => handleMissionClick(mission)}
                    className='cursor-pointer'
                >
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
                'flex flex-col w-fit border border-neutral-200 rounded-[6px] px-3.5 pt-2.5 pb-3 shadow-drop-neutral-1',
                className
            )}
        >
            <div className='flex items-center gap-9 justify-between'>
                <p className='pl-0.5 caption-1 font-medium text-neutral-500'>{displayTitle}</p>
                {variant !== 'mission' && (
                    <SettingIcon
                        className='w-4 h-4 hover:cursor-pointer'
                        onClick={handleSettingClick}
                    />
                )}
            </div>
            {renderChips()}
        </div>
    )
}

export default TagChipList
