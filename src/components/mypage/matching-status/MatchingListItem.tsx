import { cn } from '@/utils/cn'
import ProjectCard from './ProjectCard'
import ProfileCard from './ProfileCard'
import MatchingTimerCard from './MatchingTimerCard'
import { calculateRemainingSeconds } from '@/utils/matchingTimer'
import type { MatchingStatus as ApiMatchingStatus } from '@/types/api/matching'
import type { UserMatchingType, ProjectMatchingType } from '@/types/api/mypage'

type TimerCardStatus = 'default' | 'auto-rejected' | 'accepted'
type RequestType = 'received' | 'sent'
type ItemType = 'project' | 'user'

interface MatchingListItemProps {
	/** 매칭 아이템 (프로젝트 또는 사용자) */
	item: ProjectMatchingType | UserMatchingType
	/** 아이템 타입 */
	itemType: ItemType
	/** 요청 타입 (받은 요청 / 보낸 요청) */
	requestType: RequestType
	/** 현재 시간 (PENDING 상태용) */
	currentTime: number
	/** 초기 시간 (PENDING이 아닌 상태용) */
	initialTime: number
	/** 수락 핸들러 (받은 요청일 때만) */
	onAccept?: (matchingId?: number) => void
	/** 거절 핸들러 (받은 요청일 때만) */
	onReject?: (matchingId?: number) => void
	/** 취소 핸들러 (보낸 요청일 때만) */
	onCancel?: (matchingId?: number) => void
	/** 프로필 클릭 핸들러 (사용자 타입일 때만) */
	onProfileClick?: (userId: number) => void
	/** 추가 클래스명 */
	className?: string
}

// API status를 MatchingTimerCard status로 변환
const mapStatusToTimerCardStatus = (status?: ApiMatchingStatus): TimerCardStatus => {
	if (!status) return 'default'
	switch (status) {
		case 'PENDING':
			return 'default'
		case 'ACCEPTED':
			return 'accepted'
		case 'REJECTED':
		case 'CANCELED':
		case 'EXPIRED':
			return 'auto-rejected'
		default:
			return 'default'
	}
}

export const MatchingListItem = ({
	item,
	itemType,
	requestType,
	currentTime,
	initialTime,
	onAccept,
	onReject,
	onCancel,
	onProfileClick,
	className,
}: MatchingListItemProps) => {
	const timerStatus = mapStatusToTimerCardStatus(item.status)
	// PENDING 상태일 때만 currentTime을 사용하여 실시간 업데이트
	const timeToUse = item.status === 'PENDING' ? currentTime : initialTime
	const remainingSeconds = calculateRemainingSeconds(item.expiresAt, timeToUse)
	// PENDING 상태일 때만 버튼 표시
	const isPending = item.status === 'PENDING'

	// 프로젝트 타입인지 확인
	const isProject = itemType === 'project'
	const projectItem = isProject ? (item as ProjectMatchingType) : null
	const userItem = !isProject ? (item as UserMatchingType) : null

	// 받은 요청인지 확인
	const isReceived = requestType === 'received'

	// 컨테이너 클래스명
	const containerClassName = isProject
		? 'flex gap-1 items-center'
		: 'flex gap-1 items-center relative shrink-0 w-full'

	return (
		<div className={cn(containerClassName, className)}>
			{/* 프로젝트 카드 또는 프로필 카드 */}
			{isProject && projectItem ? (
				<ProjectCard
					projectName={projectItem.title}
					category=''
					description={projectItem.description}
					currentMembers={projectItem.currentMembersNum}
					totalMembers={0}
				/>
			) : userItem ? (
				<ProfileCard
					imageUrl={userItem.profileUrl}
					nickname={userItem.nickname}
					part={userItem.field}
					introduction={userItem.bio}
					onClick={onProfileClick ? () => onProfileClick(userItem.userId) : undefined}
				/>
			) : null}

			{/* 타이머 카드 */}
			<MatchingTimerCard
				requestType={requestType}
				status={timerStatus}
				apiStatus={item.status}
				timerSeconds={remainingSeconds}
				onAccept={
					isReceived && isPending && onAccept
						? () => onAccept(item.matchingId)
						: undefined
				}
				onReject={
					isReceived && isPending && onReject
						? () => onReject(item.matchingId)
						: undefined
				}
				onCancel={
					!isReceived && isPending && onCancel
						? () => onCancel(item.matchingId)
						: undefined
				}
			/>
		</div>
	)
}
