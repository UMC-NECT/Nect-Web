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
	/** Delete 키 누르면 호출 (아이템 삭제) */
	onDelete?: () => void
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
	onDelete,
}: TaskItemProps) => {
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if ((autoFocus || isEditing) && inputRef.current) {
			inputRef.current.focus()
		}
	}, [autoFocus, isEditing])

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// Mac IME: Enter가 조합 완료와 제출에 둘 다 쓰여 두 번 제출되는 것 방지
		if (e.key === 'Enter' && !e.nativeEvent.isComposing && content.trim()) {
			e.preventDefault()
			onSubmit?.(content.trim())
			return
		}
		// Delete 키 → 아이템 삭제 (입력이 비어 있으면 삭제 안 함)
		if (e.key === 'Delete' && onDelete && content.trim()) {
			e.preventDefault()
			onDelete()
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
						className='body-3 font-normal text-neutral-900 bg-transparent outline-none w-full placeholder:text-neutral-300'
						placeholder='할 업무를 입력하세요'
						value={content}
						onChange={e => onChange?.(e.target.value)}
						onKeyDown={handleKeyDown}
						onBlur={handleBlur}
					/>
				) : (
					<p
						className={cn(
							'body-3 font-normal overflow-hidden text-ellipsis whitespace-nowrap flex-1',
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
