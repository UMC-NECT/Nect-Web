import { cn } from '@/utils/cn'
import IssueOffIcon from '@/assets/icons/common/checkbox/issue-off.svg?react'
import IssueOnIcon from '@/assets/icons/common/checkbox/issue-on.svg?react'

type FeedbackItemState = 'default' | 'complete' | 'disabled'

interface FeedbackItemProps {
    partName: string
    authorName: string
    content: string
    timestamp?: string
    state?: FeedbackItemState
    onClick?: () => void
}

const FeedbackItem = ({
    partName,
    authorName,
    content,
    timestamp,
    state = 'default',
    onClick,
}: FeedbackItemProps) => {
    const isComplete = state === 'complete'
    const isDisabled = state === 'disabled'

    const renderCheckbox = () => {
        if (isComplete) {
            return <IssueOnIcon className='w-5 h-5 cursor-pointer' onClick={onClick} />
        }
        if (isDisabled) {
            return <IssueOffIcon className='w-5 h-5 opacity-50 grayscale cursor-not-allowed' />
        }
        return <IssueOffIcon className='w-5 h-5 cursor-pointer' onClick={onClick} />
    }

    return (
        <div className='flex gap-2 items-start py-1.5 w-[292px]'>
            {/* Checkbox */}
            <div className='flex items-center py-0.5'>
                {renderCheckbox()}
            </div>

            {/* Content */}
            <div className='flex flex-col gap-0.5 w-[264px]'>
                {/* Header */}
                <div className='flex items-center justify-between w-full'>
                    <div className='flex gap-1.5 items-center'>
                        <p
                            className={cn(
                                'body-3 font-medium overflow-hidden text-ellipsis',
                                isDisabled ? 'text-neutral-300' : isComplete ? 'text-neutral-400' : 'text-neutral-900'
                            )}
                        >
                            {partName}
                        </p>
                        <div className='w-0.5 h-3 bg-neutral-300 rounded-[6px]' />
                        <p
                            className={cn(
                                'body-3 font-medium overflow-hidden text-ellipsis',
                                isDisabled ? 'text-neutral-300' : isComplete ? 'text-neutral-400' : 'text-neutral-900'
                            )}
                        >
                            {authorName}
                        </p>
                    </div>
                    {!isDisabled && timestamp && (
                        <p
                            className={cn(
                                'caption-2 text-right',
                                isComplete ? 'text-neutral-300' : 'text-neutral-400'
                            )}
                        >
                            {timestamp}
                        </p>
                    )}
                </div>

                {/* Feedback content */}
                <p
                    className={cn(
                        'body-3 font-medium w-full whitespace-pre-wrap',
                        isDisabled ? 'text-neutral-300' : isComplete ? 'text-neutral-400' : 'text-neutral-900'
                    )}
                >
                    {content}
                </p>
            </div>
        </div>
    )
}

export default FeedbackItem
