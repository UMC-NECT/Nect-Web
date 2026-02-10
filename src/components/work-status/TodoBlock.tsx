import { useState, useRef, useEffect } from 'react'
import AvatarGroup from '@/components/common/AvatarGroup'
import ProgressBar from '@/components/week-mission/ProgressBar'
import LinkIcon from '@/assets/icons/work-status/link.svg?react'
import DoIcon from '@/assets/icons/work-status/do.svg?react'
import ChevronDownIcon from '@/assets/icons/common/chevron-down.svg?react'
import { calculateDateSpan } from '@/utils/dateUtils'
import LinkChip from './LinkChip'
import ProfileModal from '@/components/week-mission/ProfileModal'
import type { Assignees } from '@/types/api/assignees'

interface TodoBlockProps {
	id: number
	team: string
	title: string
	todo: {
		id: number
		done: number
		total: number // 전체 작업 수 (없으면 done + inProgress로 계산)
	}
	dueDate?: string // "2025.11.21" 형식
	/** API 응답 left_day (있으면 D-day 표시에 사용, 없으면 dueDate로 계산) */
	leftDay?: number
	participants?: { id: number; name: string; avatar: string }[] // 사용자 아바타 이미지 URL 배열
	links?: string | string[]
	attachments?: number // 첨부파일 개수
	variant?: 'Default' | 'Minimum' | 'Edit'
	isEdit?: boolean
	onClick?: () => void
}

/** 날짜 문자열을 yy.mm.dd 형식으로 변환 */
const formatDueDate = (dateStr: string): string => {
	const normalized = dateStr.replace(/-/g, '.')
	const parts = normalized.split('.')
	if (parts.length >= 3) {
		const y = parts[0].length >= 4 ? parts[0].slice(-2) : parts[0].padStart(2, '0')
		const m = parts[1].padStart(2, '0')
		const d = parts[2].padStart(2, '0')
		return `${y}.${m}.${d}`
	}
	return dateStr
}

