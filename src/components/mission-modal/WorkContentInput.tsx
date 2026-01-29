import { useState } from 'react'
import { cn } from '@/utils/cn'

interface WorkContentInputProps {
    value: string
    onChange: (value: string) => void
    partName?: string
    authorName?: string
    placeholder?: string
    className?: string
}

const WorkContentInput = ({
    value,
    onChange,
    partName = '내 파트',
    authorName = '나',
    placeholder = '미션의 업무 내용을 적어주세요',
    className,
}: WorkContentInputProps) => {
    const [isFocused, setIsFocused] = useState(false)
    const [timestamp, setTimestamp] = useState('')

    const formatTimestamp = () => {
        const now = new Date()
        const year = now.getFullYear().toString().slice(-2)
        const month = now.getMonth() + 1
        const day = now.getDate()
        const hours = now.getHours()
        const minutes = now.getMinutes().toString().padStart(2, '0')
        const period = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours % 12 || 12
        return `${year}/${month}/${day} ${period} ${displayHours}:${minutes}`
    }

    const handleFocus = () => {
        setIsFocused(true)
        if (!timestamp) {
            setTimestamp(formatTimestamp())
        }
    }

    const handleBlur = () => {
        if (!value) {
            setIsFocused(false)
            setTimestamp('')
        }
    }

    return (
        <div
            className={cn(
                'bg-neutral-50 border border-neutral-100 rounded-[6px] px-5 py-2 flex flex-col',
                className
            )}
        >
            {(isFocused || value) && (
                <div className='flex items-center justify-between mb-1'>
                    <div className='flex gap-1.5 items-center'>
                        <p className='body-3 font-medium text-neutral-900'>{partName}</p>
                        <div className='w-0.5 h-3 bg-neutral-300 rounded-[6px]' />
                        <p className='body-3 font-medium text-neutral-900'>{authorName}</p>
                    </div>
                    <p className='caption-2 text-neutral-400'>
                        {timestamp || formatTimestamp()}
                    </p>
                </div>
            )}
            <textarea
                className='w-full flex-1 bg-transparent resize-none outline-none body-3 font-medium text-neutral-900 placeholder:text-neutral-300'
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </div>
    )
}

export default WorkContentInput
