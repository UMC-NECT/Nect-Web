import MissionTagChip from '@/components/mission-modal/MissionTagChip'
import RoleTagChip from '@/components/mission-modal/RoleTagChip'
import PersonTagChip from '@/components/mission-modal/PersonTagChip'
import TagChipList from '@/components/mission-modal/TagChipList'

const TestPage = () => {
    return (
        <div className='flex flex-row flex-wrap gap-10 p-10'>
            {/* 개별 Chip 테스트 */}
            <div className='flex flex-col gap-2'>
                <p className='text-sm font-medium text-neutral-600 mb-2'>개별 Chip 테스트</p>
                <MissionTagChip missionNumber={1} />
                <RoleTagChip roleName='PM' roleColor='bg-roletag-purple' state='default' />
                <RoleTagChip roleName='PM' roleColor='bg-roletag-purple' state='clear' />
                <RoleTagChip roleName='PM' roleColor='bg-roletag-purple' state='disabled' />
                <PersonTagChip personName='John Doe' personColor='bg-roletag-blue' personImage='https://placehold.co/24x24' state='default' />
                <PersonTagChip personName='John Doe' personColor='bg-roletag-blue' personImage='https://placehold.co/24x24' state='clear' />
            </div>

            <div className='flex flex-col gap-2'>
                {/* TagChipList - Person */}
                <TagChipList variant='person' />

                {/* TagChipList - Role */}
                <TagChipList variant='role' />

                {/* TagChipList - Mission */}
                <TagChipList variant='mission' />

                {/* TagChipList - Person with showClearButton */}
                <TagChipList variant='person' title='담당자 선택 (Clear 모드)' showClearButton />

                {/* TagChipList - Role with showClearButton */}
                <TagChipList variant='role' title='역할 선택 (Clear 모드)' showClearButton />

                {/* TagChipList - Role with disabled */}
                <TagChipList variant='role' title='역할 선택 (Disabled)' disabledRoleIds={[1, 3]} />
            </div>


        </div>
    )
}

export default TestPage