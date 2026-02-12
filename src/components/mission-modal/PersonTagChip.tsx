import { useState } from 'react'
import XIcon from '@/assets/icons/common/X-small.svg?react'
import { cn } from '@/utils/cn'
import { getRoleColorById } from '@/utils/roleColor'
import DefaultAvatar from '@/assets/Default_Profile.svg'

interface PersonTagChipProps {
	personName: string
	roleId: number
	personImage: string
	state: 'default' | 'filter' | 'clear' | 'disabled'
	onClick?: () => void
}

const PersonTagChip = ({ personName, roleId, personImage, state, onClick }: PersonTagChipProps) => {
	const [isHovered, setIsHovered] = useState(false)
	const personColor = getRoleColorById(roleId)
	const isFilter = state === 'filter'
	const isClear = state === 'clear'
	const isDisabled = state === 'disabled'

	// 배경색 결정: disabled > filter > (default + hover)
	const getBgClass = () => {
		if (isDisabled) return 'bg-[linear-gradient(rgba(255,255,255,0.5),rgba(255,255,255,0.5))]'
		if (isFilter) return personColor
		if (isHovered) return personColor
		return ''
	}

	return (
		<div
			className={cn(
				'group relative rounded-100 py-0.5 pl-0.5 w-fit h-7 flex items-center gap-1.5 transition-colors',
				isClear ? 'pr-1' : 'pr-2.5',
				getBgClass(),
				!isDisabled && 'cursor-pointer'
			)}
			onClick={!isDisabled && !isClear ? onClick : undefined}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* 흰색 오버레이 - filter 상태에서만, hover시 사라짐 */}
			{isFilter && (
				<div className='absolute inset-0 rounded-100 bg-white/50 transition-opacity group-hover:opacity-0 pointer-events-none' />
			)}

			<div
				className={cn('relative w-6 h-6 rounded-full border-2 border-white overflow-hidden', isDisabled && 'opacity-50')}
			>
				<img src={personImage ? personImage : DefaultAvatar} alt={personName} className='w-full h-full object-cover' />
			</div>
			<p className={cn('relative button-1 font-medium text-center whitespace-nowrap max-w-full', isDisabled ? 'text-neutral-300' : 'text-neutral-700')}>
				{personName}
			</p>
			{isClear && !isDisabled && <XIcon className='relative cursor-pointer' onClick={onClick} />}
		</div>
	)
}

export default PersonTagChip