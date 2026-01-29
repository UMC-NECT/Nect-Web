import XIcon from '@/assets/icons/common/X-small.svg?react'
import { cn } from '@/utils/cn'

interface PersonTagChipProps {
	personName: string
	personColor?: string
	personImage: string
	state: 'default' | 'filter' | 'clear' | 'disabled'
	onClick?: () => void
}

const PersonTagChip = ({ personName, personColor, personImage, state, onClick }: PersonTagChipProps) => {
	const isDefault = state === 'default'
	const isFilter = state === 'filter'
	const isClear = state === 'clear'
	const isDisabled = state === 'disabled'

	// filter, clear, disabled 상태에서만 personColor 사용
	const useColor = isFilter

	return (
		<div
			className={cn(
				'group relative rounded-100 py-0.5 pl-0.5 w-fit h-7 flex items-center gap-1.5',
				isClear ? 'pr-1' : 'pr-2.5',
				isDisabled
					? cn( 'bg-[linear-gradient(rgba(255,255,255,0.5),rgba(255,255,255,0.5))]', 'cursor-default')
					: isDefault
						? cn('hover:bg-neutral-100', 'shadow-drop-neutral-2', 'hover:cursor-pointer')
						: cn(useColor && personColor, 'shadow-drop-neutral-2', 'hover:cursor-pointer')
			)}
			onClick={!isDisabled && !isClear ? onClick : undefined}
		>
			{/* 흰색 오버레이 - filter 상태에서만, hover시 사라짐 */}
			{isFilter && (
				<div className='absolute inset-0 rounded-100 bg-white/50 transition-opacity group-hover:opacity-0 pointer-events-none' />
			)}

			<div
				className={cn('relative w-6 h-6 rounded-full border-2 border-white overflow-hidden', isDisabled && 'opacity-50')}
			>
				<img src={personImage} alt={personName} className='w-full h-full object-cover' />
			</div>
			<p className={cn('relative button-1 font-medium text-center', isDisabled ? 'text-neutral-300' : 'text-neutral-700')}>
				{personName}
			</p>
			{isClear && !isDisabled && <XIcon className='relative cursor-pointer' onClick={onClick} />}
		</div>
	)
}

export default PersonTagChip