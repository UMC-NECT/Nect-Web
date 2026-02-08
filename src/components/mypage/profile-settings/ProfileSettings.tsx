import { useCallback, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { useMypageProfileMutation, useMypageProfileQuery } from '@/hooks/mypage/useMypageApi'
import { useNavigationBlocker } from '@/hooks/mypage/useNavigationBlocker'
import { useProfileSettingsForm } from '@/hooks/mypage/useProfileSettingsForm'
import { useCTAModal } from '@/stores/useCTAModal'
import type { ProfileFormDataType } from '@/utils/schemas/profileSchema'

import CTAModal from '@/components/common/CTAModal'
import { MyPageHeader } from '../MyPageHeader'
import ProfileBasicInfo from './ProfileBasicInfo'
import Section01Introduction from './sections/Section01Introduction'
import Section02CoreCompetency from './sections/Section02CoreCompetency'
import Section03ProfileKeyword from './sections/Section03ProfileKeyword'
import Section04InterestFields from './sections/Section04InterestFields'
import Section05Skills from './sections/Section05Skills'
import Section06CareerHistory from './sections/Section06CareerHistory'
import Section07Portfolio from './sections/Section07Portfolio'
import Section08ProjectHistory from './sections/Section08ProjectHistory'

export const ProfileSettings = () => {
	const [hasProfileKeyword] = useState(false) // 프로필 분석키워드 리포트 보유여부

	// api - 프로필 조회
	const { data: profileData } = useMypageProfileQuery()
	const profile = profileData?.body

	// api - 프로필 수정
	const { mutateAsync: saveProfile, isPending: isSaving } = useMypageProfileMutation()

	const methods = useProfileSettingsForm(profile)
	const {
		handleSubmit,
		formState: { isDirty },
		watch,
		setValue,
	} = methods

	// 폼 데이터
	const skills = watch('skills')
	const userStatus = watch('userStatus')

	// 공개 매칭 여부
	const [localIsPublicMatching, localSetIsPublicMatching] = useState<boolean | null>(null)
	const isOpenRecruit = localIsPublicMatching ?? profile?.isPublicMatching ?? false
	const setIsOpenRecruit = localSetIsPublicMatching

	const navigate = useNavigate()

	// CTA 모달
	const { modalType, open, close } = useCTAModal()

	// 저장 (유효성 실패 자동 포커싱을 곁들인..)
	const handleSave = useCallback(
		(isPublicMatchingOverride?: boolean) =>
			new Promise<boolean>(resolve => {
				handleSubmit(
					async data => {
						try {
							// 폼 데이터를 API request DTO로 변환
							const requestBody = {
								profileImageFileName: profile?.profileImageFileName ?? '',
								bio: data.introduction ?? '',
								coreCompetencies: data.coreCompetency ?? '',
								userStatus: data.userStatus ?? '',
								isPublicMatching: isPublicMatchingOverride ?? isOpenRecruit,
								careerDuration: data.userCareer ?? '',
								interestedJob: data.interestJob ?? '',
								interestedField: data.interestFields?.[0] ?? '',
								careers: data.careers.map(career => ({
									projectName: career.projectName ?? '',
									industryField: career.industry ?? '',
									startDate: career.startDate ?? '',
									endDate: career.endDate ?? '',
									isOngoing: career.isInProgress ?? false,
									role: career.role ?? '',
									achievements: career.achievements.map(ach => ({
										title: ach.title ?? '',
										content: ach.content ?? '',
									})),
								})),
								portfolios: (data.portfolios ?? []).map(portfolio => {
									const isBlob = portfolio.link?.startsWith('blob:')
									const serverFileUrl =
										portfolio.file?.url && !portfolio.file.url.startsWith('data:') ? portfolio.file.url : null
									const validLink = portfolio.link && !isBlob ? portfolio.link : null
									return {
										title: portfolio.title ?? '',
										link: validLink && validLink !== serverFileUrl ? validLink : null,
										fileUrl: serverFileUrl,
									}
								}),
								projectHistories: (data.projectHistory ?? []).map(history => ({
									projectName: history.title ?? '',
									projectImage: null,
									projectDescription: history.description ?? '',
									startYearMonth: history.date?.split('~')[0] ?? '',
									endYearMonth: history.date?.split('~')[1] ?? '',
								})),
							}

							console.log('저장 요청 데이터:', requestBody)
							await saveProfile(requestBody)
							resolve(true)
						} catch (error) {
							console.error('프로필 저장 실패:', error)
							if (error instanceof Error && 'response' in error) {
								const axiosError = error as { response?: { data?: unknown } }
								console.error('서버 응답:', axiosError.response?.data)
							}
							alert('저장에 실패했습니다. 다시 시도해주세요.')
							resolve(false)
						}
					},
					errors => {
						console.log('폼 에러:', errors)

						// 첫 번째 에러 찾기
						const fieldOrder: (keyof ProfileFormDataType)[] = [
							'introduction',
							'coreCompetency',
							'interestFields',
							'skills',
							'careers',
							'portfolios',
							'projectHistory',
						]

						const firstErrorKey = fieldOrder.find(field => errors[field])

						if (firstErrorKey) {
							// 해당 에러 섹션으로 스크롤
							const errorFieldMap: Record<keyof ProfileFormDataType, string> = {
								userStatus: 'profile-basic-info',
								interestJob: 'profile-basic-info',
								interestOccupation: 'profile-basic-info',
								userCareer: 'profile-basic-info',
								introduction: 'section-01',
								coreCompetency: 'section-02',
								interestFields: 'section-04',
								skills: 'section-05',
								careers: 'section-06',
								portfolios: 'section-07',
								projectHistory: 'section-08',
							}

							const sectionId = errorFieldMap[firstErrorKey]
							if (sectionId) {
								const element = document.getElementById(sectionId)
								if (element) {
									element.scrollIntoView({ behavior: 'smooth', block: 'center' })
								}
							}
						}

						// 에러 메시지 재귀적으로 추출 (주요 경력/이력이 배열이라서 에러메시지가 제대로 안잡힘..)
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
						resolve(false)
					}
				)()
			}),
		[handleSubmit, profile, isOpenRecruit, saveProfile]
	)

	// (버튼 핸들러) 저장 버튼
	const handleSaveWithModal = useCallback(async () => {
		const success = await handleSave()
		if (success) {
			open('save')
		}
	}, [handleSave, open])

	// (버튼 핸들러) 모집 등록/종료 버튼
	const handlePublishRecruitment = () => {
		if (!isOpenRecruit) {
			open('openMatchingRegister')
		} else {
			open('privateMatching')
		}
	}

	// (버튼 핸들러) 프로필 분석 키워드 불러오기 버튼
	const handleProfileKeywordRefresh = () => {
		open('profileKeywordRefresh')
	}

	// (모달 핸들러) 공개 매칭 확인
	const handleOpenMatchingRegister = async () => {
		setIsOpenRecruit(true)
		const success = await handleSave(true)
		if (success) {
			open('openMatchingRegisterComplete')
		}
	}

	// (모달 핸들러) 비공개 전환 확인
	const handlePrivateMatching = async () => {
		setIsOpenRecruit(false)
		const success = await handleSave(false)
		if (success) {
			open('privateMatchingComplete')
		}
	}

	// (모달 핸들러) 매칭 현황으로 이동
	const handleGoToMatching = () => {
		close()
		navigate('/')
	}

	// (모달 핸들러) 프로필 분석으로 이동
	const handleGoToProfileAnalysis = async () => {
		if (!isDirty) {
			close()
			navigate('/profile-analysis')
			return
		}

		const success = await handleSave()
		close()

		if (success) {
			navigate('/profile-analysis')
		}
	}

	// 페이지 이탈 감지 훅
	const { isBlocked, handleLeaveWithoutSaving, handleSaveAndLeave } = useNavigationBlocker({
		isDirty,
		onSave: handleSave,
	})

	return (
		<FormProvider {...methods}>
			<div className='ml-7'>
				<MyPageHeader />

				{/* 전체 컨테이너 */}
				<div className='px-11.5 py-14 rounded-12 bg-white border border-neutral-200'>
					{/* 프사 + 기본 정보 */}
					<div id='profile-basic-info'>
						<ProfileBasicInfo
							control={methods.control}
							isOpenRecruit={isOpenRecruit}
							isSaving={isSaving}
							onSave={handleSaveWithModal}
							onRecruit={handlePublishRecruitment}
							profileImageFileName={profile?.profileImageFileName}
							userName={profile?.name}
							userRole={profile?.role}
							userStatus={userStatus}
							userEmail={profile?.email}
							onStatusChange={status => setValue('userStatus', status, { shouldDirty: true })}
						/>
					</div>

					<div className='flex flex-col gap-16'>
						{/* 섹션 01. 자기소개 */}
						<div id='section-01'>
							<Section01Introduction control={methods.control} />
						</div>

						{/* 섹션 02. 핵심역량 */}
						<div id='section-02'>
							<Section02CoreCompetency control={methods.control} />
						</div>

						{/* 섹션 03. 프로필 분석 키워드 (읽기전용) */}
						<Section03ProfileKeyword hasProfileKeyword={hasProfileKeyword} onRefresh={handleProfileKeywordRefresh} />

						{/* 섹션 04. 관심분야 */}
						<div id='section-04'>
							<Section04InterestFields control={methods.control} />
						</div>

						{/* 섹션 05. 보유스킬 */}
						<div id='section-05'>
							<Section05Skills skills={skills} />
						</div>

						{/* 섹션 06. 주요 경력/이력 */}
						<div id='section-06'>
							<Section06CareerHistory control={methods.control} setValue={setValue} watch={watch} />
						</div>

						{/* 섹션 07. 포트폴리오 */}
						<div id='section-07'>
							<Section07Portfolio control={methods.control} setValue={setValue} watch={watch} />
						</div>

						{/* 섹션 08. 프로젝트 히스토리 */}
						<div id='section-08'>
							<Section08ProjectHistory control={methods.control} />
						</div>
					</div>
				</div>

				{/* 저장 완료 모달 */}
				{modalType === 'save' && (
					<CTAModal message='저장되었습니다' isMessageHighlight={true} rightButtonMsg='확인' onRightClick={close} />
				)}

				{/* 공개 매칭 확인 모달 */}
				{modalType === 'openMatchingRegister' && (
					<CTAModal
						message='{공개 매칭} 등록 하겠습니까?'
						fixedHeight={true}
						leftButtonMsg='돌아가기'
						rightButtonMsg={isSaving ? '공개 매칭 등록중...' : '공개 매칭 등록'}
						onLeftClick={close}
						onRightClick={handleOpenMatchingRegister}
					/>
				)}

				{/* 공개 매칭 완료 모달 */}
				{modalType === 'openMatchingRegisterComplete' && (
					<CTAModal
						message='공개 매칭 등록 되었습니다'
						isMessageHighlight={true}
						fixedHeight={true}
						subMessage='매칭은 매칭 현황에서 확인 할 수 있습니다.'
						leftButtonMsg='매칭 현황가기'
						rightButtonMsg='확인'
						onLeftClick={handleGoToMatching}
						onRightClick={close}
					/>
				)}

				{/* 비공개 전환 확인 모달 */}
				{modalType === 'privateMatching' && (
					<CTAModal
						message='{비공개 전환}하시겠습니까?'
						fixedHeight={true}
						subMessage='이제 공개 매칭에서 프로필이 내려갑니다.'
						leftButtonMsg='돌아가기'
						rightButtonMsg={isSaving ? '비공개 전환중...' : '비공개 전환'}
						onLeftClick={close}
						onRightClick={handlePrivateMatching}
					/>
				)}

				{/* 비공개 전환 완료 모달 */}
				{modalType === 'privateMatchingComplete' && (
					<CTAModal
						message='비공개로 전환 되었습니다'
						isMessageHighlight={true}
						fixedHeight={true}
						rightButtonMsg='확인'
						onRightClick={close}
					/>
				)}

				{/* 프로필 분석 키워드 불러오기 모달 */}
				{modalType === 'profileKeywordRefresh' && (
					<CTAModal
						message={`불러올 프로필 분석이 없습니다.\n저장 후 {프로필 분석}하러 가시겠습니까?`}
						fixedHeight={true}
						leftButtonMsg='돌아가기'
						rightButtonMsg='분석하러 가기'
						onLeftClick={close}
						onRightClick={handleGoToProfileAnalysis}
					/>
				)}

				{/* 페이지 이탈 확인 모달 */}
				{isBlocked && (
					<CTAModal
						message='저장되지 않았습니다.'
						subMessage='저장 후 페이지를 나가시겠습니까?'
						leftButtonMsg='나가기'
						rightButtonMsg='저장 후 나가기'
						onLeftClick={handleLeaveWithoutSaving}
						onRightClick={handleSaveAndLeave}
					/>
				)}
			</div>
		</FormProvider>
	)
}
