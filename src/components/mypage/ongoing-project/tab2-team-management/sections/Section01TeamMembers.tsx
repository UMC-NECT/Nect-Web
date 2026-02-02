import SettingIcon from '@/assets/icons/common/setting.svg?react'
import Button from '@/components/common/Button'
import TeamMemberSection from '../TeamMemberSection'
import type { TeamMembersByRole } from '@/types/mypage/ongoindProject'

interface ISection01TeamMembers {
	data: TeamMembersByRole[]
	handlePartSettings: () => void
}

const Section01TeamMembers = ({ data, handlePartSettings }: ISection01TeamMembers) => {
	// 팀원 관리 핸들러들
	const handleSetLeader = (memberId: string) => {
		alert(`파트장 설정:  ${memberId}`)
	}

	return (
		<div className='flex flex-col gap-6 w-full'>
			{/* 헤더 */}
			<div className='flex items-center justify-between px-5'>
				<h3 className='title-2 font-bold text-neutral-900'>파트별 팀원 프로필</h3>

				<div className='flex items-center gap-6'>
					{/* 파트 설정 버튼 */}
					<Button color='text' onClick={handlePartSettings} className='flex gap-1'>
						<SettingIcon className='w-4 h-4' />
						파트 설정
					</Button>
				</div>
			</div>

			{/* 역할별 멤버 섹션 */}
			<div className='flex flex-col gap-12 px-5'>
				{data.map(({ role, roleLabel, color, members }) => (
					<TeamMemberSection
						key={role}
						roleLabel={roleLabel}
						roleColor={color}
						members={members}
						onOpenPartSettings={handlePartSettings}
						onSetLeader={handleSetLeader}
					/>
				))}
			</div>
		</div>
	)
}

export default Section01TeamMembers
