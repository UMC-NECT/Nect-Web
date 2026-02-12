import { useState, useCallback, useEffect, useRef } from 'react'
import Button from '@/components/common/Button'
import { MyPageHeader } from '../MyPageHeader'
import HamburgerIcon from '@/assets/icons/common/hamburger.svg?react'
import SegmentTabButton from '../SegmentTabButton'
import ProjectManagementView from './tab1-project-setting/ProjectManagementView'
import TeamManagementView from './tab2-team-management/TeamManagementView'
import { useNavigationBlocker } from '@/hooks/mypage/useNavigationBlocker'
import { useOngoingProjectForm } from '@/hooks/mypage/useOngoingProjectForm'
import type { TabType, ColorType, RecruitType } from '@/types/mypage/ongoindProject'

import CTAModal from '@/components/common/CTAModal'
import PartSettingsModal from './PartSettingsModal'
import { useNavigate } from 'react-router'
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
	usePatchProjectRecruitmentStatusMutation,
	useGetTeamRolesQuery,
	useMypageProjectUsersQuery,
	useProjectPurposesQuery,
	useProjectFunctionsQuery,
	useProjectsServiceUsersQuery,
	useDeleteProjectMutation,
} from '@/hooks/mypage/useMypageApi'
import useGetProjectUsers from '@/hooks/project-users/useGetProjectUsers'
import type { RecruitmentLocalItem } from './tab1-project-setting/sections/Section02RecruitmentInfo'
import { getProjectFieldValue } from '@/utils/projectField'
import { useProjectIdStore } from '@/stores/useProjectIdStroe'
import NecttyIcon from '@/assets/nectty.png'
import LoadingModal from '@/components/splash/LoadingModal'

// role_field를 ColorType으로 변환
const getRoleColorFromField = (roleField: string): ColorType => {
	switch (roleField) {
		case 'PM':
		case 'PLANNING':
		case 'SERVICE':
			return 'purple'
		case 'DESIGNER':
		case 'DESIGN':
		case 'UI_UX':
			return 'pink'
		case 'FRONTEND':
			return 'green'
		case 'BACKEND':
			return 'blue'
		default:
			return 'gray'
	}
}

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

// API recruitment_status → 한글 모집 상태 변환
const mapRecruitmentStatus = (apiStatus: string): RecruitType => {
	switch (apiStatus) {
		case 'OPEN':
			return '모집 중'
		case 'CLOSED':
			return '모집 완료'
		default:
			return '모집 전'
	}
}

// 한글 모집 상태 → API recruitment_status 변환
const toApiRecruitmentStatus = (status: RecruitType): string => {
	switch (status) {
		case '모집 중':
			return 'OPEN'
		case '모집 완료':
			return 'CLOSED'
		default:
			return 'UPCOMING'
	}
}

