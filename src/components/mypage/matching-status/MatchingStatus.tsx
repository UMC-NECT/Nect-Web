import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { MyPageHeader } from '../MyPageHeader'
import ProjectCard from './ProjectCard'
import ProfileCard from './ProfileCard'
import MatchingTimerCard from './MatchingTimerCard'
import MatchingNotice from './MatchingNotice'
import RoleTagChip from '@/components/mission-modal/RoleTagChip'
import { RECEIVED_REQUEST_NOTICES, SENT_REQUEST_NOTICES } from '@/constants/matchingNotice'
import CTAModal from '@/components/common/CTAModal'
import SegmentTabButton from '../SegmentTabButton'
import {
	useMatchingCountQuery,
	useMatchingsReceivedTotalQuery,
	useMatchingsSentTotalQuery,
	useMatchingAcceptMutation,
	useMatchingCancelMutation,
	useMatchingRejectMutation,
} from '@/hooks/mypage/useMatchingApi'

type TabType = 'received' | 'sent'

// 역할 이름을 roleId로 매핑
const getRoleIdByName = (roleName: string): number => {
	const roleMap: Record<string, number> = {
		PM: 1,
		Design: 2,
		Frontend: 3,
		Backend: 4,
		DESIGN: 2,
		FRONTEND: 3,
		BACKEND: 4,
	}
	return roleMap[roleName] || 1
}

// userMatchings를 field 기준으로 그룹핑
const groupUserMatchingsByField = <T extends { field: string }>(userMatchings: T[]) => {
	const grouped: Record<string, T[]> = {}
	for (const user of userMatchings) {
		const field = user.field || 'ETC'
		if (!grouped[field]) {
			grouped[field] = []
		}
		grouped[field].push(user)
	}
	return Object.entries(grouped).map(([field, members]) => ({
		field,
		members,
	}))
}

