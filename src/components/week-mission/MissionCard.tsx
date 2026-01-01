import PlanTag from '@/components/common/PlanTag'
import AvatarGroup from '@/components/common/AvatarGroup'
import ProgressBar from './ProgressBar'
import ChevronDownIcon from '@/assets/icons/chevron-down.svg?react'
import { calculateDateSpan } from '@/utils/dateUtils'

interface MissionCardProps {
	isGoal?: boolean
	missionNumber: number
	title: string
	progress: number // 0-4 사이의 값
	createdAt: string // "2025.11.17" 형식
	dueDate: string // "2025.11.30" 형식
	daysRemaining: number // D-13의 13
	status: 'planning' | 'in_progress' | 'completed'
	participants?: string[] // 사용자 아바타 이미지 URL 배열 (선택적)
	onClick?: () => void
}

const MissionCard = ({
	isGoal,
	missionNumber,
	title,
	progress,
	createdAt,
	dueDate,
	daysRemaining,
	status,
	participants = [],
	onClick,
}: MissionCardProps) => {
	const colSpan = calculateDateSpan(createdAt, dueDate)

	return (
		<div
			className={`flex items-center justify-between pl-4 pr-[10px] py-[10px] ${isGoal ? 'bg-primary-100-light border border-primary-300-light' : 'bg-neutral-50 border border-neutral-200'} rounded-[12px] shadow-[0px_-4px_16px_0px_rgba(23,23,20,0.04)] cursor-pointer`}
			style={{ gridColumn: `span ${colSpan}` }}
			onClick={onClick}
		>
			{/* 왼쪽 섹션 */}
			<div className="flex flex-col gap-5 items-start justify-center flex-1 min-w-0">
				{/* 제목 섹션 */}
				<div className="flex flex-col gap-[5px] items-start w-full">
					<p className="caption-2 text-neutral-900 font-medium">Misson {missionNumber}</p>
					<p className="title-3 text-neutral-900 font-semibold leading-6">{title}</p>
				</div>

				{/* 진행률 및 날짜 섹션 */}
				<div className="flex flex-col gap-[10px] items-start w-full">
					<ProgressBar completed={progress} total={4} />
					<div className="flex gap-6 items-center">
						<div className="flex gap-[10px] items-center caption-2 text-neutral-900 font-medium whitespace-nowrap">
							<p className="opacity-60">생성일</p>
							<p className="font-medium">{createdAt}</p>
						</div>
						<div className="flex gap-[10px] items-center caption-2 text-neutral-900 font-medium whitespace-nowrap">
							<p className="opacity-60">마감일</p>
							<p className="font-medium">{dueDate}</p>
						</div>
					</div>
				</div>
			</div>

			{/* 오른쪽 섹션 */}
			<div className="flex flex-col gap-11 items-end justify-center shrink-0">
				<PlanTag state={status} />
				<div className="flex gap-2 items-center justify-end w-full">
					<p className="body-3 text-primary-500-normal font-medium text-right whitespace-nowrap">
						D-{daysRemaining}
					</p>
					<div className="flex gap-[2px] items-center justify-end">
						<AvatarGroup avatars={participants} maxCount={3} />
						{/* 드롭다운 아이콘 */}
						<div className="w-[14.839px] h-[14.839px] shrink-0 flex items-center justify-center">
							<ChevronDownIcon className="w-full h-full text-neutral-600" />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MissionCard

