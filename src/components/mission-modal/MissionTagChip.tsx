interface MissionTagChipProps {
    missionNumber: number
}

const MissionTagChip = ({ missionNumber }: MissionTagChipProps) => {
    return (
        <div className='bg-primary-150-light rounded-6 py-0.5 px-2 w-20 h-6 shadow-drop-neutral-2 hover:cursor-pointer'>
            <p className='button-1 font-medium text-neutral-700 text-center'>
                Mission {missionNumber}
            </p>
        </div>
    )
}

export default MissionTagChip