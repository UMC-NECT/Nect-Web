import { useCallback } from 'react'
import { FormProvider } from 'react-hook-form'

import { useNavigationBlocker } from '@/hooks/mypage/useNavigationBlocker'
import { useProfileSettingsForm } from '@/hooks/mypage/useProfileSettingsForm'
import type { ProfileFormDataType } from '@/utils/schemas/profileSchema'

import CTAModal from '../CTAModal'
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
	const methods = useProfileSettingsForm()
	const {
		handleSubmit,
		formState: { isDirty },
		reset,
		watch,
		setValue,
	} = methods

	// 폼 데이터
	const skills = watch('skills')

	// 저장 (유효성 실패 자동 포커싱을 곁들인..)
	const handleSave = useCallback(
		() =>
			new Promise<boolean>(resolve => {
				handleSubmit(
					data => {
						console.log('유효성 검사 통과 및 저장:', data)
						reset(data)
						resolve(true)
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
		[handleSubmit, reset]
	)

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
					<ProfileBasicInfo onSave={handleSave} />

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
						<Section03ProfileKeyword />

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
							<Section08ProjectHistory control={methods.control} setValue={setValue} />
						</div>
					</div>
				</div>

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
