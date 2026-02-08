import { memo, useRef, useState, useEffect } from 'react'
import StatusChip from '@/components/common/StatusChip'
import AvatarGroup from '@/components/common/AvatarGroup'
import ProgressBar from './ProgressBar'
import ChevronDownIcon from '@/assets/icons/common/chevron-down.svg?react'
import type { MissionStatus } from '@/types/missionStatus'
import { cn } from '@/utils/cn'
import StatusChipList from '../common/StatusChipList'
import ProfileModal from './ProfileModal'
import type { Assignees } from '@/types/api/assignees'

interface MissionBlockProps {
	task?: boolean
	missionNumber: number
	title: string
	progress: number // 0-4 사이의 값
	createdAt: string // "2025.11.17" 형식
	dueDate: string // "2025.11.30" 형식
	daysRemaining: number // D-13의 13
	status: MissionStatus
	assignees?: Assignees[] // 담당자
	gridColumnSize: number
	onClick?: () => void
	onDragStart?: (e: React.MouseEvent) => void
	onResizeStart?: () => void
	onStatusChange?: (status: MissionStatus) => void
	isDragging?: boolean
	isResizing?: boolean
}

const MissionBlock = memo(
	({
		task,
		missionNumber,
		title,
		progress,
		createdAt,
		dueDate,
		daysRemaining,
		status,
		assignees,
		gridColumnSize,
		onClick,
		onDragStart,
		onResizeStart,
		onStatusChange,
		isDragging = false,
		isResizing = false,
	}: MissionBlockProps) => {
		const [isStatusListOpen, setIsStatusListOpen] = useState(false)
		const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
		const [isBlockHovered, setIsBlockHovered] = useState(false)
		const [isExcludedAreaHovered, setIsExcludedAreaHovered] = useState(false)
		const statusListRef = useRef<HTMLDivElement>(null)
		const profileDropdownRef = useRef<HTMLDivElement>(null)
		const dropdownHoveredRef = useRef(false)
		const statusChipHoveredRef = useRef(false)
		const updateExcludedAreaHovered = () =>
			setIsExcludedAreaHovered(dropdownHoveredRef.current || statusChipHoveredRef.current)
		const showBlockHover = isBlockHovered && !isExcludedAreaHovered

		const handleStatusListOpen = () => {
			setIsStatusListOpen(!isStatusListOpen)
		}

		const handleDragStart = (e: React.MouseEvent) => {
			if (task) return
			if ((e.target as HTMLElement).closest('.status-chip-container')) {
				return
			}
			if ((e.target as HTMLElement).closest('[data-resize-handle]')) {
				return
			}
			if (onDragStart) {
				e.preventDefault()
				e.stopPropagation()
				onDragStart(e)
			}
		}

		const handleClick = (e: React.MouseEvent) => {
			// 드래그 중이면 클릭 이벤트 무시
			if (isDragging) {
				e.preventDefault()
				e.stopPropagation()
				return
			}
			if (onClick) {
				onClick()
			}
		}

		const handleResizeStart = (e: React.MouseEvent) => {
			if (task) return
			e.preventDefault()
			e.stopPropagation()
			if (onResizeStart) {
				onResizeStart()
			}
		}

		useEffect(() => {
			if (!isProfileModalOpen) return
			const handleClickOutside = (e: MouseEvent) => {
				if (profileDropdownRef.current?.contains(e.target as Node)) return
				setIsProfileModalOpen(false)
			}
			document.addEventListener('mousedown', handleClickOutside)
			return () => document.removeEventListener('mousedown', handleClickOutside)
		}, [isProfileModalOpen])

		return (
			<div
				data-mission-block
				className={cn(
					'relative flex flex-col pl-4 pr-[10px] py-[10px] max-h-[118px] h-full mt-3 select-none transition-all duration-300',
					'rounded-12 shadow-drop-neutral-3 w-full',
					isStatusListOpen ? 'z-50' : 'z-10',
					task
						? 'bg-primary-100-light border border-primary-300-light'
						: 'bg-neutral-50 border border-neutral-200',
					showBlockHover &&
						(task ? 'bg-primary-150-light border-primary-400-normal' : 'bg-neutral-100 border-neutral-400'),
					task ? 'cursor-default' : isDragging ? 'cursor-grabbing opacity-70 z-50' : isResizing ? 'cursor-ew-resize' : 'cursor-pointer',
				)}
				onMouseEnter={() => setIsBlockHovered(true)}
				onMouseLeave={() => setIsBlockHovered(false)}
				onMouseDown={handleDragStart}
				onClick={handleClick}
			>
				{/* 상단: Misson 번호와 StatusChip */}
				<div className='flex items-start justify-between w-full '>
					<p className='caption-2 text-neutral-900 font-medium mb-[5px]'>
						{gridColumnSize > 1 ? `Misson ${missionNumber}` : `M${missionNumber}`}
					</p>
					<div
						className='relative flex items-center justify-center status-chip-container cursor-pointer'
						onMouseEnter={() => {
							statusChipHoveredRef.current = true
							updateExcludedAreaHovered()
						}}
						onMouseLeave={() => {
							setIsStatusListOpen(false)
							statusChipHoveredRef.current = false
							updateExcludedAreaHovered()
						}}
						onClick={e => e.stopPropagation()}
					>
						<StatusChip state={status} gridColumnSize={gridColumnSize} hover={true} onClick={handleStatusListOpen} />
						{isStatusListOpen && (
							<div ref={statusListRef} className='absolute z-1200 top-full'>
								<StatusChipList
									onStatusChange={newStatus => {
										if (onStatusChange) {
											onStatusChange(newStatus)
										}
										setIsStatusListOpen(false)
									}}
								/>
							</div>
						)}
					</div>
				</div>

				{/* 중단: 제목과 진행률 바 */}
				<div className='flex flex-col items-start w-full'>
					<p className='title-3 text-neutral-900 font-semibold leading-6 line-clamp-1 mb-3'>{title}</p>
					<ProgressBar completed={progress} total={4} />
				</div>

				{/* 하단: 날짜 정보와 D-날짜 + 아바타/드롭다운 */}
				<div className='flex items-center justify-between w-full mt-1'>
					<div className='flex gap-6 items-center'>
						{gridColumnSize > 2 && (
							<>
								{gridColumnSize > 4 && (
									<div className='flex gap-[10px] items-center body-2 text-neutral-900 font-normal whitespace-nowrap'>
										<p className='text-neutral-500'>생성일</p>
										<p>{createdAt}</p>
									</div>
								)}
								<div className='flex gap-[10px] items-center body-2 text-neutral-900 font-normal whitespace-nowrap'>
									<p className='text-neutral-500'>마감일</p>
									<p>{dueDate}</p>
								</div>
							</>
						)}
					</div>
					<div className='flex gap-2 items-center justify-end'>
						<p className='body-3 text-primary-500-normal font-medium text-right whitespace-nowrap'>
							D-{daysRemaining}
						</p>
						<div ref={profileDropdownRef} className='relative'>
							<div
								className={cn('flex gap-[2px] items-center justify-end hover:bg-neutral-000 rounded-16 p-0.5 transition-all duration-300 cursor-pointer')}
								onMouseEnter={() => {
									dropdownHoveredRef.current = true
									updateExcludedAreaHovered()
								}}
								onMouseLeave={() => {
									dropdownHoveredRef.current = false
									updateExcludedAreaHovered()
								}}
								onClick={e => {
									e.stopPropagation()
									setIsProfileModalOpen(prev => !prev)
								}}
							>
								{gridColumnSize > 2 && assignees && <AvatarGroup avatars={assignees.map(assignee => assignee.profile_image_url)} maxCount={gridColumnSize < 4 ? 1 : 3} size={26} />}
								{/* 드롭다운 아이콘 */}
								<div className='w-[14.839px] h-[14.839px] shrink-0 flex items-center justify-center'>
									<ChevronDownIcon className='w-full h-full text-neutral-600' />
								</div>
							</div>
							{isProfileModalOpen && (
								<ProfileModal
									isOpen={isProfileModalOpen}
									onClose={() => setIsProfileModalOpen(false)}
									assignees={assignees ?? []}
								/>
							)}
						</div>
					</div>
				</div>
				{/* 리사이즈 핸들 */}
				{onResizeStart && !task && (
					<div
						data-resize-handle
						className='absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize transition-colors z-10'
						onMouseDown={handleResizeStart}
					/>
				)}
			</div>
		)
	}
)

MissionBlock.displayName = 'MissionBlock'

export default MissionBlock
