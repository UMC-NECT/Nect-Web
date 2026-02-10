import { cn } from '@/utils/cn'

interface SegmentTabButtonProps {
	/** 탭 텍스트 */
	label: string
	/** 카운트 (Count 타입일 때 표시) */
	count?: number
	/** 활성화 여부 */
	isActive: boolean
	/** 클릭 핸들러 */
	onClick?: () => void
	/** 추가 클래스명 */
	className?: string
}

const SegmentTabButton = ({ label, count, isActive, onClick, className }: SegmentTabButtonProps) => {
	return (
		<button
			type='button'
			onClick={onClick}
			className={cn('flex flex-col gap-3 w-30 pt-2.5', className)}
		>
			<div
				className={cn(
					'title-3 font-semibold text-center flex items-center justify-center gap-1.5',
					isActive ? 'text-primary-500-normal' : 'text-neutral-400'
				)}
			>
				<span>{label}</span>
				{count !== undefined && <span>{count}</span>}
			</div>
			<div
				className={cn(
					'h-0.75 w-full',
					isActive ? 'bg-primary-400-normal' : 'bg-neutral-300'
				)}
			/>
		</button>
	)
}

export default SegmentTabButton
