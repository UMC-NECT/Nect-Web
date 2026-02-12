import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import hamburger from '@/assets/icons/common/hamburger-bar.svg'
import chat from '@/assets/icons/common/message.svg'
import Breadcrumb from '@/components/common/Breadcrumb'

// Modals
import SelectProjectModal from '@/components/matching-available/SelectProjectModal'
import NoMatchingProjectModal from '@/components/matching-available/NoMatchingProjectModal'
import MatchingRequestConfirmModal from '@/components/matching-available/MatchingRequestConfirmModal'
import MatchingLimitModal from '@/components/matching-available/MatchingLimitModal'
import MatchingRequestModal from '@/components/recruiting-projects/MatchingRequestModal'
import MatchingSuccessModal from '@/components/recruiting-projects/MatchingSuccessModal'
import MatchingCancelModal from '@/components/recruiting-projects/MatchingCancelModal'
import MatchingBlockedModal from '@/components/recruiting-projects/MatchingBlockedModal'

// Components
import MemberProfileHeader from '@/components/recruiting-projects/MemberProfileHeader'
import MemberProfileDetail from '@/components/recruiting-projects/MemberProfileDetail'

// Hooks
import { useMemberDetail } from '@/hooks/queries/member/useMemberDetail'
import { useMatchingsSentQuery, useMatchingCancelMutation, useMatchingProjectToUserMutation } from '@/hooks/mypage/useMatchingApi'
import { useProjectRecruitments } from '@/hooks/queries/project'