const TodoBlock = ({
	team,
	title,
	todo,
	dueDate,
	leftDay,
	participants = [],
    links,
    attachments,
	variant = 'Default',
	isEdit = false,
	onClick,
}: TodoBlockProps) => {
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
	const profileDropdownRef = useRef<HTMLDivElement>(null)

	const isMinimum = variant === 'Minimum'
	const isDefault = variant === 'Default'

	// participants를 ProfileModal용 Assignees 형식으로 변환
	const assignees: Assignees[] = participants.map(p => ({
		user_id: p.id,
		name: p.name,
		nickname: p.name,
		profile_image_url: p.avatar ?? '',
	}))

	useEffect(() => {
		if (!isProfileModalOpen) return
		const handleClickOutside = (e: MouseEvent) => {
			if (profileDropdownRef.current?.contains(e.target as Node)) return
			setIsProfileModalOpen(false)
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isProfileModalOpen])

	// 진행률 계산 (4개 세그먼트 기준)
	const progressSegments = 4
	const completedSegments = todo.total > 0 ? Math.round((todo.done / todo.total) * progressSegments) : 0

	// D-day 계산: API left_day 우선, 없으면 dueDate로 계산
	let daysRemaining: number | null = null
	if (leftDay !== undefined && leftDay !== null) {
		daysRemaining = leftDay
	} else if (dueDate) {
		const today = new Date()
		const todayStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`
		daysRemaining = calculateDateSpan(todayStr, dueDate)
	}

	return (
		<div
			className={`bg-neutral-50 border border-solid flex flex-col items-start pl-[14px] pr-[12px] relative rounded-12 shadow-drop-neutral-3 w-[208px] cursor-pointer ${
				isMinimum
					? 'border-neutral-200 pb-[12px] pt-[10px]'
					: isEdit
						? 'border-danger-500 py-[10px]'
						: 'border-neutral-200 py-[10px]'
			}`}
			onClick={onClick}
		>
			<div className='flex flex-col gap-[12px] items-start relative shrink-0 w-full'>
				{/* 헤더: 라벨 + 제목 */}
				<div className='flex flex-col gap-[5px] items-start leading-normal not-italic relative shrink-0 text-neutral-900 w-full'>
					<p className='caption-3 font-medium w-full whitespace-pre-wrap'>{team}</p>
					<p className='body-1 font-semibold relative shrink-0 w-full line-clamp-2'>
						{title}
					</p>
				</div>

				{/* 상세 정보 (Default 또는 Edit일 때만 표시) */}
				{isDefault && (
					<div className='flex flex-col gap-[8px] items-start relative shrink-0 w-full'>
						{/* 아이콘 + 카운트 */}
						<div className='flex gap-[7px] h-[28px] items-center relative shrink-0'>
							{/* 링크/첨부파일 아이콘 + 카운트 */}
							{(() => {
								// links를 배열로 변환 (쉼표로 구분된 문자열이거나 이미 배열)
								const linksArray = links
									? Array.isArray(links)
										? links
										: links.split(',').map(link => link.trim()).filter(link => link)
									: []

								// 최대 2개까지 표시
								const displayLinks = linksArray.slice(0, 2)
								const remainingCount = linksArray.length - 2

								if (displayLinks.length > 0) {
									return (
										<div className='flex gap-[3px] items-center relative shrink-0'>
											{displayLinks.map((link, index) => (
												<LinkChip key={index} app={link} />
											))}
											{remainingCount > 0 && (
												<span className='body-3 text-status-info-cool-gray-deep font-medium'>
													+{remainingCount}
												</span>
											)}
										</div>
									)
								} else if (attachments) {
									return (
										<div className='flex gap-[3px] items-center relative shrink-0'>
											<div className='overflow-clip relative shrink-0 size-[18px]'>
												<LinkIcon className='w-full h-full' style={{ filter: 'opacity(0.65)' }} />
											</div>
											<div className='flex items-center relative shrink-0'>
												<p className='body-3 text-status-info-cool-gray-deep font-medium leading-[1.4] relative shrink-0 whitespace-pre'>
													{attachments}
												</p>
											</div>
										</div>
									)
								}
								return null
							})()}

							{/* 완료 아이콘 + 카운트 */}
							<div className='flex gap-[3px] items-center relative shrink-0'>
								<div className='overflow-clip relative shrink-0 size-[18px]'>
									<DoIcon className='w-full h-full' style={{ filter: 'opacity(0.65)' }} />
								</div>
								<div className='flex items-center relative shrink-0'>
									<p className='body-3 text-status-info-cool-gray-deep font-medium leading-[1.4] relative shrink-0 whitespace-pre'>
										{`${todo.done}/${todo.total}`}
									</p>
								</div>
							</div>
						</div>

						{/* 진행률 바 + 마감일 + D-day + 아바타 */}
						<div className='flex flex-col gap-2 items-start relative shrink-0 w-full'>
							{/* 진행률 바 */}
							<div className='w-[132px]'>
								<ProgressBar completed={completedSegments} total={progressSegments} />
							</div>

							{/* 마감일 + D-day + 아바타 */}
							<div className='flex items-center justify-between relative shrink-0 w-full'>
								{/* 마감일 */}
								<div className='flex gap-gutter items-center relative shrink-0'>
									{dueDate && (
										<div className='flex gap-[4px] items-center leading-[1.6] relative shrink-0 whitespace-pre'>
											<p className='body-3 text-neutral-500 font-medium relative shrink-0'>마감일</p>
											<p className='body-3 text-neutral-600 font-medium relative shrink-0'>{formatDueDate(dueDate)}</p>
										</div>
									)}
								</div>

								{/* D-day + 아바타 그룹 + 드롭다운 */}
								<div className='flex  items-center justify-end relative shrink-0'>
									{/* D-day */}
									{daysRemaining !== null && (
										<div className='flex flex-col font-medium justify-center leading-0 not-italic relative shrink-0  mr-1.5 text-primary-500-normal text-right whitespace-nowrap'>
											<p className='body-3 leading-normal whitespace-pre'>{`D-${daysRemaining}`}</p>
										</div>
									)}

									{/* 아바타 그룹 + 드롭다운 */}
								<div ref={profileDropdownRef} className='relative'>
									<div
										className='flex gap-[2px] items-center justify-end hover:bg-neutral-000 rounded-16 p-0.5 transition-all duration-300 cursor-pointer'
										onClick={e => {
											e.stopPropagation()
											setIsProfileModalOpen(prev => !prev)
										}}
									>
										{participants.length > 0 && (
											<div className='flex items-center justify-end relative shrink-0'>
												<AvatarGroup avatars={participants.map(p => p.avatar)} maxCount={2} size={22} />
											</div>
										)}
										<div className='w-[14.839px] h-[14.839px] shrink-0 flex items-center justify-center'>
											<ChevronDownIcon className='w-full h-full text-neutral-600' />
										</div>
									</div>
									{isProfileModalOpen && (
										<ProfileModal
											isOpen={isProfileModalOpen}
											onClose={() => setIsProfileModalOpen(false)}
											assignees={assignees}
										/>
									)}
								</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default TodoBlock