import { useEffect, useState } from 'react'
import type { TeamMembersByRole } from '@/types/mypage/ongoindProject'

import { MOCK_PROJECT_HISTORIES } from '@/mocks/ongoingProjectData'
import PartSettingsModal from './modals/PartSettingsModal'
import Section02TeamHistory from './sections/Section02TeamHistory'
import Section01TeamMembers from './sections/Section01TeamMembers'

interface ITeamManagementView {
	teamMembersByRole: TeamMembersByRole[]
}

const TeamManagementView = ({ teamMembersByRole }: ITeamManagementView) => {
	const [isPartSettingsOpen, setIsPartSettingsOpen] = useState(false) // 파트 설정 모달

	// 파드 변경 모달 열렸을 때, 백그라운드 스크롤 방지
	useEffect(() => {
		if (isPartSettingsOpen) {
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
	}, [isPartSettingsOpen])

	const handlePartSettingsSave = (updatedParts: TeamMembersByRole[]) => {
		console.log('저장된 파트:', updatedParts)
		setIsPartSettingsOpen(false)
	}

	return (
		<div className='flex flex-col gap-16 w-full'>
			{/* 섹션 01. 파트별 팀원 프로필 */}
			<Section01TeamMembers data={teamMembersByRole} handlePartSettings={setIsPartSettingsOpen} />

			{/* 섹션 02. 팀원들의 프로젝트 히스토리 */}
			<Section02TeamHistory projectHistories={MOCK_PROJECT_HISTORIES} />

			{/* 파트 설정 모달 */}
			{isPartSettingsOpen && (
				<PartSettingsModal
					teamMembersByRole={teamMembersByRole}
					onClose={() => setIsPartSettingsOpen(false)}
					onSave={handlePartSettingsSave}
				/>
			)}
		</div>
	)
}

export default TeamManagementView
