import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSettingsSchema, type ProjectSettingsType } from '@/utils/schemas/projectSchema'
import {
	MOCK_PROJECT_DATA,
	MOCK_RECRUITMENT_INFO,
	MOCK_PROJECT_GOAL,
	MOCK_MAIN_CONTENT,
	MOCK_SERVICE_USER,
	type ProjectData,
} from '@/mocks/ongoingProjectData'

export const useOngoingProjectForm = () => {
	const methods = useForm<ProjectSettingsType>({
		resolver: zodResolver(projectSettingsSchema),
		mode: 'onChange',
		shouldFocusError: true,
		defaultValues: {
			// 모집 여부 (모집전/모집중/모집완료)
			recruitmentStatus: MOCK_PROJECT_DATA.recruitmentStatus,
			// 섹션 01. 프로젝트 분야
			selectedFields: MOCK_PROJECT_DATA.selectedFields,
			// 섹션 02. 모집 정보 및 필수 스택
			recruitmentInfo: MOCK_RECRUITMENT_INFO,
			// 섹션 04. 프로젝트 목표
			projectGoal: MOCK_PROJECT_GOAL,
			// 섹션 05. 주요 내용
			mainContent: MOCK_MAIN_CONTENT,
			// 섹션 06. 서비스 사용자
			serviceUser: MOCK_SERVICE_USER,
			// 섹션 07. 포트폴리오 파일
			portfolioFiles: [],
		},
	})

	const {
		control,
		setValue,
		handleSubmit,
		formState: { errors, isDirty },
		reset,
		getValues,
		setFocus,
		watch,
	} = methods

	const projectData: ProjectData = {
		name: MOCK_PROJECT_DATA.name,
		intro: MOCK_PROJECT_DATA.intro,
		startDate: MOCK_PROJECT_DATA.startDate,
		endDate: MOCK_PROJECT_DATA.endDate,
		recruitmentStatus: MOCK_PROJECT_DATA.recruitmentStatus,
		thumbnailUrl: MOCK_PROJECT_DATA.thumbnailUrl,
		selectedFields: getValues('selectedFields') || MOCK_PROJECT_DATA.selectedFields,
	}

	return {
		control,
		setValue,
		handleSubmit,
		errors,
		isDirty,
		reset,
		getValues,
		setFocus,
		watch,
		projectData,
	}
}
