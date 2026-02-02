import { useEffect, useState } from 'react'
import RoleTag from '@/components/mypage/RoleTag'
import ProfileCard from '@/components/mypage/ProfileCard'
import type { ColorType, TeamMember } from '@/types/mypage/ongoindProject'
import TeamMemberModal from './modals/TeamMemberModal'

interface ITeamMemberSection {
	roleLabel: string
	roleColor: ColorType
	members: TeamMember[]
	onOpenPartSettings?: () => void
	onSetLeader?: (memberId: string) => void
	onKickMember?: (memberId: string) => void
}

const TeamMemberSection = ({ roleLabel, members, onOpenPartSettings, onSetLeader }: ITeamMemberSection) => {
	const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
	const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | undefined>(undefined)

	// 모달이 열리면 백그라운드 스크롤 방지
	useEffect(() => {
		if (openDropdownId) {
			document.documentElement.style.overflow = 'hidden'
			document.body.style.overflow = 'hidden'
		} else {
			document.documentElement.style.overflow = ''
			document.body.style.overflow = ''
		}
		return () => {
			document.documentElement.style.overflow = ''
			document.body.style.overflow = ''
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

	// 리더를 먼저 정렬
	const sortedMembers = [...members].sort((a, b) => {
		if (a.isLeader && !b.isLeader) return -1
		if (!a.isLeader && b.isLeader) return 1
		return 0
	})

	return (
		<div className='flex flex-col gap-3 w-full'>
			{/* 역할 태그 */}
			<RoleTag role={roleLabel} showTotal={false} />

			{/* 멤버 카드 그리드 */}
			<div className='flex flex-wrap gap-3 w-full'>
				{sortedMembers.map(member => (
					<div key={member.id} className='relative'>
						<div
							className='relative'
							onContextMenu={e => {
								e.preventDefault()
								if (!member.isMatching) {
									handleContextMenu(member.id, e)
								}
							}}
						>
							<ProfileCard
								profileImage={member.profileImage}
								isLeader={member.isLeader}
								highlighted={roleLabel === 'PM' && member.isLeader}
								isMatching={member.isMatching}
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
								onSetLeader={() => onSetLeader?.(member.id)}
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