const OngoingProject = () => {
	// 현재 탭
	const [activeTab, setActiveTab] = useState<TabType>('프로젝트 설정')

	// 프로젝트 유저 조회 - memberType이 LEADER인 프로젝트가 있는지 확인
	const { projectUsers, isLoading: isProjectUsersLoading } = useGetProjectUsers()
	const hasLeaderProject = projectUsers?.some((p) => p.memberType === 'LEADER')
	// 모집 등록 완료 여부
	const [isRecruitmentPublished, setIsRecruitmentPublished] = useState(false)
	// 섹션 01. 프로젝트 분야
	const [selectedField, setSelectedField] = useState<string>('')

	const navigate = useNavigate()

	// 팀원 데이터
	const teamMembersByRole = useTeamMembersStore(state => state.teamMembersByRole)

	// 폼 관련
	const { control, setValue, isDirty, watch, reset, getValues } = useOngoingProjectForm()

	// 프로젝트 ID (Zustand persist 스토어에서 관리)
	const { projectId: storedProjectId, userId: storedUserId, setProjectId: setStoredProjectId } = useProjectIdStore()
	const { data: profileData, isLoading: isProfileLoading } = useMypageProfileQuery()
	const { data: projectsData, isLoading: isProjectsLoading } = useMypageProjectsQuery()

	// 현재 로그인한 userId와 저장된 userId가 다르면 projectId 초기화 후 재설정
	useEffect(() => {
		const userId = profileData?.body?.userId
		const projects = projectsData?.body?.projects?.flat()
		if (!userId || !projects) return

		// 저장된 userId와 현재 userId가 다르면 초기화 후 재설정
		if (storedUserId !== userId) {
			const leaderProject = projects.find(p => p.leader.user_id === userId)
			if (leaderProject) {
				setStoredProjectId(leaderProject.project_id, userId)
			}
		}
		// userId가 같고 projectId가 없을 때 기본값으로 설정
		else if (!storedProjectId) {
			const leaderProject = projects.find(p => p.leader.user_id === userId)
			if (leaderProject) {
				setStoredProjectId(leaderProject.project_id, userId)
			}
		}
		// userId가 같고 projectId가 있지만 삭제되었거나 유효하지 않은 경우
		else if (storedProjectId) {
			const isProjectValid = projects.some(p => p.project_id === storedProjectId)
			if (!isProjectValid) {
				// 현재 저장된 프로젝트가 목록에 없으면 리더인 첫 번째 프로젝트로 재설정
				const leaderProject = projects.find(p => p.leader.user_id === userId)
				if (leaderProject) {
					setStoredProjectId(leaderProject.project_id, userId)
				}
			}
		}
	}, [storedProjectId, storedUserId, profileData, projectsData, setStoredProjectId])

	const projectId = storedProjectId ? String(storedProjectId) : ''

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

	// 섹션 03. 팀 구성 데이터 조회 (getTeamRoles)
	const { data: teamRolesData } = useGetTeamRolesQuery(projectId)

	// 프로젝트 유저(멤버) 목록 조회
	const { data: projectUsersData } = useMypageProjectUsersQuery(projectId)

	// 팀원 데이터 + 팀 역할 데이터 → Zustand 스토어에 반영
	const { setTeamMembersByRole, setMemberApiDataMap } = useTeamMembersStore()

	useEffect(() => {
		const users = projectUsersData?.body?.users ?? []
		const rawParts = teamRolesData?.body?.parts
		const parts = (Array.isArray(rawParts) ? rawParts : rawParts ? [rawParts] : []) as Array<{
			id: number
			role_field: string | null
			custom_role_field_name: string | null
			label: string
			required_count: number
		}>

		// parts 기준으로 TeamMembersByRole 생성, users를 role_field 기준으로 매칭
		const roleField = (p: (typeof parts)[0]) => p.role_field ?? p.custom_role_field_name ?? ''
		const teamMembersByRoleFromApi = parts.map(p => {
			const rf = roleField(p)
			const partMembers = users.filter(u => {
				if (p.role_field && p.role_field !== 'CUSTOM') {
					return u.role_field === p.role_field
				}
				return u.role_field === 'CUSTOM' && (u.custom_role_field_name === p.custom_role_field_name || u.part_label === p.label)
			})
			return {
				partId: p.id,
				role: p.label,
				roleField: rf,
				customRoleFieldName: p.custom_role_field_name,
				color: getRoleColorFromField(rf || 'OTHER') as ColorType,
				targetCount: p.required_count,
				members: partMembers.map(u => ({
					id: String(u.user_id),
					nickname: u.nickname || u.name || '이름없음',
					part: u.part_label ?? u.custom_role_field_name ?? u.role_field ?? '',
					introduction: u.bio ?? undefined,
					profileImageUrl: u.profile_image_url ?? undefined,
					isLeader: u.member_type === 'LEADER',
				})),
			}
		})

		const memberApiDataMap = new Map()
		for (const user of users) {
			memberApiDataMap.set(String(user.user_id), {
				userId: user.user_id,
				roleField: user.role_field,
				customRoleFieldName: user.custom_role_field_name,
				partLabel: user.part_label,
			})
		}

		setTeamMembersByRole(teamMembersByRoleFromApi)
		setMemberApiDataMap(memberApiDataMap)
	}, [projectUsersData, teamRolesData, setTeamMembersByRole, setMemberApiDataMap])

	// 실제 프로젝트 데이터 추출 및 형식 변환
	const leaderProject = (() => {
		const projects = projectsData?.body?.projects?.flat()
		if (!projects || !storedProjectId) return undefined
		return projects.find(p => p.project_id === storedProjectId)
	})()

	// 모집 여부 초기값 설정 (API recruitment_status 기반)
	useEffect(() => {
		if (!leaderProject?.recruitment_status) return
		const mappedStatus = mapRecruitmentStatus(leaderProject.recruitment_status)
		queueMicrotask(() => {
			setValue('recruitmentStatus', mappedStatus, { shouldDirty: false })
			setIsRecruitmentPublished(mappedStatus === '모집 중')
		})
	}, [leaderProject?.recruitment_status, setValue])

	const projectData = (() => {
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
			thumbnailUrl: leaderProject.image_name || undefined,
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
			profileImageUrl: profile.profileImageUrl,
		}
	})()

	// Section02 availableRoles - getTeamRoles parts의 role_field/label
	const availableRoles = (() => {
		const rawParts = teamRolesData?.body?.parts
		const parts = (Array.isArray(rawParts) ? rawParts : rawParts ? [rawParts] : []) as Array<{
			role_field: string | null
			custom_role_field_name: string | null
			label: string
		}>
		return parts.map(p => p.role_field ?? p.custom_role_field_name ?? p.label)
	})()

	const { mutate: mutateProjectField } = useMypageProjectFieldMutation()
	const { mutate: postRecruitment } = usePostMypageRecruitmentsMutation()
	const { mutate: putRecruitment } = usePutMypageRecruitmentsMutation()
	const { mutate: patchProjectPurposes } = usePatchProjectPurposesMutation()
	const { mutate: patchProjectsFunctions } = usePatchProjectsFunctions()
	const { mutate: patchProjectsServiceUsers } = usePatchProjectsServiceUsersMutation()
	const { mutate: patchRecruitmentStatus } = usePatchProjectRecruitmentStatusMutation()
	const { mutate: deleteProjectMutation } = useDeleteProjectMutation()
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

	// 저장 (Zod 유효성 검사 없이 현재 값 기반으로 API 호출)
	const handleSave = useCallback((): boolean => {
		const data = getValues()

		if (!projectId) return false

		// 모집 상태 변경
		if (data.recruitmentStatus) {
			patchRecruitmentStatus({
				projectId,
				status: toApiRecruitmentStatus(data.recruitmentStatus),
			})
		}

		// 섹션 01. 프로젝트 분야 수정
		if (selectedField) {
			mutateProjectField({ projectId, field: selectedField })
		}

		// 섹션 02. 모집 정보 생성/수정 (비어있는 항목은 스킵)
		recruitmentDataRef.current.forEach(item => {
			const requirements = item.requirements.split('\n').filter(Boolean)

			// roleField가 비어있거나 requirements가 없으면 스킵
			if (!item.roleField || requirements.length === 0) {
				return
			}

			const body = {
				roleField: item.roleField.toUpperCase(),
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
		if (data.projectGoal) {
			const contents = data.projectGoal.split('\n').filter(Boolean)
			if (contents.length > 0) {
				patchProjectPurposes({ projectId, contents })
			}
		}

		// 섹션 05. 주요 내용 수정
		if (data.mainContent) {
			const contents = data.mainContent.split('\n').filter(Boolean)
			if (contents.length > 0) {
				patchProjectsFunctions({ projectId, contents })
			}
		}

		// 섹션 06. 서비스 사용자 수정
		if (data.serviceUser) {
			const contents = data.serviceUser.split('\n').filter(Boolean)
			if (contents.length > 0) {
				patchProjectsServiceUsers({ projectId, contents })
			}
		}

		reset(data)
		return true
	}, [
		getValues,
		reset,
		projectId,
		selectedField,
		patchRecruitmentStatus,
		mutateProjectField,
		postRecruitment,
		putRecruitment,
		patchProjectPurposes,
		patchProjectsFunctions,
		patchProjectsServiceUsers,
	])

	// 페이지 이탈 감지 훅
	const { isBlocked, handleLeaveWithoutSaving, handleSaveAndLeave } = useNavigationBlocker({
		isDirty,
		onSave: handleSave,
	})

	// (버튼 핸들러) 저장 버튼
	const handleSaveWithModal = useCallback(() => {
		const success = handleSave()
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
		if (!projectId) return

		patchRecruitmentStatus(
			{ projectId, status: 'CLOSED' },
			{
				onSuccess: () => {
					setIsRecruitmentPublished(false)
					setValue('recruitmentStatus', '모집 완료', { shouldDirty: false })
					open('recruitmentEndComplete')
				},
				onError: error => {
					console.error('모집 종료 실패:', error)
				},
			}
		)
	}

	// (모달 핸들러) 모집 등록 확인
	const handleRecruitmentRegister = () => {
		if (!projectId) return

		patchRecruitmentStatus(
			{ projectId, status: 'OPEN' },
			{
				onSuccess: () => {
					setIsRecruitmentPublished(true)
					setValue('recruitmentStatus', '모집 중', { shouldDirty: false })
					open('recruitmentRegisterComplete')
				},
				onError: error => {
					console.error('모집 등록 실패:', error)
				},
			}
		)
	}

	// (모달 핸들러) 매칭 현황으로 이동
	const handleGoToMatching = () => {
		close()
		navigate('/mypage/matching')
	}

	// (모달 핸들러) 삭제 확인
	const handleDeleteConfirm = () => {
		if (!projectId) return

		deleteProjectMutation(projectId, {
			onSuccess: () => {
				open('deleteComplete')
				setTimeout(() => {
					close()
					navigate('/mypage/projects')
				}, 1500)
			},
			onError: error => {
				console.error('프로젝트 삭제 실패:', error)
				close()
			},
		})
	}

	// (탭바 핸들러)
	const handleActivateTab = useCallback((tabName: TabType) => {
		setActiveTab(tabName)
	}, [])

	// 리더인 프로젝트가 없으면 NoLeaderProjectView 렌더링
	if (!isProjectUsersLoading && !hasLeaderProject) {
		return (
			<div className='ml-7 items-center flex flex-col'>
				<MyPageHeader />
				<div className='w-full bg-bg-gray px-[46px] py-[56px] rounded-12 border border-neutral-200 max-w-[916px]'>
					<div className='flex flex-col items-center gap-5'>
						<p className='title-3 font-semibold text-primary-600-normal'>NECT Project</p>
						<div className='flex flex-col items-center gap-3'>
							<p className='heading-3 font-bold text-neutral-900'>진행 중인 프로젝트가 없습니다.</p>
							<p className='title-3 font-medium text-neutral-600'>아이디어를 등록하고 AI 분석을 받아보세요!</p>
						</div>
						<img src={NecttyIcon} className='w-[185px] h-[158px] mt-[53px] mb-[86px]' />
						<Button color='primary' onClick={() => navigate('/idea-analyze')} size='xl' className='w-[320px]'>AI 아이디어 분석하기</Button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='ml-7 w-full flex flex-col items-center'>
			{isProjectsLoading || isProfileLoading && <LoadingModal />}
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
			<div className='rounded-12 bg-neutral-000 border border-neutral-200 px-11.5 py-14 w-full'>
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
						availableRoles={availableRoles}
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
