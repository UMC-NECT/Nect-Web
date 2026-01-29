import XIcon from '@/assets/icons/common/X-small.svg?react'
import { cn } from '@/utils/cn'

interface PersonTagChipProps {
    personName: string
    personColor: string
    personImage: string
    state: 'default' | 'clear'
    onClick?: () => void
}

const PersonTagChip = ({ personName, personColor, personImage, state, onClick }: PersonTagChipProps) => {
    const isClear = state === 'clear'

    return (
        <div
            className={cn(
                'group relative rounded-100 py-0.5 pl-0.5 w-fit h-7 flex items-center gap-1 shadow-drop-neutral-2 hover:cursor-pointer',
                isClear ? 'pr-1' : 'pr-2.5',
                personColor
            )}
        >
            {/* 흰색 오버레이 - hover시 사라짐 */}
            <div className='absolute inset-0 rounded-100 bg-white/50 transition-opacity group-hover:opacity-0 pointer-events-none' />

            <div className='relative w-6 h-6 rounded-full border-2 border-white overflow-hidden'>
                <img src={personImage} alt={personName} className='w-full h-full object-cover' />
            </div>
            <p className='relative button-1 font-medium text-center text-neutral-700'>
                {personName}
            </p>
            {isClear && (
                <XIcon className='relative cursor-pointer' onClick={onClick} />
            )}
        </div>
    )
}

export default PersonTagChip