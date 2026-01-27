import { useState, useEffect, useCallback, useMemo } from 'react'
import { useBlocker } from 'react-router'

import ConfirmModal from '../../common/ConfirmModal'
import { MyPageHeader } from '../MyPageHeader'
import { getErrorMessages, validateProfile, type CareerType } from '@/utils/schemas/profileSchema'
import { SKILLS_DATA } from '@/constants/mypage'

import ProfileBasicInfo from './ProfileBasicInfo'
import Section01Introduction from './sections/Section01Introduction'
import Section02CoreCompetency from './sections/Section02CoreCompetency'
import Section03ProfileKeyword from './sections/Section03ProfileKeyword'
import Section04InterestFields from './sections/Section04InterestFields'
import Section05Skills from './sections/Section05Skills'
import Section06CareerHistory from './sections/Section06CareerHistory'
import Section07Portfolio from './sections/Section07Portfolio'
import Section08ProjectHistory from './sections/Section08ProjectHistory'

// 초기 상태 값
const INITIAL_INTRODUCTION = ''
const INITIAL_COMPETENCY = ''
const INITIAL_FIELDS = ['IT · 웹/모바일 서비스', '교육 · 에듀테크', '금융 · 핀테크']
const INITIAL_CAREERS: CareerType[] = [
	{
		id: 1,
		projectName: '',
		startDate: '',
		endDate: '',
		isInProgress: false,
		industry: '',
		role: '',
		achievements: [{ id: 1, title: '', content: '' }],
	},
]

export const ProfileSettings = () => {
	// 상태들
	const [introduction, setIntroduction] = useState(INITIAL_INTRODUCTION) // 자기소개
	const [coreCompetency, setCoreCompetency] = useState(INITIAL_COMPETENCY) // 핵심역량
	const [selectedFields, setSelectedFields] = useState<string[]>(INITIAL_FIELDS) // 관심분야
	const [skills] = useState<Record<string, string[]>>(SKILLS_DATA) // 보유 스킬
	const [careers, setCareers] = useState<CareerType[]>(INITIAL_CAREERS) // 경력

	// 저장된 초기값들을 state로 관리 (저장 성공 시 업데이트)
	const [savedData, setSavedData] = useState({
		introduction: INITIAL_INTRODUCTION,
		coreCompetency: INITIAL_COMPETENCY,
		selectedFields: INITIAL_FIELDS,
		careers: INITIAL_CAREERS,
	})

	// 변경사항 감지
	const isDirty = useMemo(() => {
		const hasIntroductionChanged = introduction !== savedData.introduction
		const hasCompetencyChanged = coreCompetency !== savedData.coreCompetency
		const hasFieldsChanged = JSON.stringify(selectedFields) !== JSON.stringify(savedData.selectedFields)
		const hasCareersChanged = JSON.stringify(careers) !== JSON.stringify(savedData.careers)

		return hasIntroductionChanged || hasCompetencyChanged || hasFieldsChanged || hasCareersChanged
	}, [introduction, coreCompetency, selectedFields, careers, savedData])

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (isDirty) {
				e.preventDefault()
				e.returnValue = ''
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [isDirty])

	// 내부 이동 감지 (뒤로가기, 링크 클릭 등)
	const blocker = useBlocker(
		({ currentLocation, nextLocation }) => isDirty && currentLocation.pathname !== nextLocation.pathname
	)

	// 관심 분야 태그버튼 토글
	const toggleField = (field: string) => {
		setSelectedFields(prev => (prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]))
	}

	// 저장 핸들러
	const handleSave = useCallback(() => {
		const profileData = {
			introduction,
			coreCompetency,
			interestFields: selectedFields,
			skills,
			careers,
		}

		const result = validateProfile(profileData)

		if (!result.success) {
			const errors = getErrorMessages(result.error)
			alert(errors.map((err: { path: string; message: string }) => err.message).join('\n'))

			// 유효성 검사 실패 시, 이동하려던 것이었다면 이동 취소(모달 닫고 현재 페이지 유지)
			if (blocker.state === 'blocked') {
				blocker.reset()
			}
			return false
		}

		// 추후 API 호출 로직
		console.log('유효성 검사 통과 및 저장:', result.data)

		// 저장 성공 시 현재 값을 저장된 값으로 업데이트 (isDirty를 false로 만듦)
		setSavedData({
			introduction,
			coreCompetency,
			selectedFields: [...selectedFields],
			careers: JSON.parse(JSON.stringify(careers)),
		})

		return true
	}, [introduction, coreCompetency, selectedFields, skills, careers, blocker])

	/*
		모달 관련 핸들러들
		- handleLeaveWithoutSaving: 저장하지 않고 나가기
		- handleSaveAndLeave: 저장 후 나가기
		- handleCloseModal: 모달 닫기 (취소 or 모달 제외한 영역 누를 경우)
	*/
	const handleLeaveWithoutSaving = () => {
		if (blocker.state === 'blocked') {
			blocker.proceed() // 이동 진행
		}
	}
	const handleSaveAndLeave = () => {
		const success = handleSave()
		if (success) {
			// 저장 성공 시 이동 진행
			if (blocker.state === 'blocked') {
				blocker.proceed()
			}
		}
	}
	const handleCloseModal = () => {
		if (blocker.state === 'blocked') {
			blocker.reset() // 이동을 취소하고 현재 페이지에 머무름
		}
	}

	return (
		<div className='ml-7'>
			<MyPageHeader />

			{/* 전체 컨테이너 */}
			<div className='px-11.5 py-14 rounded-12 bg-white border border-neutral-200'>
				{/* 프사 + 기본 정보 */}
				<ProfileBasicInfo onSave={handleSave} />

				<div className='flex flex-col gap-16'>
					{/* 섹션 01. 자기소개 */}
					<Section01Introduction value={introduction} onChange={setIntroduction} />

					{/* 섹션 02. 핵심역량 */}
					<Section02CoreCompetency value={coreCompetency} onChange={setCoreCompetency} />

					{/* 섹션 03. 프로필 분석 키워드 */}
					<Section03ProfileKeyword />

					{/* 섹션 04. 관심분야 */}
					<Section04InterestFields selectedFields={selectedFields} onToggleField={toggleField} />

					{/* 섹션 05. 보유스킬 */}
					<Section05Skills skills={skills} />

					{/* 섹션 06. 주요 경력/이력 */}
					<Section06CareerHistory careers={careers} onCareersChange={setCareers} />

					{/* 섹션 07. 포트폴리오 */}
					<Section07Portfolio />

					{/* 섹션 08. 프로젝트 히스토리 */}
					<Section08ProjectHistory />
				</div>
			</div>

			{/* 페이지 이탈 확인 모달 */}
			<ConfirmModal
				isOpen={blocker.state === 'blocked'}
				onClose={handleCloseModal}
				title='페이지 이탈하겠습니까?'
				description='변경사항은 자동 저장되지 않습니다.'
				cancelText='저장하지 않고 나가기'
				confirmText='저장 후 나가기'
				onCancel={handleLeaveWithoutSaving}
				onConfirm={handleSaveAndLeave}
			/>
		</div>
	)
}
