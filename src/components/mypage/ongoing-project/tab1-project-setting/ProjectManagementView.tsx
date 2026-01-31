import { useFieldArray, type Control, type UseFormGetValues, type UseFormSetValue, type UseFormWatch } from 'react-hook-form'

import { MOCK_PROJECT_DATA, MOCK_TEAM_COMPOSITION, type ProjectData } from '@/mocks/ongoingProjectData'
import ProjectBasicInfo from './ProjectBasicInfo'
import Section01ProjectField from './sections/Section01ProjectField'
import Section02RecruitmentInfo from './sections/Section02RecruitmentInfo'
import Section03TeamComposition from './sections/Section03TeamComposition'
import Section07Portfolio from '../../profile-settings/sections/Section07Portfolio'
import Section08LeaderProfile from './sections/Section08LeaderProfile'
import FormBulletTextArea from '@/components/common/FormBulletTextArea'
import type { ProjectSettingsType } from '@/utils/schemas/projectSchema'
import type { TabType } from '@/types/mypage/ongoindProject'

interface IProjectManagementView {
	projectData: ProjectData
	control: Control<ProjectSettingsType>
	getValues: UseFormGetValues<ProjectSettingsType>
	setValue: UseFormSetValue<ProjectSettingsType>
	watch: UseFormWatch<ProjectSettingsType>
	activeTab: TabType
	setActiveTab: (tab: TabType) => void
}

const ProjectManagementView = ({ control, getValues, setValue, watch, setActiveTab }: IProjectManagementView) => {
	const recruitStatus = watch('recruitmentStatus') ?? '모집 전'

	// 프로젝트 분야 토글
	const toggleField = (field: string) => {
		const currentFields = getValues('selectedFields') || []
		const newFields = currentFields.includes(field) ? currentFields.filter(f => f !== field) : [...currentFields, field]
		setValue('selectedFields', newFields, { shouldDirty: true, shouldValidate: true })
	}

	// 섹션 02. 모집 정보 배열 필드 관리
	const { fields, append } = useFieldArray({
		control,
		name: 'recruitmentInfo',
	})

	// 목데이터 임시 작업용
	const projectBasicInfoData = MOCK_PROJECT_DATA

	const handleAddRecruitmentItem = () => {
		append({ role: 'PM', description: '' })
	}

	const handleRecruitmentStatusChange = (status: '모집 전' | '모집 중' | '모집 완료') => {
		setValue('recruitmentStatus', status)
	}

	return (
		<div className='flex flex-col gap-16'>
			{/* 썸네일 + 기본 정보  */}
			<div id='project-basic-info'>
				<ProjectBasicInfo
					projectData={projectBasicInfoData}
					recruitStatus={recruitStatus}
					onStatusChange={handleRecruitmentStatusChange}
				/>
			</div>

			{/* 섹션 01. 프로젝트 분야 */}
			<div id='section-01'>
				<Section01ProjectField selectedFields={getValues('selectedFields') || []} onToggleField={toggleField} />
			</div>

			{/* 섹션 02. 모집 정보 */}
			<div id='section-02'>
				<Section02RecruitmentInfo control={control} fields={fields} onAddItem={handleAddRecruitmentItem} />
			</div>

			{/* 섹션 03. 팀 구성 (읽기전용) */}
			<Section03TeamComposition teamComposition={MOCK_TEAM_COMPOSITION} onEditClick={() => setActiveTab('팀원 관리')} />

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
				<Section07Portfolio />
			</div>

			{/* 섹션 08. 리더 프로필 (읽기전용) */}
			<div id='section-08'>
				<Section08LeaderProfile />
			</div>
		</div>
	)
}

export default ProjectManagementView
