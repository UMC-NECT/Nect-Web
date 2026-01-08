import StatusChip from '@/components/common/StatusChip'
import AvatarGroup from '@/components/common/AvatarGroup'
import ProgressBar from './ProgressBar'
import ChevronDownIcon from '@/assets/icons/common/chevron-down.svg?react'
import type { MissionStatus } from '@/types/missionStatus'
import { useRef, useState } from 'react'
import StatusChipList from '../common/StatusChipList'

interface MissionBlockProps {
	isGoal?: boolean
	missionNumber: number
	title: string
	progress: number // 0-4 사이의 값
	createdAt: string // "2025.11.17" 형식
	dueDate: string // "2025.11.30" 형식
	daysRemaining: number // D-13의 13
	status: MissionStatus
	participants?: string[] // 사용자 아바타 이미지 URL 배열 (선택적)
	gridColumnSize: number
	onClick?: () => void
}

const MissionBlock = ({
	isGoal,
	missionNumber,
	title,
	progress,
	createdAt,
	dueDate,
	daysRemaining,
	status,
	participants = [],
	gridColumnSize,
	onClick,
}: MissionBlockProps) => {
	const [isStatusListOpen, setIsStatusListOpen] = useState(false)
	const statusListRef = useRef<HTMLDivElement>(null)

	const handleStatusListOpen = () => {
		setIsStatusListOpen(!isStatusListOpen)
	}

	return (
		<div
			className={`flex flex-col pl-4 pr-[10px] py-[10px] max-h-[118px] mt-3 ${isGoal ? 'bg-primary-100-light border border-primary-300-light mt-3' : 'bg-neutral-50 border border-neutral-200'} rounded-[12px] shadow-[0px_-4px_16px_0px_rgba(23,23,20,0.04)] cursor-pointer w-full`}
			onClick={onClick}
		>
			{/* 상단: Misson 번호와 StatusChip */}
			<div className='flex items-start justify-between w-full '>
				<p className='caption-2 text-neutral-900 font-medium mb-[5px]'>
					{gridColumnSize > 1 ? `Misson ${missionNumber}` : `M${missionNumber}`}
				</p>
				<div className='relative flex items-center justify-center cursor-pointer' onMouseLeave={() => setIsStatusListOpen(false)}>
					<StatusChip state={status} gridColumnSize={gridColumnSize} onClick={handleStatusListOpen} />
					{isStatusListOpen && (
						<div ref={statusListRef} className='absolute z-10 top-full'>
							<StatusChipList />
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
			<div className='flex items-center justify-between w-full mt-2.5'>
				<div className='flex gap-6 items-center'>
					{gridColumnSize > 2 && (
						<>
							{gridColumnSize > 4 && (
								<div className='flex gap-[10px] items-center caption-2 text-neutral-900 font-medium whitespace-nowrap'>
									<p className='opacity-60'>생성일</p>
									<p className='font-medium'>{createdAt}</p>
								</div>
							)}
							<div className='flex gap-[10px] items-center caption-2 text-neutral-900 font-medium whitespace-nowrap'>
								<p className='opacity-60'>마감일</p>
								<p className='font-medium'>{dueDate}</p>
							</div>
						</>
					)}
				</div>
				<div className='flex gap-2 items-center justify-end'>
					<p className='body-3 text-primary-500-normal font-medium text-right whitespace-nowrap'>D-{daysRemaining}</p>
					<div className='flex gap-[2px] items-center justify-end'>
						{gridColumnSize < 2 && <AvatarGroup avatars={participants} maxCount={gridColumnSize < 4 ? 1 : 3} />}
						{/* 드롭다운 아이콘 */}
						<div className='w-[14.839px] h-[14.839px] shrink-0 flex items-center justify-center'>
							<ChevronDownIcon className='w-full h-full text-neutral-600' />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MissionBlock
