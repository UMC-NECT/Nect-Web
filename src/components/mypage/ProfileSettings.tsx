import { useState, useRef, useEffect } from 'react'

import Button from '../common/Button'
import RoundChipButton from '../common/RoundChipButton'
import ProjectCard from './profile-settings/ProjectCard'
import CareerHistorySection from './profile-settings/CareerHistorySection'
import { INTEREST_FIELDS, SKILLS_DATA } from '@/constants/mypage'
import { getErrorMessages, validateProfile, type CareerType } from '@/utils/schemas/profileSchema'

import ProfileImageEditIcon from '@/assets/icons/mypage/profile-image-edit.svg?react'
import RefreshIcon from '@/assets/icons/mypage/refresh.svg?react'
import EditPencilIcon from '@/assets/icons/mypage/edit-pencil.svg?react'
import ClipIcon from '@/assets/icons/mypage/clip.svg?react'

export const ProfileSettings = () => {
	// 자기소개 상태
	const [introduction, setIntroduction] = useState('')

	// 핵심역량 상태
	const [coreCompetency, setCoreCompetency] = useState('')
	const competencyRef = useRef<HTMLTextAreaElement>(null)

	// 관심분야 상태
	const [selectedFields, setSelectedFields] = useState<string[]>(['IT · 웹/모바일 서비스', '교육 · 에듀테크', '금융 · 핀테크'])

	// 보유 스킬 상태
	const [skills] = useState<Record<string, string[]>>(SKILLS_DATA)

	// 경력 상태
	const [careers, setCareers] = useState<CareerType[]>([
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
	])

	// 핵심역량 textarea 자동 높이 조절용 (작성하는만큼 늘어남)
	useEffect(() => {
		if (competencyRef.current) {
			competencyRef.current.style.height = 'auto'
			competencyRef.current.style.height = `${competencyRef.current.scrollHeight}px`
		}
	}, [coreCompetency])

	// 관심 분야 태그버튼 토글
	const toggleField = (field: string) => {
		setSelectedFields(prev => (prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]))
	}

	// 핵심 역량 필드 작성시, 불렛 리스트로 작성되도록 하는 함수들
	const handleCompetencyFocus = () => {
		if (!coreCompetency) {
			setCoreCompetency('• ')
		}
	}
	const handleCompetencyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCoreCompetency(e.target.value)
	}
	const handleCompetencyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
			e.preventDefault()
			setCoreCompetency(prev => prev + '\n• ')
		}
	}

	// 불렛만 있는지 확인
	const hasActualContent = (text: string) => {
		// 불렛(•)과 공백, 줄바꿈을 제거한 후 내용이 있는지 확인
		const withoutBullets = text.replace(/•/g, '').replace(/\s/g, '')
		return withoutBullets.length > 0
	}

	// 저장 핸들러
	const handleSave = () => {
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
			console.error('유효성 검사 실패:', errors)

			// 에러 메시지 표시
			alert(errors.map((err: { path: string; message: string }) => err.message).join('\n'))
			return
		}

		// 유효성 검사 통과 시 API 호출
		console.log('유효성 검사 통과:', result.data)
	}

	return (
		<div className='ml-7'>
			{/* 브레드크럼 + 타이틀 */}
			<div className='ml-3 mb-9 w-fit'>
				<nav className='body-2 text-neutral-400 mb-7'>
					<span>마이 페이지</span>
					<span className='mx-2'>{'>'}</span>
					<span>나의 정보관리</span>
					<span className='mx-2'>{'>'}</span>
					<span className=''>내 프로필 설정</span>
				</nav>

				<h1 className='text-2xl font-bold text-neutral-900 mb-8'>프로필 설정</h1>
			</div>

			{/* 전체 컨테이너 */}
			<div className='px-11.5 py-14 rounded-12 bg-white border border-neutral-200'>
				{/* 기본정보 섹션 */}
				<div className='flex items-start justify-between mb-10 ml-2.5'>
					{/* 좌측 - 기본 정보 */}
					<div className='flex items-center gap-4'>
						<ProfileImageEditIcon />

						{/* 소개글 */}
						<div>
							<div className='flex items-center gap-2.5 mb-1'>
								<span className='title-2 font-bold'>이방토</span>
								<span className='text-neutral-300 font-semibold'>|</span>
								<span className='title-2 text-neutral-400'>Design</span>
							</div>
							<p className='body-2 text-neutral-500 mb-2'>ellaelia2@hanyang.ac.kr</p>
							<span className='text-[14px] text-primary-500-normal leading-[140%] font-semibold bg-primary-100-light border border-primary-200-light px-3 py-1 rounded-100'>
								재학 중
							</span>
						</div>
					</div>

					{/* 우측 - 버튼 2개 */}
					<div className='flex gap-4'>
						<Button color='mypage1' className='w-32.5' onClick={handleSave}>
							저장
						</Button>
						<Button color='mypage2' className='w-32.5 px-2.5'>
							공개 매칭 등록
						</Button>
					</div>
				</div>

				{/* 관심 분야 섹션 */}
				<div className='grid grid-cols-[100px_1fr] gap-y-3 body-1 mb-12 ml-5'>
					<span className='text-neutral-600'>관심 직무</span>
					<span className='text-neutral-900'>UX/UI Product Designer / UX researcher</span>
					<span className='text-neutral-600'>관심 직종</span>
					<span className='text-neutral-900'>UX/UI 브랜딩/채용</span>
					<span className='text-neutral-600'>경력</span>
					<span className='text-neutral-900'>6개월</span>
				</div>

				<div className='flex flex-col gap-16'>
					{/* 자기소개 섹션 */}
					<section className='my-2.5'>
						<h2 className='title-2 font-bold text-neutral-900 mb-2 ml-5'>
							자기소개 <span className='text-danger-700'>*</span>
						</h2>
						<textarea
							className='w-full h-22.5 px-5 py-4 text-[16px] leading-[180%] tracking-[-0.5px] resize-none focus:outline-none placeholder:text-[16px] placeholder:text-neutral-300 hover:bg-neutral-50 duration-200 ease-in-out rounded-12'
							placeholder={`가장 먼저 읽게 되는 글입니다.\n프로필 카드에 보여질 간단한 자기소개를 작성해주세요 (2문장)`}
							value={introduction}
							onChange={e => setIntroduction(e.target.value)}
						/>
					</section>

					{/* 핵심역량 섹션 */}
					<section className='my-2.5'>
						<h2 className='title-2 font-bold text-neutral-900 mb-2  ml-5'>
							핵심역량 <span className='text-danger-700'>*</span>
						</h2>
						<textarea
							ref={competencyRef}
							className={`w-full min-h-29.75 px-5 py-4 text-[16px] leading-[180%] tracking-[-0.5px] resize-none focus:outline-none placeholder:text-[16px] placeholder:text-neutral-300 hover:bg-neutral-50 duration-200 ease-in-out rounded-12 ${
								hasActualContent(coreCompetency) ? 'text-neutral-900' : 'text-neutral-300'
							}`}
							placeholder={`직무와 연관된 자신의 핵심 역량을 간단하게 적어주세요\n5줄 이내를 권장 드립니다.\nex. 사용자 경험을 기반으로 한 UX 전략 도출 및 서비스 프로토타입 설계 가능`}
							value={coreCompetency}
							onFocus={handleCompetencyFocus}
							onChange={handleCompetencyChange}
							onKeyDown={handleCompetencyKeyDown}
						/>
					</section>

					{/* 프로필 분석 키워드 섹션 */}
					<section className='my-2.5'>
						<div className='flex items-center justify-between'>
							<h2 className='title-2 font-bold text-neutral-900 ml-5'>
								프로필 분석 키워드 <span className='text-danger-700'>*</span>
							</h2>

							<Button color='text' size='sm'>
								<RefreshIcon className='w-4 h-4 mr-1' />
								불러오기
							</Button>
						</div>

						{/* 검사 결과 */}
						<div className='px-5 py-4'>
							<p className='text-[16px] leading-[180%] tracking-[-0.5px] text-primary-500-normal font-medium'>
								[섬세한 서포터형] 타입
							</p>
							<p className='text-[16px] leading-[180%] tracking-[-0.5px] text-neutral-600'>
								#포트폴리오 집중 #신중한 설계자 #비주얼 전문가
							</p>
						</div>
					</section>

					{/* 관심 분야 섹션 */}
					<section className=' ml-5'>
						<h2 className='title-2 font-bold text-neutral-900 mb-4'>
							관심 분야 <span className='text-danger-700'>*</span>
						</h2>
						<div className='flex flex-wrap gap-3'>
							{INTEREST_FIELDS.map(field => (
								<RoundChipButton
									key={field}
									text={field}
									isChecked={selectedFields.includes(field)}
									onClick={() => toggleField(field)}
									className='w-auto'
								/>
							))}
						</div>
					</section>

					{/* 보유스킬 섹션 */}
					<section className='my-2.5 ml-5'>
						<div className='flex items-center justify-between mb-4'>
							<h2 className='title-2 font-bold text-neutral-900'>
								보유스킬 <span className='text-danger-700'>*</span>
							</h2>

							<Button color='text' size='sm'>
								<EditPencilIcon className='w-4 h-4 mr-1' />
								수정
							</Button>
						</div>

						<div className='flex flex-col gap-5'>
							{Object.entries(skills).map(([category, skillList]) => (
								<div key={category} className='flex items-center gap-3'>
									{/* 카테고리 */}
									<span className='body-1 text-neutral-600 w-16 shrink-0'>{category}</span>

									{/* 태그 */}
									<div className='flex flex-wrap gap-1.5'>
										{skillList.map(skill => (
											<span
												key={skill}
												className='body-1 bg-neutral-000 text-neutral-700 border border-[#EEEEEE] px-4 py-1.5 rounded-100'
											>
												{skill}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</section>

					{/* 주요 경력/이력 섹션 */}
					<CareerHistorySection careers={careers} onCareersChange={setCareers} />

					{/* 포트폴리오 링크 및 파일 */}
					<section className='ml-5'>
						<div className='flex items-center justify-between mb-1.5'>
							<h2 className='title-2 font-bold text-neutral-900'>포트폴리오 링크 및 파일</h2>

							<Button color='text' size='sm'>
								+ 항목 추가
							</Button>
						</div>

						<div className='flex gap-2.5 items-start px-5 py-4'>
							<ClipIcon className='w-4.5 h-4.5 mt-1' />
							<div>
								<p className='body-1 text-neutral-300'>제목</p>
								<p className='body-1 text-neutral-300'>링크 붙여넣기 및 파일 드래그</p>
							</div>
						</div>
					</section>

					{/* 넥트 프로젝트 히스토리 */}
					<section className='ml-5'>
						<div className='flex items-center justify-between mb-4'>
							<h2 className='title-2 font-bold text-neutral-900'>넥트 프로젝트 히스토리</h2>

							<Button color='text' size='sm'>
								+ 프로젝트 추가
							</Button>
						</div>

						{/* 프로젝트 카드 */}
						<ProjectCard
							title='트리플 UX.UI 개선 및 리브랜딩'
							description='사용 체류 시간을 늘리고 기업 비전에 맞ㄱ게 전략 및 BI 제안 / 여행의 전반에 활용 될 수 있는 UX Flow 개선 / GUI 제작'
							date='2025.10~2025.12'
						/>
					</section>
				</div>
			</div>
		</div>
	)
}
