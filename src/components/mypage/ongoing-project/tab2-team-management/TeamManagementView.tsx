import type { TeamMembersByRole } from '@/types/mypage/ongoindProject'

import Section02TeamHistory from './sections/Section02TeamHistory'
import Section01TeamMembers from './sections/Section01TeamMembers'
import { usePartSettingsModal } from '@/stores/usePartSettingsModal'
import { useTeamMembersStore } from '@/stores/useTeamMembersStore'
import { useProjectIdStore } from '@/stores/useProjectIdStroe'

interface ITeamManagementView {
	teamMembersByRole: TeamMembersByRole[]
}

const TeamManagementView = ({ teamMembersByRole }: ITeamManagementView) => {
	const openPartSettings = usePartSettingsModal(state => state.open)
	const { teamMembersHistory, memberApiDataMap } = useTeamMembersStore()
	const projectId = useProjectIdStore(state => state.projectId)

	const handleOpenPartSettings = () => {
		openPartSettings(String(projectId ?? ''), teamMembersByRole, memberApiDataMap)
	}

	return (
		<div className='flex flex-col gap-16 w-full'>
			{/* 섹션 01. 파트별 팀원 프로필 */}
			<Section01TeamMembers data={teamMembersByRole} handlePartSettings={handleOpenPartSettings} />

			{/* 섹션 02. 팀원들의 프로젝트 히스토리 */}
			<Section02TeamHistory projectHistories={teamMembersHistory} />
		</div>
	)
}

export default TeamManagementView
