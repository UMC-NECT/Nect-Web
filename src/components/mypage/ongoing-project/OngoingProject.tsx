import { useState, useCallback, useEffect } from 'react'
import Button from '@/components/common/Button'
import { MyPageHeader } from '../MyPageHeader'
import HamburgerIcon from '@/assets/icons/common/hamburger.svg?react'
import Tabbar from './Tabbar'
import ProjectManagementView from './tab1-project-setting/ProjectManagementView'
import TeamManagementView from './tab2-team-management/TeamManagementView'
import { useNavigationBlocker } from '@/hooks/mypage/useNavigationBlocker'
import { useOngoingProjectForm } from '@/hooks/mypage/useOngoingProjectForm'
import type { TabType } from '@/types/mypage/ongoindProject'

import CTAModal from '../CTAModal'
import PartSettingsModal from './PartSettingsModal'
import { MOCK_TEAM_MEMBERS_BY_ROLE } from '@/mocks/ongoingProjectData'
import { useNavigate } from 'react-router'
import type { ProjectSettingsType } from '@/utils/schemas/projectSchema'
import { useCTAModal } from '@/stores/useCTAModal'
import { usePartSettingsModal } from '@/stores/usePartSettingsModal'

const OngoingProject = () => {
	// 현재 탭
	const [activeTab, setActiveTab] = useState<TabType>('프로젝트 설정')
	// 모집 등록 완료 여부
	const [isRecruitmentPublished, setIsRecruitmentPublished] = useState(false)

	const navigate = useNavigate()

	// 폼 관련
	const { control, setValue, handleSubmit, isDirty, projectData, getValues, watch, reset } = useOngoingProjectForm()

	// CTA 모달
	const { modalType, open, close } = useCTAModal()

	// 파트 설정 모달
	const {
		isOpen: isPartSettingsOpen,
		teamMembersByRole: partSettingsTeamMembers,
		close: closePartSettings,
	} = usePartSettingsModal()

	// 파트 설정 모달 열렸을 때, 백그라운드 스크롤 방지
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

	// 저장 (유효성 실패 자동 포커싱을 곁들인..)
	const handleSave = useCallback(async (): Promise<boolean> => {
		let isValid = false
		await handleSubmit(
			data => {
				console.log('유효성 검사 통과:', data)
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
	}, [handleSubmit, reset])

	// 페이지 이탈 감지 훅
	const {
		isBlocked,
		handleSaveAndLeave,
		handleCloseModal: handleCancelNavigation,
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

	// (모달 핸들러) 파트 설정 저장
	const handlePartSettingsSave = (updatedParts: typeof partSettingsTeamMembers) => {
		console.log('저장된 파트:', updatedParts)
		closePartSettings()
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
						onClick={() => navigate('/')}
						className='w-33.75 h-11 px-3 py-2.5 hover:bg-neutral-100'
					>
						<div className='flex gap-1.5 justify-center items-center'>
							<HamburgerIcon className='w-4 h-4' />
							<span className='body-1 text-neutral-500'>목록으로 가기</span>
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
						<Button color='mypage1' onClick={handleSaveWithModal} className=''>
							저장
						</Button>

						<Button color='mypage2' onClick={handlePublishRecruitment} className='hover:bg-primary-500-normal'>
							{isRecruitmentPublished ? '모집 종료' : '모집 등록'}
						</Button>
					</div>
				</div>

				{/* 탭바 */}
				<Tabbar currentTab={activeTab} onClick={handleActivateTab} />

				{/* 탭 01. 프로젝트 설정 */}
				{activeTab === '프로젝트 설정' && (
					<ProjectManagementView
						projectData={projectData}
						control={control}
						getValues={getValues}
						setValue={setValue}
						watch={watch}
					/>
				)}

				{/* 탭 02. 팀원 관리 */}
				{activeTab === '팀원 관리' && <TeamManagementView teamMembersByRole={MOCK_TEAM_MEMBERS_BY_ROLE} />}
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
					leftButtonMsg='돌아가기'
					rightButtonMsg='저장 후 나가기'
					onLeftClick={handleCancelNavigation}
					onRightClick={handleSaveAndLeave}
				/>
			)}

			{/* 파트 설정 모달 */}
			{isPartSettingsOpen && (
				<PartSettingsModal
					teamMembersByRole={partSettingsTeamMembers}
					onClose={closePartSettings}
					onSave={handlePartSettingsSave}
				/>
			)}
		</div>
	)
}

export default OngoingProject
