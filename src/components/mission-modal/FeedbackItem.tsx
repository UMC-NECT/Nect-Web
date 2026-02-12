import { useRef, useEffect } from 'react'
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
	isEditing?: boolean
	autoFocus?: boolean
	onClick?: () => void
	onContentClick?: () => void
	onChange?: (value: string) => void
	onSubmit?: (value: string) => void
	/** Delete 키 누르면 호출 (입력이 비어 있으면 호출 안 함) */
	onDelete?: () => void
}

const FeedbackItem = ({
	partName,
	authorName,
	content,
	timestamp,
	state = 'default',
	isEditing = false,
	autoFocus = false,
	onClick,
	onContentClick,
	onChange,
	onSubmit,
	onDelete,
}: FeedbackItemProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const isComplete = state === 'complete'
	const isDisabled = state === 'disabled'

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

	const renderCheckbox = () => {
		if (isEditing) {
			return <IssueOffIcon className='w-5 h-5 opacity-50 grayscale' />
		}
		if (isComplete) {
			return <IssueOnIcon className='w-5 h-5 cursor-pointer' onClick={onClick} />
		}
		if (isDisabled) {
			return <IssueOffIcon className='w-5 h-5 opacity-50 grayscale cursor-not-allowed' />
		}
		return <IssueOffIcon className='w-5 h-5 cursor-pointer' onClick={onClick} />
	}

	return (
		<div className='flex gap-2 items-start py-1.5 w-full border-b border-neutral-100'>
			{/* Checkbox */}
			<div className='flex items-center py-0.5'>{renderCheckbox()}</div>

			{/* Content */}
			<div className='flex flex-col gap-1 w-[264px]'>
				{/* Header */}
				<div className='flex items-center justify-between w-full'>
					<div className='flex gap-1.5 items-center'>
						<p
							className={cn(
								'body-2 font-medium overflow-hidden text-ellipsis',
								isDisabled || isEditing
									? 'text-neutral-300'
									: isComplete
										? 'text-neutral-400'
										: 'text-neutral-900'
							)}
						>
							{partName}
						</p>
						<div className={cn('w-0.5 h-3 rounded-6', isEditing ? 'bg-neutral-200' : 'bg-neutral-300')} />
						<p
							className={cn(
								'body-2 font-medium overflow-hidden text-ellipsis',
								isDisabled || isEditing
									? 'text-neutral-300'
									: isComplete
										? 'text-neutral-400'
										: 'text-neutral-900'
							)}
						>
							{authorName}
						</p>
					</div>
					{!isDisabled && timestamp && (
						<p
							className={cn(
								'caption-1 font-normal text-right',
								isEditing ? 'text-neutral-300' : isComplete ? 'text-neutral-300' : 'text-neutral-400'
							)}
						>
							{timestamp}
						</p>
					)}
				</div>

				{/* Feedback content */}
				{isEditing ? (
					<input
						ref={inputRef}
						type='text'
						className='body-3 font-normal text-neutral-900 bg-transparent outline-none w-full placeholder:text-neutral-300'
						placeholder='담당자가 확인해야 할 피드백 요청 사항'
						value={content}
						onChange={e => onChange?.(e.target.value)}
						onKeyDown={handleKeyDown}
						onBlur={handleBlur}
					/>
				) : (
					<p
						className={cn(
							'body-2 font-normal w-full whitespace-pre-wrap',
							isDisabled ? 'text-neutral-300' : isComplete ? 'text-neutral-400' : 'text-neutral-900',
							!isDisabled && 'cursor-text'
						)}
						onClick={!isDisabled ? onContentClick : undefined}
					>
						{content}
					</p>
				)}
			</div>
		</div>
	)
}

export default FeedbackItem
