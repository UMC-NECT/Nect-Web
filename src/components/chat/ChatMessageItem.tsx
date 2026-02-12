import { type ChatMessage } from '@/types/message'
import { useQuery } from '@tanstack/react-query'
import { getTeamBoardMembers } from '@/api/team-board/boards'
import { useGetProfileQuery } from '@/hooks/auth/useUsersApi'

interface ChatMessageItemProps {
	message: ChatMessage
	showDivider?: boolean
	onClick?: () => void
	projectId?: number
}

export const ChatMessageItem = ({ message, showDivider = false, onClick, projectId }: ChatMessageItemProps) => {
	const isGroup = message.isGroup ?? (message.memberCount !== undefined && message.memberCount > 1)
	const participants = message.participants || []
	// member_count를 우선 사용, 없으면 participants.length 사용
	// 나를 제외하고 표시하기 위해 -1
	const baseCount = message.memberCount ?? participants.length
	const participantCount = baseCount > 0 ? Math.max(1, baseCount - 1) : 0
	// participantCount에 맞춰 기본 이미지로 채워서 표시 (최대 4개)
	const defaultImage = 'https://placehold.co/44x44'
	const displayCount = Math.min(participantCount, 4)
	const displayParticipants = Array.from({ length: displayCount }, (_, index) => 
		participants[index] || defaultImage
	)

	// 현재 사용자 ID 가져오기
	const { data: profileData } = useGetProfileQuery()
	const currentUserId = profileData?.body?.userId

	// member_count가 2일 때 멤버 정보 조회 (나를 제외한 상대방의 field 정보)
	const { data: membersData } = useQuery({
		queryKey: ['teamBoardMembers', projectId],
		queryFn: () => getTeamBoardMembers(projectId!),
		enabled: !!projectId && message.memberCount === 2 && !!currentUserId,
	})

	// member_count가 2일 때 상대방의 field 정보 가져오기
	const otherMemberField = membersData?.body?.members?.find(
		(member) => member.user_id !== currentUserId
	)
	const fieldDisplayName = otherMemberField?.field
		? (otherMemberField.field.type === 'CUSTOM' 
			? otherMemberField.field.custom_name 
			: otherMemberField.field.type)
		: null

	return (
		<>
		<div
				className='w-full px-5 py-4 flex flex-col justify-start items-center cursor-pointer hover:bg-neutral-50'
			onClick={onClick}
		>
				<div className='w-full flex justify-center items-center gap-3'>
					{/* 프로필 이미지 */}
					{isGroup ? (
						participantCount >= 4 ? (
							// 4명 이상: 2x2 그리드 레이아웃
							<div className='w-10 h-10 relative shrink-0'>
								{displayParticipants.map((participant, index) => {
									const positions = [
										{ left: 'left-0', top: 'top-0' }, // 왼쪽 위
										{ left: 'left-[21.51px]', top: 'top-[21.51px]' }, // 오른쪽 아래
										{ left: 'left-0', top: 'top-[21.51px]' }, // 왼쪽 아래
										{ left: 'left-[21.51px]', top: 'top-0' }, // 오른쪽 위
									]
									const pos = positions[index]
									return (
										<div key={index} className={`w-5 h-5 ${pos.left} ${pos.top} absolute`}>
											{participant && participant !== defaultImage ? (
												<img
													className='w-5 h-5 absolute inset-0 rounded-full outline-1 outline-neutral-000 object-cover'
													src={participant}
													alt={`Participant ${index + 1}`}
													onError={(e) => {
														const target = e.target as HTMLImageElement
														target.src = defaultImage
													}}
												/>
											) : (
												<div className='w-5 h-5 absolute inset-0 rounded-full outline-1 outline-neutral-000 bg-neutral-200' />
											)}
										</div>
									)
								})}
							</div>
						) : participantCount === 3 ? (
							// 3명: 특별한 레이아웃 (삼각형 배치)
							<div className='w-11 h-11 p-px relative shrink-0'>
								{displayParticipants.map((participant, index) => {
									const positions = [
										{ left: 'left-[21.51px]', top: 'top-[19.51px]' }, // 오른쪽 아래
										{ left: 'left-[10.8px]', top: 'top-0' }, // 중앙 위
										{ left: 'left-0', top: 'top-[19.51px]' }, // 왼쪽 아래
									]
									const pos = positions[index]
									return (
										<div key={index} className={`w-5 h-5 ${pos.left} ${pos.top} absolute`}>
											{participant && participant !== defaultImage ? (
												<img
													className='w-5 h-5 absolute inset-0 rounded-full outline-1 outline-neutral-000 object-cover'
													src={participant}
													alt={`Participant ${index + 1}`}
													onError={(e) => {
														const target = e.target as HTMLImageElement
														target.src = defaultImage
													}}
												/>
											) : (
												<div className='w-5 h-5 absolute inset-0 rounded-full outline-1 outline-neutral-000 bg-neutral-200' />
											)}
										</div>
									)
								})}
							</div>
						) : participantCount === 2 ? (
							// 2명: 대각선 배치 (겹치는 레이아웃)
							<div className='w-11 h-11 relative shrink-0 flex items-center'>
								{displayParticipants.map((participant, index) => {
									const positions = [
										{ left: 'left-0', top: 'top-0', zIndex: 'z-0' }, // 첫 번째: 왼쪽 위
										{ left: 'left-4', top: 'top-4', zIndex: 'z-10' }, // 두 번째: 오른쪽 아래 (대각선, 위로 올라옴)
									]
									const pos = positions[index]
									return (
										<div key={index} className={`w-6 h-6 ${pos.left} ${pos.top} ${pos.zIndex} absolute`}>
											{participant && participant !== defaultImage ? (
												<img
													className='w-6 h-6 absolute inset-0 rounded-full outline-1 outline-neutral-000 object-cover'
													src={participant}
													alt={`Participant ${index + 1}`}
													onError={(e) => {
														const target = e.target as HTMLImageElement
														target.src = defaultImage
													}}
												/>
											) : (
												<div className='w-6 h-6 absolute inset-0 rounded-full outline-1 outline-neutral-000 bg-neutral-200' />
											)}
										</div>
									)
								})}
				</div>
			) : (
							// 1명: 단일 이미지
							<div className='w-11 h-11 relative shrink-0'>
								{displayParticipants[0] && displayParticipants[0] !== defaultImage ? (
									<img
										className='w-11 h-11 absolute inset-0 rounded-full outline-1 outline-neutral-000 object-cover'
										src={displayParticipants[0]}
										alt='Participant'
										onError={(e) => {
											const target = e.target as HTMLImageElement
											target.src = defaultImage
										}}
									/>
								) : (
									<div className='w-11 h-11 absolute inset-0 rounded-full outline-1 outline-neutral-000 bg-neutral-200' />
								)}
							</div>
						)
					) : (
						// 개인 채팅: 하나의 큰 프로필 이미지
				<div className='w-11 h-11 relative shrink-0'>
					{message.profileImage && message.profileImage !== defaultImage ? (
						<img
							className='w-11 h-11 absolute inset-0 rounded-full outline-1 outline-neutral-000 object-cover z-10'
							src={message.profileImage}
							alt={message.senderName}
							onError={(e) => {
								const target = e.target as HTMLImageElement
								target.style.display = 'none'
							}}
						/>
					) : null}
					{/* Fallback 이미지 (항상 배경으로 표시) */}
					<div className='w-11 h-11 absolute inset-0 rounded-full outline-1 outline-neutral-000 bg-neutral-200' />
				</div>
			)}

					{/* 메시지 정보 */}
			<div className='flex-1 flex justify-between items-center min-w-0'>
						{/* 왼쪽: 이름/역할, 멤버 수, 마지막 메시지 */}
						<div className='flex-1 flex flex-col justify-start items-start gap-0.5 min-w-0'>
					<div className='self-stretch inline-flex justify-start items-center gap-1'>
								<div className='justify-center text-neutral-900 body-1 font-semibold leading-6'>
									{message.senderName}
								</div>
								{isGroup && message.memberCount !== undefined && (
									<div className='justify-center text-neutral-500 body-2 font-medium leading-4'>
										{message.memberCount === 2 && fieldDisplayName 
											? fieldDisplayName 
											: message.memberCount}
									</div>
						)}
								{!isGroup && message.role && (
									<div className='justify-center text-neutral-500 body-2 font-medium leading-5'>{message.role}</div>
						)}
					</div>
							<div
								className={`self-stretch justify-center label font-medium leading-5 line-clamp-1 ${
									isGroup ? 'text-neutral-600' : 'text-neutral-500'
								}`}
							>
								{message.content}
							</div>
				</div>

						{/* 오른쪽: 시간, 읽지 않은 메시지 수 */}
						<div className='h-11 pt-0.5 inline-flex flex-col justify-start items-end gap-2.5'>
							<div className='w-14 h-3.5 text-right justify-center text-neutral-500 caption-1 font-regular leading-4'>
								{message.time}
							</div>
							{message.unreadCount && message.unreadCount > 0 && (
								<div
									className={`bg-primary-600-normal rounded-xl inline-flex justify-center items-center ${
										message.unreadCount > 99
											? 'h-[18px] px-1.5' // 99+: 큰 배지
											: message.unreadCount >= 10
												? 'h-[18px] px-1.5' // 10 이상: 큰 배지
												: message.unreadCount === 1
													? 'h-[13px] px-1' // 1: 작은 배지
													: 'w-[18px] h-[18px] px-1.5' // 2-9: 원형 배지
									}`}
								>
									<span
										className={`text-center text-neutral-000 font-medium leading-normal ${
											message.unreadCount === 1 ? 'caption-3' : 'caption-1'
										}`}
									>
										{message.unreadCount > 99 ? '99+' : message.unreadCount}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
			</div>
			{/* 구분선 */}
			{showDivider && (
				<div className='w-[356px] h-px border-t border-neutral-200 mx-auto' />
			)}
		</>
	)
}

