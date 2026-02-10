import { useState, useCallback, useEffect, useRef } from 'react'
import Button from '@/components/common/Button'
import { MyPageHeader } from '../MyPageHeader'
import HamburgerIcon from '@/assets/icons/common/hamburger.svg?react'
import SegmentTabButton from '../SegmentTabButton'
import ProjectManagementView from './tab1-project-setting/ProjectManagementView'
import TeamManagementView from './tab2-team-management/TeamManagementView'
import { useNavigationBlocker } from '@/hooks/mypage/useNavigationBlocker'
import { useOngoingProjectForm } from '@/hooks/mypage/useOngoingProjectForm'
import type { TabType } from '@/types/mypage/ongoindProject'

import CTAModal from '@/components/common/CTAModal'
import PartSettingsModal from './PartSettingsModal'
import { useNavigate } from 'react-router'
import type { ProjectSettingsType } from '@/utils/schemas/projectSchema'
import { useCTAModal } from '@/stores/useCTAModal'
import { usePartSettingsModal } from '@/stores/usePartSettingsModal'
import { useTeamMembersStore } from '@/stores/useTeamMembersStore'
import {
	useMypageProjectFieldMutation,
	useMypageProjectFieldQuery,
	useMypageProjectsQuery,
	useMypageProfileQuery,
	usePostMypageRecruitmentsMutation,
	usePutMypageRecruitmentsMutation,
	usePatchProjectPurposesMutation,
	usePatchProjectsFunctions,
	usePatchProjectsServiceUsersMutation,
	useMypageTeamRolesQuery,
	useProjectPurposesQuery,
	useProjectFunctionsQuery,
	useProjectsServiceUsersQuery,
} from '@/hooks/mypage/useMypageApi'
import type { RecruitmentLocalItem } from './tab1-project-setting/sections/Section02RecruitmentInfo'
import { getProjectFieldValue } from '@/utils/projectField'

type ProjectFieldApiItem = {
	field_name: string
	is_selected: boolean
}

const extractProjectFields = (data: unknown): ProjectFieldApiItem[] => {
	const container = (data as { body?: unknown })?.body ?? data
	const fields = (container as { fields?: unknown })?.fields
	if (!Array.isArray(fields)) return []
	return Array.isArray(fields[0]) ? (fields as ProjectFieldApiItem[][]).flat() : (fields as ProjectFieldApiItem[])
}

