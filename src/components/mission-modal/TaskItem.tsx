import { cn } from '@/utils/cn'
import PrimaryOffIcon from '@/assets/icons/common/checkbox/primary-off.svg?react'
import PrimaryOnIcon from '@/assets/icons/common/checkbox/primary-on.svg?react'
import MoreVerticalIcon from '@/assets/icons/week-mission/more-vertical.svg?react'

interface TaskItemProps {
    content: string
    isComplete?: boolean
    onClick?: () => void
    onMenuClick?: () => void
}

const TaskItem = ({
    content,
    isComplete = false,
    onClick,
    onMenuClick,
}: TaskItemProps) => {
    return (
        <div className='flex gap-2 items-center py-1.5 w-[318px]'>
            {/* Checkbox */}
            {isComplete ? (
                <PrimaryOnIcon className='w-5 h-5 shrink-0 cursor-pointer' onClick={onClick} />
            ) : (
                <PrimaryOffIcon className='w-5 h-5 shrink-0 cursor-pointer' onClick={onClick} />
            )}

            {/* Task content */}
            <div className='flex items-center flex-1 min-w-0'>
                <p
                    className={cn(
                        'body-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap flex-1',
                        isComplete ? 'text-neutral-400' : 'text-neutral-900'
                    )}
                >
                    {content}
                </p>
            </div>

            {/* Menu icon */}
            <div
                className='w-6 h-6 flex items-center justify-center shrink-0 cursor-pointer'
                onClick={onMenuClick}
            >
                <MoreVerticalIcon className='w-6 h-6' />
            </div>
        </div>
    )
}

export default TaskItem
