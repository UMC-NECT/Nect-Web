import { useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'
import PrimaryOffIcon from '@/assets/icons/common/checkbox/primary-off.svg?react'
import PrimaryOnIcon from '@/assets/icons/common/checkbox/primary-on.svg?react'
import DragIcon from '@/assets/icons/common/drag.svg?react'

interface TaskItemProps {
	content: string
	isComplete?: boolean
	isPlaceholder?: boolean
	isEditing?: boolean
	autoFocus?: boolean
	isDragging?: boolean
	dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
	onClick?: () => void
	onContentClick?: () => void
	onChange?: (value: string) => void
	onSubmit?: (value: string) => void
}

const TaskItem = ({
	content,
	isComplete = false,
	isPlaceholder = false,
	isEditing = false,
	autoFocus = false,
	isDragging = false,
	dragHandleProps,
	onClick,
	onContentClick,
	onChange,
	onSubmit,
}: TaskItemProps) => {
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if ((autoFocus || isEditing) && inputRef.current) {
			inputRef.current.focus()
		}
	}, [autoFocus, isEditing])

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && content.trim()) {
			onSubmit?.(content.trim())
		}
	}

	const handleBlur = () => {
		if (content.trim()) {
			onSubmit?.(content.trim())
		}
	}

	return (
		<div className={cn('flex gap-2 items-center py-1.5 w-full border-b border-neutral-100', isDragging && 'opacity-50')}>
			{/* Checkbox */}
			{isComplete ? (
				<PrimaryOnIcon
					className={cn('w-5 h-5 shrink-0', isPlaceholder || isEditing ? 'opacity-50 grayscale' : 'cursor-pointer')}
					onClick={isPlaceholder || isEditing ? undefined : onClick}
				/>
			) : (
				<PrimaryOffIcon
					className={cn('w-5 h-5 shrink-0', isPlaceholder || isEditing ? 'opacity-50 grayscale' : 'cursor-pointer')}
					onClick={isPlaceholder || isEditing ? undefined : onClick}
				/>
			)}

			{/* Task content */}
			<div className='flex items-center flex-1 min-w-0'>
				{isEditing ? (
					<input
						ref={inputRef}
						type='text'
						className='body-3 font-medium text-neutral-900 bg-transparent outline-none w-full placeholder:text-neutral-300'
						placeholder='할 업무를 입력하세요'
						value={content}
						onChange={e => onChange?.(e.target.value)}
						onKeyDown={handleKeyDown}
						onBlur={handleBlur}
					/>
				) : (
					<p
						className={cn(
							'body-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap flex-1',
							isPlaceholder ? 'text-neutral-300' : isComplete ? 'text-neutral-400' : 'text-neutral-900',
							!isPlaceholder && 'cursor-text'
						)}
						onClick={!isPlaceholder ? onContentClick : undefined}
					>
						{content}
					</p>
				)}
			</div>

			{/* Drag handle */}
			<div
				className={cn(
					'w-6 h-6 flex items-center justify-center shrink-0',
					isPlaceholder || isEditing ? '' : 'cursor-grab active:cursor-grabbing'
				)}
				{...(!isPlaceholder && !isEditing ? dragHandleProps : {})}
			>
				<DragIcon className={cn('w-6 h-6', (isPlaceholder || isEditing) && 'opacity-50 grayscale')} />
			</div>
		</div>
	)
}

export default TaskItem