const OngoingProject = () => {
	// 현재 탭
	const [activeTab, setActiveTab] = useState<TabType>('프로젝트 설정')
	// 모집 등록 완료 여부
	const [isRecruitmentPublished, setIsRecruitmentPublished] = useState(false)
	// 섹션 01. 프로젝트 분야
	const [selectedField, setSelectedField] = useState<string>('')

	const navigate = useNavigate()

	// 팀원 데이터
	const teamMembersByRole = useTeamMembersStore(state => state.teamMembersByRole)

	// 폼 관련
	const { control, setValue, handleSubmit, isDirty, watch, reset, getValues } = useOngoingProjectForm()

	// 섹션 01. 프로젝트 분야 - projectId 도출
	const { data: profileData } = useMypageProfileQuery()
	const { data: projectsData } = useMypageProjectsQuery()
	const projectId = (() => {
		const userId = profileData?.body?.userId
		const projects = projectsData?.body?.projects?.flat()
		if (!userId || !projects) return ''
		const leaderProject = projects.find(p => p.leader.user_id === userId)
		return leaderProject ? String(leaderProject.project_id) : ''
	})()

	// 섹션 01. 프로젝트 분야 - 조회
	const { data: projectFieldData } = useMypageProjectFieldQuery(projectId)

	// 섹션 04. 프로젝트 목표 - 조회
	const { data: purposesData } = useProjectPurposesQuery(projectId)

	// 섹션 05. 주요 내용 - 조회
	const { data: functionsData } = useProjectFunctionsQuery(projectId)

	// 섹션 06. 서비스 사용자 - 조회
	const { data: serviceUsersData } = useProjectsServiceUsersQuery(projectId)

	// 프로젝트 분야 초기값 설정
	useEffect(() => {
		const fields = extractProjectFields(projectFieldData)
		if (fields.length > 0) {
			queueMicrotask(() => {
				const selected = fields.find(f => f.is_selected)
				if (selected) {
					const fieldValue = getProjectFieldValue(selected.field_name)
					setSelectedField(fieldValue)
					setValue('selectedFields', [fieldValue], { shouldDirty: false })
				}
			})
		}
	}, [projectFieldData, setValue])

	// 프로젝트 목표 초기값 설정
	useEffect(() => {
		const purposeValues = purposesData?.body?.values
		if (purposeValues) {
			queueMicrotask(() => {
				setValue('projectGoal', purposeValues.join('\n'), { shouldDirty: false })
			})
		}
	}, [purposesData, setValue])

	// 주요 내용 초기값 설정
	useEffect(() => {
		const functionValues = functionsData?.body?.values
		if (functionValues) {
			queueMicrotask(() => {
				setValue('mainContent', functionValues.join('\n'), { shouldDirty: false })
			})
		}
	}, [functionsData, setValue])

	// 서비스 사용자 초기값 설정
	useEffect(() => {
		const serviceUserValues = serviceUsersData?.body?.values
		if (serviceUserValues) {
			queueMicrotask(() => {
				setValue('serviceUser', serviceUserValues.join('\n'), { shouldDirty: false })
			})
		}
	}, [serviceUsersData, setValue])

	// 초기 API 데이터 로드 후 폼 baseline 동기화 (isDirty 오탐 방지)
	const isFormBaselineSetRef = useRef(false)
	useEffect(() => {
		if (isFormBaselineSetRef.current) return
		if (projectFieldData && purposesData && functionsData && serviceUsersData) {
			// queueMicrotask 기반 setValue 완료 후 실행되도록 setTimeout 사용
			const timer = setTimeout(() => {
				isFormBaselineSetRef.current = true
				reset(getValues())
			}, 0)
			return () => clearTimeout(timer)
		}
	}, [projectFieldData, purposesData, functionsData, serviceUsersData, reset, getValues])

	// 섹션 03. 팀 구성 데이터 조회
	const { data: teamRolesData } = useMypageTeamRolesQuery(projectId)

	// 실제 프로젝트 데이터 추출 및 형식 변환
	const projectData = (() => {
		const userId = profileData?.body?.userId
		const projects = projectsData?.body?.projects?.flat()
		if (!userId || !projects) {
			return {
				name: '',
				intro: '',
				startDate: '',
				endDate: '',
				recruitmentStatus: '모집 전' as const,
				selectedFields: [],
			}
		}
		const leaderProject = projects.find(p => p.leader.user_id === userId)
		if (!leaderProject) {
			return {
				name: '',
				intro: '',
				startDate: '',
				endDate: '',
				recruitmentStatus: '모집 전' as const,
				selectedFields: [],
			}
		}
		// 날짜 형식 변환: "2025-11-13" -> "2025. 11. 13"
		const formatDate = (dateStr: string) => {
			if (!dateStr) return ''
			const [year, month, day] = dateStr.split('-')
			return `${year}. ${month}. ${day}`
		}
		return {
			name: leaderProject.project_title,
			intro: leaderProject.description,
			startDate: formatDate(leaderProject.planned_started_on),
			endDate: formatDate(leaderProject.planned_ended_on),
			recruitmentStatus: watch('recruitmentStatus') ?? '모집 전',
			selectedFields: watch('selectedFields') || [],
		}
	})()

	// 리더 정보 추출
	const leaderInfo = (() => {
		const profile = profileData?.body
		if (!profile) return null
		return {
			name: profile.name,
			nickname: profile.nickname,
			role: profile.role,
			bio: profile.bio,
			profileImageFileName: profile.profileImageFileName,
		}
	})()

	// 팀 역할 데이터 변환
	const teamRolesForDisplay = (() => {
		if (!teamRolesData?.body?.parts) return []
		const parts = teamRolesData.body.parts.flat()

		return parts.map(part => ({
			role: part.role_field,
			targetCount: part.required_count,
			members: [], // 실제 멤버 정보는 필요시 추가
		}))
	})()

	const { mutate: mutateProjectField } = useMypageProjectFieldMutation()
	const { mutate: postRecruitment } = usePostMypageRecruitmentsMutation()
	const { mutate: putRecruitment } = usePutMypageRecruitmentsMutation()
	const { mutate: patchProjectPurposes } = usePatchProjectPurposesMutation()
	const { mutate: patchProjectsFunctions } = usePatchProjectsFunctions()
	const { mutate: patchProjectsServiceUsers } = usePatchProjectsServiceUsersMutation()
	const recruitmentDataRef = useRef<RecruitmentLocalItem[]>([])
	const handleRecruitmentDataChange = useCallback(
		(data: RecruitmentLocalItem[]) => {
			recruitmentDataRef.current = data
			// react-hook-form에도 반영 (Section02에서 이미 setValue를 호출하지만 ref도 업데이트)
			setValue('recruitmentInfo', data, { shouldDirty: false })
		},
		[setValue]
	)

	// 모달
	const { modalType, open, close } = useCTAModal() // CTA
	const { isOpen: isPartSettingsOpen } = usePartSettingsModal() // 파트 설정 모달

	// 파트 설정 모달 열렸을 때, 백그라운드 스크롤 방지
	useEffect(() => {
		if (isPartSettingsOpen) {
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
	}, [isPartSettingsOpen])

	// 저장 (유효성 실패 자동 포커싱을 곁들인..)
	const handleSave = useCallback(async (): Promise<boolean> => {
		let isValid = false
		await handleSubmit(
			data => {
				console.log('유효성 검사 통과:', data)
				// 섹션 01. 프로젝트 분야 수정
				if (projectId && selectedField) {
					mutateProjectField({ projectId, field: selectedField })
				}
				// 섹션 02. 모집 정보 생성/수정
				recruitmentDataRef.current.forEach(item => {
					if (!projectId) return

					const requirements = item.requirements.split('\n').filter(Boolean)

					// roleField가 비어있거나 requirements가 없으면 스킵
					if (!item.roleField || requirements.length === 0) {
						return
					}

					// 역할 필드 매핑: Design -> DESIGNER, Frontend/Backend -> DEVELOPER, PM -> PLANNER
					const roleFieldMap: Record<string, string> = {
						Design: 'DESIGNER',
						Frontend: 'FRONTEND',
						Backend: 'BACKEND',
						PM: 'PLANNER',
					}

					const body = {
						roleField: roleFieldMap[item.roleField] || item.roleField.toUpperCase(),
						capacity: item.capacity,
						requirements,
					}

					// recruitmentId가 음수면 새로 생성된 항목이므로 POST
					if (item.recruitmentId < 0) {
						postRecruitment({ projectId, body })
					} else {
						// recruitmentId가 양수면 기존 항목이므로 PUT
						putRecruitment({
							projectId,
							recruitmentId: String(item.recruitmentId),
							body,
						})
					}
				})
				// 섹션 04. 프로젝트 목표 수정
				if (projectId && data.projectGoal) {
					const contents = data.projectGoal.split('\n').filter(Boolean)
					if (contents.length > 0) {
						patchProjectPurposes({ projectId, contents })
					}
				}
				// 섹션 05. 주요 내용 수정
				if (projectId && data.mainContent) {
					const contents = data.mainContent.split('\n').filter(Boolean)
					if (contents.length > 0) {
						patchProjectsFunctions({ projectId, contents })
					}
				}
				// 섹션 06. 서비스 사용자 수정
				if (projectId && data.serviceUser) {
					const contents = data.serviceUser.split('\n').filter(Boolean)
					if (contents.length > 0) {
						patchProjectsServiceUsers({ projectId, contents })
					}
				}
				reset(data)
				isValid = true
			},
			errors => {
				// 첫 번째 에러 필드 찾기
				const firstErrorKey = Object.keys(errors)[0] as keyof ProjectSettingsType

				if (firstErrorKey) {
					// 해당 섹션으로 스크롤
					const errorFieldMap: Record<keyof ProjectSettingsType, string> = {
						recruitmentStatus: 'project-basic-info',
						selectedFields: 'section-01',
						recruitmentInfo: 'section-02',
						projectGoal: 'section-04',
						mainContent: 'section-05',
						serviceUser: 'section-06',
						portfolioFiles: 'section-07',
					}

					const sectionId = errorFieldMap[firstErrorKey]
					if (sectionId) {
						const element = document.getElementById(sectionId)
						if (element) {
							element.scrollIntoView({ behavior: 'smooth', block: 'center' })
						}
					}
				}

				// 에러 메시지 재귀적으로 추출 (섹션 02가 배열이라서 에러메시지가 제대로 안잡힘..)
				const extractMessages = (obj: unknown): string[] => {
					const messages: string[] = []
					if (!obj || typeof obj !== 'object') return messages

					const errorObj = obj as Record<string, unknown>
					if (typeof errorObj.message === 'string') {
						messages.push(errorObj.message)
					}
					Object.values(errorObj).forEach(value => {
						if (value && typeof value === 'object') {
							messages.push(...extractMessages(value))
						}
					})
					return messages
				}

				const errorMessages = extractMessages(errors)
				alert(errorMessages[0] || '필수 항목을 입력해주세요')
				isValid = false
			}
		)()
		return isValid
	}, [
		handleSubmit,
		reset,
		projectId,
		selectedField,
		mutateProjectField,
		postRecruitment,
		putRecruitment,
		patchProjectPurposes,
		patchProjectsFunctions,
		patchProjectsServiceUsers,
	])

	// 페이지 이탈 감지 훅
	const {
		isBlocked,
		handleLeaveWithoutSaving,
		handleSaveAndLeave,
	} = useNavigationBlocker({
		isDirty,
		onSave: handleSave,
	})

	// (버튼 핸들러) 저장 버튼
	const handleSaveWithModal = useCallback(async () => {
		const success = await handleSave()
		if (success) {
			open('save')
		}
	}, [handleSave, open])

	// (버튼 핸들러) 모집 등록/종료 버튼
	const handlePublishRecruitment = () => {
		if (isRecruitmentPublished) {
			open('recruitmentEnd')
		} else {
			open('recruitmentRegister')
		}
	}

	// (버튼 핸들러) 삭제 버튼
	const handleDeleteClick = () => {
		open('delete')
	}

	// (모달 핸들러) 모집 종료 확인
	const handleRecruitmentEnd = () => {
		open('recruitmentEndComplete')
	}

	// (모달 핸들러) 모집 등록 확인
	const handleRecruitmentRegister = () => {
		setIsRecruitmentPublished(true)
		open('recruitmentRegisterComplete')
	}

	// (모달 핸들러) 매칭 현황으로 이동
	const handleGoToMatching = () => {
		close()
		navigate('/matching')
	}

	// (모달 핸들러) 삭제 확인
	const handleDeleteConfirm = () => {
		open('deleteComplete')
	}

	// (탭바 핸들러)
	const handleActivateTab = useCallback((tabName: TabType) => {
		setActiveTab(tabName)
	}, [])

	return (
		<div className='ml-7 w-full flex flex-col items-center'>
			{/* 브레드크럼 + 타이틀 */}
			<MyPageHeader
				action={
					<Button
						color='socialLogin'
						size='sm'
						onClick={() => navigate('/mypage/projects')}
						className='w-33.75 h-11 px-3 py-2.5 hover:bg-neutral-100 border-neutral-200'
					>
						<div className='flex gap-1.5 justify-center items-center'>
							<HamburgerIcon className='w-4 h-4 text-neutral-400' />
							<span className='body-1 text-neutral-400'>목록으로 가기</span>
						</div>
					</Button>
				}
			/>

			{/* 컨텐츠 전체 컨테이너 */}
			<div className='rounded-12 bg-neutral-000 border border-neutral-200 px-11.5 py-14'>
				{/* 프로젝트명 + 저장/모집등록 버튼 */}
				<div className='flex items-center justify-between mb-7'>
					<h2 className='heading-2 font-bold text-neutral-900'>{projectData.name}</h2>

					{/* 버튼 2개 */}
					<div className='flex items-center gap-2'>
						<Button color='mypage1' onClick={handleSaveWithModal} className='w-32.5'>
							저장
						</Button>

						<Button
							color='mypage2'
							onClick={handlePublishRecruitment}
							className='hover:bg-primary-500-normal w-32.5 px-2'
						>
							{isRecruitmentPublished ? '모집 종료' : '모집 등록'}
						</Button>
					</div>
				</div>

				{/* 탭바 */}
				<div className='flex items-center mb-7'>
					<SegmentTabButton
						label='프로젝트 설정'
						isActive={activeTab === '프로젝트 설정'}
						onClick={() => handleActivateTab('프로젝트 설정')}
					/>
					<SegmentTabButton
						label='팀원 관리'
						isActive={activeTab === '팀원 관리'}
						onClick={() => handleActivateTab('팀원 관리')}
					/>
				</div>

				{/* 탭 01. 프로젝트 설정 */}
				{activeTab === '프로젝트 설정' && (
					<ProjectManagementView
						projectData={projectData}
						control={control}
						setValue={setValue}
						watch={watch}
						selectedField={selectedField}
						onSelectField={value =>
							setSelectedField(prev => {
								const newValue = prev === value ? '' : value
								setValue('selectedFields', newValue ? [newValue] : [], { shouldDirty: true })
								return newValue
							})
						}
						projectId={projectId}
						onRecruitmentDataChange={handleRecruitmentDataChange}
						leaderInfo={leaderInfo}
						teamRoles={teamRolesForDisplay}
					/>
				)}

				{/* 탭 02. 팀원 관리 */}
				{activeTab === '팀원 관리' && <TeamManagementView teamMembersByRole={teamMembersByRole} />}
			</div>

			{/* 삭제하기 버튼 */}
			<Button color='text' className='underline mt-6' onClick={handleDeleteClick}>
				삭제하기
			</Button>

			{/* 저장 완료 모달 */}
			{modalType === 'save' && (
				<CTAModal message='저장되었습니다' isMessageHighlight={true} rightButtonMsg='확인' onRightClick={close} />
			)}

			{/* 삭제 확인 모달 */}
			{modalType === 'delete' && (
				<CTAModal
					message='{삭제} 하시겠습니까?'
					leftButtonMsg='돌아가기'
					rightButtonMsg='삭제'
					onLeftClick={close}
					onRightClick={handleDeleteConfirm}
				/>
			)}

			{/* 삭제 완료 모달 */}
			{modalType === 'deleteComplete' && (
				<CTAModal message='삭제 되었습니다' isMessageHighlight={true} rightButtonMsg='확인' onRightClick={close} />
			)}

			{/* 모집 종료 확인 모달 */}
			{modalType === 'recruitmentEnd' && (
				<CTAModal
					message='프로젝트 {모집 종료} 하겠습니까?'
					fixedHeight={true}
					leftButtonMsg='돌아가기'
					rightButtonMsg='모집 종료'
					onLeftClick={close}
					onRightClick={handleRecruitmentEnd}
				/>
			)}

			{/* 모집 종료 완료 모달 */}
			{modalType === 'recruitmentEndComplete' && (
				<CTAModal
					message='모집 종료 되었습니다'
					isMessageHighlight={true}
					fixedHeight={true}
					subMessage='매칭 현황에서 팀원 정보를 확인 할 수 있습니다.'
					leftButtonMsg='매칭 현황가기'
					rightButtonMsg='확인'
					onLeftClick={handleGoToMatching}
					onRightClick={close}
				/>
			)}

			{/* 모집 등록 확인 모달 */}
			{modalType === 'recruitmentRegister' && (
				<CTAModal
					message='프로젝트 {모집 등록} 하겠습니까?'
					fixedHeight={true}
					leftButtonMsg='돌아가기'
					rightButtonMsg='모집 등록'
					onLeftClick={close}
					onRightClick={handleRecruitmentRegister}
				/>
			)}

			{/* 모집 등록 완료 모달 */}
			{modalType === 'recruitmentRegisterComplete' && (
				<CTAModal
					message='등록 완료 되었습니다'
					isMessageHighlight={true}
					fixedHeight={true}
					subMessage='매칭은 매칭 현황에서 확인 할 수 있습니다.'
					leftButtonMsg='매칭 현황가기'
					rightButtonMsg='확인'
					onLeftClick={handleGoToMatching}
					onRightClick={close}
				/>
			)}

			{/* 페이지 이탈 감지 모달 */}
			{(isBlocked || modalType === 'unsavedChanges') && (
				<CTAModal
					message={`저장되지 않았습니다\n저장 후 페이지를 나가시겠습니까?`}
					leftButtonMsg='나가기'
					rightButtonMsg='저장 후 나가기'
					onLeftClick={handleLeaveWithoutSaving}
					onRightClick={handleSaveAndLeave}
				/>
			)}

			{/* 파트 설정 모달 */}
			{isPartSettingsOpen && <PartSettingsModal />}
		</div>
	)
}

export default OngoingProject