export const MatchingStatus = () => {
	const navigate = useNavigate()
	const [activeTab, setActiveTab] = useState<TabType>('received')
	const [modalType, setModalType] = useState<
		'reject' | 'rejectSuccess' | 'accept' | 'acceptSuccess' | 'cancel' | 'cancelSuccess' | null
	>(null)
	const [selectedMatchingId, setSelectedMatchingId] = useState<string | null>(null)

	// API 훅
	const { data: countData } = useMatchingCountQuery()
	const { data: receivedData } = useMatchingsReceivedTotalQuery()
	const { data: sentData } = useMatchingsSentTotalQuery()

	const acceptMutation = useMatchingAcceptMutation()
	const cancelMutation = useMatchingCancelMutation()
	const rejectMutation = useMatchingRejectMutation()

	const receivedCount = countData?.body?.receivedCount ?? 0
	const sentCount = countData?.body?.sentCount ?? 0

	const receivedProjectMatchings = useMemo(
		() => receivedData?.body?.projectMatchings ?? [],
		[receivedData?.body?.projectMatchings]
	)
	const receivedUserMatchings = useMemo(() => receivedData?.body?.userMatchings ?? [], [receivedData?.body?.userMatchings])
	const sentProjectMatchings = useMemo(() => sentData?.body?.projectMatchings ?? [], [sentData?.body?.projectMatchings])
	const sentUserMatchings = useMemo(() => sentData?.body?.userMatchings ?? [], [sentData?.body?.userMatchings])

	// userMatchings를 field 기준으로 그룹핑
	const receivedGrouped = useMemo(() => groupUserMatchingsByField(receivedUserMatchings), [receivedUserMatchings])
	const sentGrouped = useMemo(() => groupUserMatchingsByField(sentUserMatchings), [sentUserMatchings])

	// 모달 핸들러
	const handleAcceptClick = (matchingId?: number) => {
		setSelectedMatchingId(matchingId?.toString() ?? null)
		setModalType('accept')
	}

	const handleRejectClick = (matchingId?: number) => {
		setSelectedMatchingId(matchingId?.toString() ?? null)
		setModalType('reject')
	}

	const handleCancelClick = (matchingId?: number) => {
		setSelectedMatchingId(matchingId?.toString() ?? null)
		setModalType('cancel')
	}

	const handleAcceptConfirm = () => {
		if (!selectedMatchingId) return
		acceptMutation.mutate(selectedMatchingId, {
			onSuccess: () => setModalType('acceptSuccess'),
		})
	}

	const handleRejectConfirm = () => {
		if (!selectedMatchingId) return
		rejectMutation.mutate(
			{ matchingId: selectedMatchingId, body: { rejectReason: 'OTHER' } },
			{ onSuccess: () => setModalType('rejectSuccess') }
		)
	}

	const handleCancelConfirm = () => {
		if (!selectedMatchingId) return
		cancelMutation.mutate(selectedMatchingId, {
			onSuccess: () => setModalType('cancelSuccess'),
		})
	}

	const handleModalClose = () => {
		setModalType(null)
		setSelectedMatchingId(null)
	}

	const handleProfileClick = (userId: number) => {
		navigate(`/matching-available/${userId}?from=matching`)
	}

	return (
		<div className='ml-7'>
			<MyPageHeader />

			{/* 전체 컨테이너 */}
			<div className='w-[916px] px-11.5 py-11.5 rounded-12 bg-white border border-neutral-200'>
				{/* 탭 영역 */}
				<div className='flex items-center gap-1 mb-[38px]'>
					<SegmentTabButton
						label='받은 요청'
						count={receivedCount}
						isActive={activeTab === 'received'}
						onClick={() => setActiveTab('received')}
					/>
					<SegmentTabButton
						label='보낸 요청'
						count={sentCount}
						isActive={activeTab === 'sent'}
						onClick={() => setActiveTab('sent')}
					/>
				</div>

				{/* 탭 컨텐츠 */}
				<div className='flex flex-col gap-16'>
					{activeTab === 'received' && (
						<>
							{/* 프로젝트 섹션 */}
							<div className='flex flex-col gap-3.5 items-start py-2.5 relative shrink-0 w-full'>
								<div className='flex items-center justify-between pl-2.5 pr-5 relative shrink-0 w-full'>
									<div className='flex h-[26px] items-center justify-center px-2.5 relative shrink-0'>
										<p className='title-2 font-bold text-neutral-900 whitespace-nowrap leading-[1.4]'>
											프로젝트
										</p>
									</div>
								</div>
								<div className='flex flex-col gap-1 items-center px-5 relative shrink-0 w-full'>
									{receivedProjectMatchings.map(project => (
										<div key={project.projectId} className='flex gap-1 items-center'>
											<ProjectCard
												projectName={project.title}
												category=''
												description={project.description}
												currentMembers={project.currentMembersNum}
												totalMembers={0}
											/>
											<MatchingTimerCard
												requestType='received'
												status='default'
												timerText='00:00:00'
												onAccept={() => handleAcceptClick(project.matchingId)}
												onReject={() => handleRejectClick(project.matchingId)}
											/>
										</div>
									))}
								</div>
							</div>

							{/* 넥트 팀원 섹션 */}
							<div className='flex flex-col gap-6 items-start relative shrink-0 w-full'>
								<div className='flex items-center justify-between pl-2.5 pr-5 relative shrink-0 w-full'>
									<div className='flex h-[26px] items-center justify-center px-2.5 relative shrink-0'>
										<p className='title-2 font-bold text-neutral-900 whitespace-nowrap leading-[1.4]'>
											넥트 팀원
										</p>
									</div>
								</div>
								<div className='flex flex-col gap-10 items-start px-5 relative shrink-0 w-full'>
									{receivedGrouped.map(group => (
										<div
											key={group.field}
											className='flex flex-col gap-3 items-start relative shrink-0 w-full'
										>
											<RoleTagChip
												roleId={getRoleIdByName(group.field)}
												roleName={group.field}
												state='default'
											/>
											<div className='flex flex-col gap-3 items-start relative shrink-0 w-full'>
												{group.members.map(member => (
													<div
														key={member.userId}
														className='flex gap-1 items-center relative shrink-0 w-full'
													>
														<ProfileCard
															imageUrl={member.profileUrl}
															nickname={member.nickname}
															part={member.field}
															introduction={member.bio}
															onClick={() => handleProfileClick(member.userId)}
														/>
														<MatchingTimerCard
															requestType='received'
															status='default'
															timerText='00:00:00'
															onAccept={() => handleAcceptClick(member.matchingId)}
															onReject={() => handleRejectClick(member.matchingId)}
														/>
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							</div>

							{/* 유의사항 섹션 */}
							<div className='flex flex-col gap-1.5 items-start py-2.5 relative shrink-0 w-full'>
								<div className='flex items-center justify-between pl-2.5 pr-5 relative shrink-0 w-full'>
									<div className='flex h-[26px] items-center justify-center px-2.5 relative shrink-0'>
										<p className='title-2 font-bold text-neutral-900 whitespace-nowrap leading-[1.4]'>
											유의사항
										</p>
									</div>
								</div>
								<div className='flex flex-col items-start px-5 py-4 relative shrink-0 w-full'>
									<MatchingNotice items={RECEIVED_REQUEST_NOTICES} />
								</div>
							</div>
						</>
					)}
					{activeTab === 'sent' && (
						<>
							{/* 프로젝트 섹션 */}
							<div className='flex flex-col gap-3.5 items-start py-2.5 relative shrink-0 w-full'>
								<div className='flex items-center justify-between pl-2.5 pr-5 relative shrink-0 w-full'>
									<div className='flex h-[26px] items-center justify-center px-2.5 relative shrink-0'>
										<p className='title-2 font-bold text-neutral-900 whitespace-nowrap leading-[1.4]'>
											프로젝트
										</p>
									</div>
								</div>
								<div className='flex flex-col gap-1 items-center px-5 relative shrink-0 w-full'>
									{sentProjectMatchings.map(project => (
										<div key={project.projectId} className='flex gap-1 items-center'>
											<ProjectCard
												projectName={project.title}
												category=''
												description={project.description}
												currentMembers={project.currentMembersNum}
												totalMembers={0}
											/>
											<MatchingTimerCard
												requestType='sent'
												status='default'
												timerText='00:00:00'
												onCancel={() => handleCancelClick(project.matchingId)}
											/>
										</div>
									))}
								</div>
							</div>

							{/* 넥트 팀원 섹션 */}
							<div className='flex flex-col gap-6 items-start relative shrink-0 w-full'>
								<div className='flex items-center justify-between pl-2.5 pr-5 relative shrink-0 w-full'>
									<div className='flex h-[26px] items-center justify-center px-2.5 relative shrink-0'>
										<p className='title-2 font-bold text-neutral-900 whitespace-nowrap leading-[1.4]'>
											넥트 팀원
										</p>
									</div>
								</div>
								<div className='flex flex-col gap-10 items-start px-5 relative shrink-0 w-full'>
									{sentGrouped.map(group => (
										<div
											key={group.field}
											className='flex flex-col gap-3 items-start relative shrink-0 w-full'
										>
											<RoleTagChip
												roleId={getRoleIdByName(group.field)}
												roleName={group.field}
												state='default'
											/>
											<div className='flex flex-col gap-3 items-start relative shrink-0 w-full'>
												{group.members.map(member => (
													<div
														key={member.userId}
														className='flex gap-1 items-center relative shrink-0 w-full'
													>
														<ProfileCard
															imageUrl={member.profileUrl}
															nickname={member.nickname}
															part={member.field}
															introduction={member.bio}
															onClick={() => handleProfileClick(member.userId)}
														/>
														<MatchingTimerCard
															requestType='sent'
															status='default'
															timerText='00:00:00'
															onCancel={() => handleCancelClick(member.matchingId)}
														/>
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							</div>

							{/* 유의사항 섹션 */}
							<div className='flex flex-col gap-1.5 items-start py-2.5 relative shrink-0 w-full'>
								<div className='flex items-center justify-between pl-2.5 pr-5 relative shrink-0 w-full'>
									<div className='flex h-[26px] items-center justify-center px-2.5 relative shrink-0'>
										<p className='title-2 font-bold text-neutral-900 whitespace-nowrap leading-[1.4]'>
											유의사항
										</p>
									</div>
								</div>
								<div className='flex flex-col items-start px-5 py-4 relative shrink-0 w-full'>
									<MatchingNotice items={SENT_REQUEST_NOTICES} />
								</div>
							</div>
						</>
					)}
				</div>
			</div>

			{/* 매칭 거절 확인 모달 */}
			{modalType === 'reject' && (
				<CTAModal
					message='매칭 요청을 {거절} 하시겠습니까?'
					subMessage='거절 후 되돌릴 수 없습니다.'
					leftButtonMsg='돌아가기'
					rightButtonMsg='매칭 거절'
					onLeftClick={handleModalClose}
					onRightClick={handleRejectConfirm}
				/>
			)}

			{/* 매칭 거절 성공 모달 */}
			{modalType === 'rejectSuccess' && (
				<CTAModal
					message='매칭 요청이 거절 되었습니다'
					subMessage=''
					isMessageHighlight={true}
					buttonMsg='확인'
					onButtonClick={handleModalClose}
				/>
			)}

			{/* 매칭 수락 확인 모달 */}
			{modalType === 'accept' && (
				<CTAModal
					message='매칭 요청을 {수락} 하시겠습니까?'
					subMessage='수락 후 번복 할 수 없습니다.'
					leftButtonMsg='돌아가기'
					rightButtonMsg='매칭 수락'
					onLeftClick={handleModalClose}
					onRightClick={handleAcceptConfirm}
				/>
			)}

			{/* 매칭 수락 성공 모달 */}
			{modalType === 'acceptSuccess' && (
				<CTAModal
					message='매칭이 수락 되었습니다'
					subMessage='넥트가 응원할게요 !'
					isMessageHighlight={true}
					buttonMsg='확인'
					onButtonClick={handleModalClose}
				/>
			)}

			{/* 매칭 취소 확인 모달 */}
			{modalType === 'cancel' && (
				<CTAModal
					message='매칭 요청을 {취소} 하시겠습니까?'
					subMessage='취소 후 24시간 동안 해당 프로젝트 매칭 신청이 제한됩니다.'
					leftButtonMsg='돌아가기'
					rightButtonMsg='매칭 취소'
					onLeftClick={handleModalClose}
					onRightClick={handleCancelConfirm}
				/>
			)}

			{/* 매칭 취소 성공 모달 */}
			{modalType === 'cancelSuccess' && (
				<CTAModal
					message='매칭 요청이 취소 되었습니다'
					subMessage=''
					isMessageHighlight={true}
					buttonMsg='확인'
					onButtonClick={handleModalClose}
				/>
			)}
		</div>
	)
}
