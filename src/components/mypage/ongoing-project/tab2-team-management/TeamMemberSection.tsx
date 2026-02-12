import { useEffect, useState } from 'react'
import RoleTagChip from '@/components/mission-modal/RoleTagChip'
import ProfileCard from '@/components/mypage/ProfileCard'
import type { TeamMember } from '@/types/mypage/ongoindProject'
import TeamMemberModal from './modals/TeamMemberModal'
import { useTeamMembersStore } from '@/stores/useTeamMembersStore'
import { usePatchMemberTypeMutation, usePatchMemberKickMutation } from '@/hooks/mypage/useMypageApi'

interface ITeamMemberSection {
	roleId?: number
	role: string
	roleField?: string
	members: TeamMember[]
	onOpenPartSettings?: () => void
}

const TeamMemberSection = ({ roleId, role, roleField, members, onOpenPartSettings }: ITeamMemberSection) => {
	const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
	const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | undefined>(undefined)

	// 팀원 관리용
	const setLeader = useTeamMembersStore(state => state.setLeader)
	const removeMember = useTeamMembersStore(state => state.removeMember)
	const patchMemberTypeMutation = usePatchMemberTypeMutation()
	const patchMemberKickMutation = usePatchMemberKickMutation()

	// 모달이 열리면 백그라운드 스크롤 방지
	useEffect(() => {
		if (openDropdownId) {
			// 스크롤바 너비 계산
			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

			document.documentElement.style.overflow = 'hidden'
			document.body.style.overflow = 'hidden'
			document.body.style.paddingRight = `${scrollbarWidth}px`
		} else {
			document.documentElement.style.overflow = ''
			document.body.style.overflow = ''
			document.body.style.paddingRight = ''
		}
		return () => {
			document.documentElement.style.overflow = ''
			document.body.style.overflow = ''
			document.body.style.paddingRight = ''
		}
	}, [openDropdownId])

	const handleContextMenu = (memberId: string, event: React.MouseEvent) => {
		setDropdownPosition({
			top: event.clientY,
			left: event.clientX,
		})
		setOpenDropdownId(memberId)
	}

	// 파트 변경 클릭 시 파트 설정 모달 열기
	const handleChangeRole = () => {
		setOpenDropdownId(null) // 기존 드롭다운 닫기
		onOpenPartSettings?.()
	}

	// 파트장(Lead) 설정 - API 호출 후 로컬 상태 업데이트
	const handleSetLeader = (memberId: string) => {
		patchMemberTypeMutation.mutate(
			{ projectUserId: memberId, body: { memberType: 'LEAD' } },
			{
				onSuccess: () => {
					setLeader(role, memberId)
				},
			}
		)
	}

	// 팀원 강퇴 - API 호출 후 로컬 상태 업데이트
	const handleKickMember = (memberId: string) => {
		patchMemberKickMutation.mutate(memberId, {
			onSuccess: () => {
				removeMember(role, memberId)
			},
		})
	}

	// 리더를 먼저 정렬
	const sortedMembers = [...members].sort((a, b) => {
		if (a.isLeader && !b.isLeader) return -1
		if (!a.isLeader && b.isLeader) return 1
		return 0
	})

	return (
		<div className='flex flex-col gap-3 w-full'>
			{/* 역할 태그 */}
			<RoleTagChip
				roleId={roleId ?? 1}
				roleName={role}
				roleField={roleField}
				state='default'
			/>

			{/* 멤버 카드 그리드 */}
			<div className='flex flex-wrap gap-3 w-full'>
				{sortedMembers.map(member => (
					<div key={member.id} className='relative'>
						<div
							className='relative'
							onContextMenu={e => {
								e.preventDefault()
								handleContextMenu(member.id, e)
							}}
						>
							<ProfileCard
								profileImage={
									member.profileImageUrl ? (
										<img
											src={member.profileImageUrl}
											alt=''
											className='w-20 h-20 rounded-full object-cover'
										/>
									) : undefined
								}
								isLeader={member.isLeader}
								highlighted={member.isLeader}
								nickname={member.nickname}
								part={member.part}
								introduction={member.introduction}
							/>
						</div>

						{/* 드롭다운 메뉴 */}
						{openDropdownId === member.id && (
							<TeamMemberModal
								onClose={() => setOpenDropdownId(null)}
								onChangeRole={handleChangeRole}
								onSetLeader={() => handleSetLeader(member.id)}
								onKickMember={() => handleKickMember(member.id)}
								position={dropdownPosition}
							/>
						)}
					</div>
				))}
			</div>

			{/* 팀원 프로필 상세 모달 (홈 화면에서 해주실듯) */}
		</div>
	)
}

export default TeamMemberSection
