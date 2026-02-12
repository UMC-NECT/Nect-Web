import { type Control, type UseFormSetValue, type UseFormWatch } from 'react-hook-form'
import { useCallback } from 'react'

import { useMypageProjectUsersQuery } from '@/hooks/mypage/useMypageApi'
import { type ProjectData } from '@/mocks/ongoingProjectData'
import { usePartSettingsModal } from '@/stores/usePartSettingsModal'
import { useTeamMembersStore } from '@/stores/useTeamMembersStore'
import ProjectBasicInfo from './ProjectBasicInfo'
import Section01ProjectField from './sections/Section01ProjectField'
import Section02RecruitmentInfo, { type RecruitmentLocalItem } from './sections/Section02RecruitmentInfo'
import Section03TeamComposition from './sections/Section03TeamComposition'
import Section08LeaderProfile from './sections/Section08LeaderProfile'
import FormBulletTextArea from '@/components/common/FormBulletTextArea'
import type { ProjectSettingsType } from '@/utils/schemas/projectSchema'
import Section07ProjectFiles from './sections/Section07ProjectFiles'

interface LeaderInfo {
	name: string
	nickname: string
	role: string
	bio: string
	profileImageUrl: string
}

interface IProjectManagementView {
	projectData: ProjectData
	control: Control<ProjectSettingsType>
	setValue: UseFormSetValue<ProjectSettingsType>
	watch: UseFormWatch<ProjectSettingsType>
	selectedField: string
	onSelectField: (value: string) => void
	projectId: string
	onRecruitmentDataChange?: (data: RecruitmentLocalItem[]) => void
	leaderInfo: LeaderInfo | null
	availableRoles?: string[]
}

const ProjectManagementView = ({
	projectData,
	control,
	setValue,
	watch,
	selectedField,
	onSelectField,
	projectId,
	onRecruitmentDataChange,
	leaderInfo,
	availableRoles = [],
}: IProjectManagementView) => {
	const recruitStatus = watch('recruitmentStatus') ?? '모집 전'
	const openPartSettings = usePartSettingsModal(state => state.open)

	// /api/v1/mypage/projects/:id/users 조회 → LEADER 멤버의 part_label 사용
	const { data: projectUsersData } = useMypageProjectUsersQuery(projectId)
	const leaderPartLabel =
		projectUsersData?.body?.users?.find((u) => u.member_type === 'LEADER')?.part_label ?? null
	const teamMembersByRole = useTeamMembersStore(state => state.teamMembersByRole)
	const memberApiDataMap = useTeamMembersStore(state => state.memberApiDataMap)

	// 파트 설정 모달 열기 핸들러
	const handleOpenPartSettings = useCallback(() => {
		openPartSettings(projectId, teamMembersByRole, memberApiDataMap)
	}, [openPartSettings, projectId, teamMembersByRole, memberApiDataMap])

	const handleRecruitmentStatusChange = (status: '모집 전' | '모집 중' | '모집 완료') => {
		setValue('recruitmentStatus', status, { shouldDirty: true })
	}

	return (
		<div className='flex flex-col gap-16'>
			{/* 썸네일 + 기본 정보  */}
			<div id='project-basic-info'>
				<ProjectBasicInfo
					key={projectId}
					projectData={projectData}
					projectId={projectId}
					recruitStatus={recruitStatus}
					onStatusChange={handleRecruitmentStatusChange}
				/>
			</div>

			{/* 섹션 01. 프로젝트 분야 */}
			<div id='section-01'>
				<Section01ProjectField selectedField={selectedField} onSelectField={onSelectField} />
			</div>

			{/* 섹션 02. 모집 정보 */}
			<div id='section-02'>
				<Section02RecruitmentInfo
						projectId={projectId}
						onDataChange={onRecruitmentDataChange}
						setValue={setValue}
						availableRoles={availableRoles}
						teamMembersByRole={teamMembersByRole}
					/>
			</div>

			{/* 섹션 03. 팀 구성 (읽기전용) */}
			<Section03TeamComposition projectId={projectId} onEditClick={handleOpenPartSettings} />

			{/* 섹션 04. 프로젝트 목표 */}
			<div id='section-04'>
				<FormBulletTextArea
					name='projectGoal'
					control={control}
					sectionTitle='프로젝트 목표'
					placeholder='프로젝트 목표를 간략하게 작성해주세요.'
				/>
			</div>

			{/* 섹션 05. 주요 내용 */}
			<div id='section-05'>
				<FormBulletTextArea
					name='mainContent'
					control={control}
					sectionTitle='주요 내용'
					placeholder={`프로젝트에서 진행할 주요 활동 / 구현 기능 등을 작성해주세요. (5가지 권장)\nex. 알림 및 채팅, 실시간 커뮤니케이션 기능`}
				/>
			</div>

			{/* 섹션 06. 서비스 사용자 */}
			<div id='section-06'>
				<FormBulletTextArea
					name='serviceUser'
					control={control}
					sectionTitle='서비스 사용자'
					hasStar={false}
					placeholder={`서비스의 주요 사용자/사용층을 간략하게 적어주세요.\nex. 대학생 - 공모전, 해커톤, 포트폴리오 프로젝트를 진행하고 싶은 학생`}
				/>
			</div>

			{/* 섹션 07. 프로젝트 세부 기획 파일 */}
			<div id='section-07'>
				<Section07ProjectFiles control={control} setValue={setValue} watch={watch} projectId={projectId} />
			</div>

			{/* 섹션 08. 리더 프로필 (읽기전용) - part는 프로젝트 users API LEADER의 part_label 사용 */}
			<div id='section-08'>
				<Section08LeaderProfile leaderInfo={leaderInfo} hasTag={false} partLabel={leaderPartLabel} />
			</div>
		</div>
	)
}

export default ProjectManagementView
