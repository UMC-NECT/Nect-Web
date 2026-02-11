import { useForm } from 'react-hook-form'
import { useMemo } from 'react'
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
import type { PortfolioFileType } from '@/utils/schemas/projectSchema'

const INITIAL_PORTFOLIOS: PortfolioFileType[] = [{ id: -1, title: '', link: '', fileUrl: '', isCompleted: false }]

export const useOngoingProjectForm = () => {
	const methods = useForm<ProjectSettingsType>({
		resolver: zodResolver(projectSettingsSchema),
		mode: 'onChange',
		shouldFocusError: true,
		defaultValues: {
			// 모집 여부 (API에서 초기화됨)
			recruitmentStatus: '모집 전',
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
			portfolioFiles: INITIAL_PORTFOLIOS,
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

	// watch를 사용하여 selectedFields의 변화를 추적
	const selectedFields = watch('selectedFields')

	// projectData를 useMemo로 메모이제이션하여 무한 루프 방지
	const projectData: ProjectData = useMemo(
		() => ({
			name: MOCK_PROJECT_DATA.name,
			intro: MOCK_PROJECT_DATA.intro,
			startDate: MOCK_PROJECT_DATA.startDate,
			endDate: MOCK_PROJECT_DATA.endDate,
			recruitmentStatus: MOCK_PROJECT_DATA.recruitmentStatus,
			thumbnailUrl: MOCK_PROJECT_DATA.thumbnailUrl,
			selectedFields: selectedFields || MOCK_PROJECT_DATA.selectedFields,
		}),
		[selectedFields]
	)

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