const MatchingAvailablePage = () => {
	const { userId } = useParams<{ userId: string }>()

	// 사용자 상세 정보
	const {
		data: memberData,
		isLoading,
		error,
	} = useMemberDetail(Number(userId), {
		enabled: !!userId,
	})

	const { data: sentMatchingsData } = useMatchingsSentQuery('project', 'pending')
	const cancelMutation = useMatchingCancelMutation()
	const matchingRequestMutation = useMatchingProjectToUserMutation()

	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
	const [selectedField, setSelectedField] = useState<string>('')

	const { data: recruitments } = useProjectRecruitments(selectedProjectId || 0)

	// Modal States
	const [isSelectModalOpen, setIsSelectModalOpen] = useState(false)
	const [isSelectMultipleModalOpen, setIsSelectMultipleModalOpen] = useState(false)
	const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
	const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
	const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false)
	const [isLimitModalOpen, setIsLimitModalOpen] = useState(false)
	const [isNoProjectModalOpen, setIsNoProjectModalOpen] = useState(false)

	const [matchingCount, setMatchingCount] = useState(0)
	const [cancelMatchingId, setCancelMatchingId] = useState('')
	const [isHovered, setIsHovered] = useState(false)

	// 현재 활성화된(PENDING) 매칭 ID 확인
	const currentMatchingId = useMemo(() => {
		const activeMatching = sentMatchingsData?.body?.projectMatchings?.find(matching => matching.matchingStatus === 'PENDING')
		return activeMatching?.matchingId ? String(activeMatching.matchingId) : ''
	}, [sentMatchingsData])

	const isMatching = !!currentMatchingId

	// Helper: Position Styles
	const getPositionStyle = (position: string) => {
		const positionName = position.toLowerCase()
		const styles: Record<string, string> = {
			pm: 'bg-tag-purple',
			design: 'bg-tag-pink',
			frontend: 'bg-tag-green',
			backend: 'bg-tag-blue',
			develop: 'bg-tag-blue',
			server: 'bg-tag-orange',
			data: 'bg-tag-yellow',
		}
		return styles[positionName] || 'bg-tag-yellow'
	}

	// Helper: Error Checking
	const isMatchingLimitError = (error: unknown) => {
		const err = error as { response?: { data?: { status?: { message?: string; description?: string } } } }
		const status = err?.response?.data?.status
		const combinedMessage = [status?.message, status?.description].filter(Boolean).join(' ')
		return combinedMessage.includes('해당 프로젝트의 해당 분야의 매칭 신청 가능 수를 초과하였습니다')
	}

	// Handlers
	const handleMatchingButtonClick = () => {
		let realTimeMatchingId = currentMatchingId

		if (sentMatchingsData?.body?.projectMatchings) {
			const activeMatching = sentMatchingsData.body.projectMatchings.find(matching => matching.matchingStatus === 'PENDING')

			if (activeMatching?.matchingId) {
				realTimeMatchingId = String(activeMatching.matchingId)
			}
		}

		if (isMatching || realTimeMatchingId) {
			if (!realTimeMatchingId) {
				return
			}
			setCancelMatchingId(realTimeMatchingId)
			setIsCancelModalOpen(true)
		} else if (matchingCount === 0) {
			setIsSelectModalOpen(true)
		} else if (matchingCount === 1) {
			// 이미 하나가 매칭되어 있다면 다중 선택 모달 (새로운 기획 반영)
			setIsSelectMultipleModalOpen(true)
		} else if (matchingCount >= 2) {
			setIsLimitModalOpen(true)
		}
	}

	const handleProjectSelect = (projectId: string) => {
		setSelectedProjectId(Number(projectId))
		setIsSelectModalOpen(false)
		setIsRequestModalOpen(true)
	}

	const handleFieldSelect = (field: string) => {
		setSelectedField(field)
		setIsRequestModalOpen(false)
		setIsConfirmModalOpen(true)
	}

	const handleMatchingConfirm = async () => {
		if (!selectedProjectId || !userId || !selectedField) {
			return
		}

		// PENDING 상태 매칭 개수 확인
		const totalPendingCount =
			sentMatchingsData?.body?.projectMatchings?.filter(matching => matching.matchingStatus === 'PENDING').length || 0

		// 3개 이상이면 제한 모달 표시
		if (totalPendingCount >= 3) {
			setIsConfirmModalOpen(false)
			setIsLimitModalOpen(true)
			return
		}

		const requestData = {
			projectId: String(selectedProjectId),
			targetUserId: userId,
			body: { field: selectedField },
		}

		try {
			await matchingRequestMutation.mutateAsync(requestData)
			setIsConfirmModalOpen(false)
			setIsSuccessModalOpen(true)
		} catch (error: unknown) {
			if (isMatchingLimitError(error)) {
				setIsConfirmModalOpen(false)
				setIsLimitModalOpen(true)
				return
			}
			console.error('매칭 요청 실패:', error)
		}
	}

	const handleMatchingSuccess = () => {
		setMatchingCount(matchingCount + 1)
		setIsSuccessModalOpen(false)
		setSelectedProjectId(null)
		setSelectedField('')
	}

	const handleCancelConfirm = () => {
		const matchingId = cancelMatchingId || currentMatchingId
		if (!matchingId) {
			return
		}

		cancelMutation.mutate(matchingId, {
			onSuccess: () => {
				setMatchingCount(Math.max(0, matchingCount - 1))
				setCancelMatchingId('')
				setIsCancelModalOpen(false)
			},
			onError: error => {
				console.error('매칭 취소 실패:', error)
				setCancelMatchingId('')
				setIsCancelModalOpen(false)
			},
		})
	}

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<p className='text-neutral-500'>로딩 중...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<p className='text-red-500'>멤버 정보를 불러올 수 없습니다</p>
					<p className='text-sm text-neutral-500 mt-2'>에러: {error.message}</p>
				</div>
			</div>
		)
	}

	if (!memberData) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<p className='text-red-500'>멤버 데이터가 없습니다</p>
			</div>
		)
	}

	const actionButtons = (
		<>
			<div className='relative group'>
				<img
					src={chat}
					alt='Chat'
					className='w-[48px] h-[48px] p-[10px] cursor-pointer hover:bg-neutral-100 rounded-lg'
				/>
				<div className='absolute top-[58px] right-[-68px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
					<div className='w-[173px] bg-neutral-500 text-white px-[4px] py-[8px] rounded-lg text-[11px] flex items-center justify-center whitespace-nowrap'>
						대화 요청으로 메세지를 나눠보세요 !
					</div>
					<div className='absolute top-[-5px] right-[85px] w-3 h-3 bg-neutral-500 transform rotate-45'></div>
				</div>
			</div>

			<button
				onClick={handleMatchingButtonClick}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				className={`w-[130px] h-[48px] rounded-xl font-semibold text-[16px] transition-colors
                    ${
						isMatching && isHovered
							? 'bg-primary-300-light text-primary-500-normal hover:bg-primary-300-light'
							: isMatching
								? 'bg-primary-100-light text-primary-500-normal'
								: 'bg-primary-400-normal text-neutral-50 hover:bg-primary-500-normal'
					}`}
			>
				{isMatching && isHovered ? '신청 취소' : isMatching ? '매칭 신청 중' : '매칭 신청'}
			</button>
		</>
	)

	return (
		<div className='relative bg-neutral-50 w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] min-h-screen px-8 py-8 pb-[120px]'>
			<div className='max-w-[1200px] mx-auto flex flex-col items-center'>
				<div className='w-[916px]'>
					<div className='mt-[36px]'>
						<Breadcrumb
							items={[
								{ label: '홈', path: '/' },
								{ label: '지금 매칭 가능한 넥터', path: '/necterList' },
								{ label: memberData.nickname || memberData.name },
							]}
						/>
					</div>
					<div className='mt-8 flex items-center justify-between'>
						<h1 className='text-[28px] font-bold mt-1'>지금 매칭 가능한 넥터</h1>
						<Link
							to='/necterList'
							className='mt-4 text-xl font-semibold w-[135px] h-[48px] flex items-center justify-center gap-2.5 bg-neutral-100 border border-neutral-200 rounded-xl'
						>
							<img src={hamburger} alt='Menu' />
							<p className='text-[14px] text-neutral-400'>목록으로 가기</p>
						</Link>
					</div>
				</div>

				<div className='mt-9 w-[916px] bg-white rounded-lg border border-neutral-200 shadow-sm'>
					<div className='w-full pl-[46px] pt-[56px] pr-[46px] pb-[56px]'>
						<MemberProfileHeader member={memberData} actionButtons={actionButtons} />
					</div>
					<div className='mt-[20px] pt-[40px] pb-[40px] px-[56px]'>
						<MemberProfileDetail memberData={memberData} />
					</div>
				</div>

				<SelectProjectModal
					isOpen={isSelectModalOpen}
					onClose={() => setIsSelectModalOpen(false)}
					onConfirm={handleProjectSelect}
					onNoProject={() => {
						setIsSelectModalOpen(false)
						setIsNoProjectModalOpen(true)
					}}
				/>

				{/* TODO: 다중 프로젝트 선택 모달 구현 예정 */}
				<SelectProjectModal
					isOpen={isSelectMultipleModalOpen}
					onClose={() => setIsSelectMultipleModalOpen(false)}
					onConfirm={handleProjectSelect}
					onNoProject={() => {
						setIsSelectMultipleModalOpen(false)
						setIsNoProjectModalOpen(true)
					}}
				/>

				<NoMatchingProjectModal isOpen={isNoProjectModalOpen} onClose={() => setIsNoProjectModalOpen(false)} />

				<MatchingRequestModal
					isOpen={isRequestModalOpen}
					onClose={() => setIsRequestModalOpen(false)}
					onMatchingComplete={handleFieldSelect}
					getPositionStyle={getPositionStyle}
					recruitments={recruitments || []}
				/>

				<MatchingRequestConfirmModal
					isOpen={isConfirmModalOpen}
					onClose={() => setIsConfirmModalOpen(false)}
					onConfirm={handleMatchingConfirm}
					memberName={memberData.name || memberData.nickname}
					position={selectedField}
				/>

				<MatchingSuccessModal isOpen={isSuccessModalOpen} onClose={handleMatchingSuccess} />

				<MatchingCancelModal
					isOpen={isCancelModalOpen}
					onClose={() => setIsCancelModalOpen(false)}
					onConfirm={handleCancelConfirm}
					matchingId={currentMatchingId}
				/>

				<MatchingBlockedModal isOpen={isBlockedModalOpen} onClose={() => setIsBlockedModalOpen(false)} />

				<MatchingLimitModal
					isOpen={isLimitModalOpen}
					onClose={() => setIsLimitModalOpen(false)}
					onConfirm={() => setIsLimitModalOpen(false)}
				/>
			</div>
		</div>
	)
}

export default MatchingAvailablePage
