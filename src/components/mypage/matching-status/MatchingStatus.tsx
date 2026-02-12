import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { MyPageHeader } from '../MyPageHeader'
import { MatchingListItem } from './MatchingListItem'
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
import { useMatchingTimer } from '@/hooks/mypage/useMatchingTimer'
import LoadingModal from '@/components/splash/LoadingModal'

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
	const { currentTime, initialTime } = useMatchingTimer()
	const [modalType, setModalType] = useState<
		'reject' | 'rejectSuccess' | 'accept' | 'acceptSuccess' | 'cancel' | 'cancelSuccess' | null
	>(null)
	const [selectedMatchingId, setSelectedMatchingId] = useState<string | null>(null)

	// API 훅
	const { data: countData, isLoading: isCountLoading } = useMatchingCountQuery()
	const { data: receivedData, isLoading: isReceivedLoading } = useMatchingsReceivedTotalQuery()
	const { data: sentData, isLoading: isSentLoading } = useMatchingsSentTotalQuery()

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

	const isLoading = isCountLoading || isReceivedLoading || isSentLoading

	return (
		<div className='ml-7'>
			<MyPageHeader />
			{isLoading && <LoadingModal />}
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
							<div className='flex flex-col gap-3.5 items-start relative shrink-0 w-full'>
								<div className='flex items-center justify-between pl-2.5 pr-5 relative shrink-0 w-full'>
									<div className='flex h-[26px] items-center justify-center px-2.5 relative shrink-0'>
										<p className='title-2 font-bold text-neutral-900 whitespace-nowrap leading-[1.4]'>
											프로젝트
										</p>
									</div>
								</div>
								<div className='flex flex-col gap-1 items-center px-5 relative shrink-0 w-full'>
									{receivedProjectMatchings.length && (
										<div className='flex flex-col mr-auto'>
										<p className='body-1 text-neutral-500 font-medium px-2'>받은 매칭 요청이 없습니다</p>
									</div>
									)}
									{receivedProjectMatchings.map(project => (
										<MatchingListItem
											key={project.projectId}
											item={project}
											itemType='project'
											requestType='received'
											currentTime={currentTime}
											initialTime={initialTime}
											onAccept={handleAcceptClick}
											onReject={handleRejectClick}
										/>
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
									{receivedGrouped.length === 0 && (
										<div className='flex flex-col items-center justify-center'>
											<p className='body-1 text-neutral-500 font-medium px-2'>받은 매칭 요청이 없습니다</p>
										</div>
									)}
									{receivedGrouped.map(group => (
										<div
											key={group.field}
											className='flex flex-col gap-3 items-start relative shrink-0 w-full'
										>
											<RoleTagChip
												roleId={getRoleIdByName(group.field)}
												roleName={group.field}
												roleField={group.field}
												state='default'
											/>
											<div className='flex flex-col gap-3 items-start relative shrink-0 w-full'>
												{group.members.map(member => (
													<MatchingListItem
														key={member.userId}
														item={member}
														itemType='user'
														requestType='received'
														currentTime={currentTime}
														initialTime={initialTime}
														onAccept={handleAcceptClick}
														onReject={handleRejectClick}
														onProfileClick={handleProfileClick}
													/>
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
									{sentProjectMatchings.length === 0 && (
										<div className='flex flex-col mr-auto'>
											<p className='body-1 text-neutral-500 font-medium px-2'>보낸 매칭 요청이 없습니다</p>
										</div>
									)}
									{sentProjectMatchings.map(project => (
										<MatchingListItem
											key={project.projectId}
											item={project}
											itemType='project'
											requestType='sent'
											currentTime={currentTime}
											initialTime={initialTime}
											onCancel={handleCancelClick}
										/>
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
									{sentGrouped.length === 0 && (
										<div className='flex flex-col items-center justify-center'>
											<p className='body-1 text-neutral-500 font-medium px-2'>보낸 매칭 요청이 없습니다</p>
										</div>
									)}
									{sentGrouped.map(group => (
										<div
											key={group.field}
											className='flex flex-col gap-3 items-start relative shrink-0 w-full'
										>
											<RoleTagChip
												roleId={getRoleIdByName(group.field)}
												roleName={group.field}
												roleField={group.field}
												state='default'
											/>
											<div className='flex flex-col gap-3 items-start relative shrink-0 w-full'>
												{group.members.map(member => (
													<MatchingListItem
														key={member.userId}
														item={member}
														itemType='user'
														requestType='sent'
														currentTime={currentTime}
														initialTime={initialTime}
														onCancel={handleCancelClick}
														onProfileClick={handleProfileClick}
													/>
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
