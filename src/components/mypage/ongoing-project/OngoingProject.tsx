import { useState } from 'react'
import Button from '@/components/common/Button'
import { MyPageHeader } from '../MyPageHeader'
import HamburgerIcon from '@/assets/icons/common/hamburger.svg?react'
import BulletTextArea from '@/components/common/BulletTextArea'
import Tabbar from './Tabbar'
import ProjectBasicInfo from './ProjectBasicInfo'
import ProjectFieldSection from './sections/ProjectFieldSection'
import RecruitmentInfoSection from './sections/RecruitmentInfoSection'
import TeamCompositionSection from './sections/TeamCompositionSection'
import LeaderProfileSection from './sections/LeaderProfileSection'
import TeamHistorySection from './sections/TeamHistorySection'
import type { ColorType } from '@/types/mypage/ongoindProject'
import Section07Portfolio from '../profile-settings/sections/Section07Portfolio'

interface ProjectData {
	name: string
	intro: string
	startDate: string
	endDate: string
	recruitmentStatus: '모집 전' | '모집 중' | '모집 완료'
	thumbnailUrl?: string
	selectedFields: string[]
}

interface TeamComposition {
	role: string
	count: number
	positions: { name: string; count: number }[]
}

interface ProjectHistory {
	id: number
	title: string
	description: string
	period: string
	imageUrl?: string
	tags: string[]
}

export type TabType = '프로젝트 설정' | '팀원 관리'
export type RoleType = 'PM' | 'Design' | 'Frontend' | 'Backend'

const OngoingProject = () => {
	const [activeTab, setActiveTab] = useState<TabType>('프로젝트 설정')
	const [projectData, setProjectData] = useState<ProjectData>({
		name: '넥트(Nect)',
		intro: '아이디어 분석으로 프로젝트 등록, 팀원 매칭, 협업 보드까지, 사이드 프로젝트 웹 플랫폼 개발',
		startDate: '2025. 11. 13',
		endDate: '2026. 02. 11',
		recruitmentStatus: '모집 전',
		selectedFields: ['IT · 웹/모바일 서비스'],
	})

	// 직접 입력 섹션들 상태 관리
	const [recruitmentInfo, setRecruitmentInfo] = useState<string>('') // 모집
	const [projectGoal, setProjectGoal] = useState<string>('') // 프로젝트 목표
	const [mainContent, setMainContent] = useState<string>('') // 주요 내용
	const [serviceUser, setServiceUser] = useState<string>('') // 서비스 유저

	// 파트 선택 모달 상태
	const [isPartModalOpen, setIsPartModalOpen] = useState(false)
	const [selectedPart, setSelectedPart] = useState<RoleType>('PM')

	/* 더미 데이터 모음
		- teamComposition: 팀 구성 데이터
		- projectHistories: 팀원 프로젝트 히스토리
	*/
	const teamComposition: TeamComposition[] = [
		{ role: '기획', count: 1, positions: [{ name: 'PM', count: 1 }] },
		{ role: '디자인', count: 1, positions: [{ name: 'Design', count: 2 }] },
		{
			role: '개발',
			count: 8,
			positions: [
				{ name: 'Frontend', count: 4 },
				{ name: 'Backend', count: 4 },
			],
		},
	]
	const projectHistories: ProjectHistory[] = [
		{
			id: 1,
			title: '트리플 UX.UI 개선 및 리브랜딩',
			description:
				'사용 체류 시간을 늘리고 기업 비전에 맞게 전략 및 BI 제안 / 여행의 전반에 활용 될 수 있는 UX Flow 개선 / GUI 제작',
			period: '2025.10~2025.12',
			tags: ['PM', 'Backend'],
		},
		{
			id: 2,
			title: '트리플 UX.UI 개선 및 리브랜딩',
			description:
				'사용 체류 시간을 늘리고 기업 비전에 맞게 전략 및 BI 제안 / 여행의 전반에 활용 될 수 있는 UX Flow 개선 / GUI 제작',
			period: '2025.10~2025.12',
			tags: ['Design'],
		},
	]

	// 목록으로 가기
	const handleGoList = () => {
		alert('프로젝트 목록으로 가기')
	}

	const handleSave = () => {
		console.log('Saving project data...')
	}

	const handlePublishRecruitment = () => {
		console.log('Publishing recruitment...')
	}

	const toggleField = (field: string) => {
		setProjectData(prev => ({
			...prev,
			selectedFields: prev.selectedFields.includes(field)
				? prev.selectedFields.filter(f => f !== field)
				: [...prev.selectedFields, field],
		}))
	}

	// 탭바 토글 핸들러
	const handleActivateTab = (tabName: TabType) => {
		setActiveTab(tabName)
	}

	// 파트별로 태그 색상 변환하는 함수
	const getRoleColor = (partName: string): ColorType => {
		switch (partName) {
			case 'PM':
				return 'purple'
			case 'Design':
				return 'pink'
			case 'Backend':
				return 'blue'
			case 'Frontend':
				return 'green'
			default:
				return 'purple'
		}
	}

	// 역할 선택 모달에 전달할 역할/컬러 배열
	const roleValues: { role: RoleType; color: ColorType }[] = [
		{ role: 'PM', color: getRoleColor('PM') },
		{ role: 'Design', color: getRoleColor('Design') },
		{ role: 'Frontend', color: getRoleColor('Frontend') },
		{ role: 'Backend', color: getRoleColor('Backend') },
	]

	return (
		<div className='ml-7 w-full'>
			{/* 브레드크럼 + 타이틀 */}
			<MyPageHeader
				action={
					<Button
						color='socialLogin'
						size='sm'
						onClick={handleGoList}
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
				{/* 타이틀 */}
				<div className='flex items-center justify-between mb-7'>
					<h2 className='heading-2 font-bold text-neutral-900'>{projectData.name.replace('Nect', 'NECT')}</h2>

					{/* 버튼 2개 */}
					<div className='flex items-center gap-2'>
						<Button color='mypage1' onClick={handleSave}>
							저장
						</Button>
						<Button color='mypage2' onClick={handlePublishRecruitment}>
							모집 등록
						</Button>
					</div>
				</div>

				{/* 탭바 */}
				<Tabbar currentTab={activeTab} onClick={handleActivateTab} />

				{/* 전체 컨테이너 */}
				<div className='flex flex-col gap-16'>
					{/* 썸네일 + 기본 정보 */}
					<ProjectBasicInfo projectData={projectData} />

					{/* 섹션 01. 프로젝트 분야 */}
					<ProjectFieldSection selectedFields={projectData.selectedFields} onToggleField={toggleField} />

					{/* 섹션 02. 모집 정보 및 필수 스택 */}
					<RecruitmentInfoSection
						isPartModalOpen={isPartModalOpen}
						setIsPartModalOpen={setIsPartModalOpen}
						selectedPart={selectedPart}
						setSelectedPart={setSelectedPart}
						roleValues={roleValues}
						recruitmentInfo={recruitmentInfo}
						setRecruitmentInfo={setRecruitmentInfo}
					/>

					{/* 섹션 03. 프로젝트 파트/팀원 구성 */}
					<TeamCompositionSection
						teamComposition={teamComposition}
						getRoleColor={getRoleColor}
						onEditClick={() => alert('팀원 관리 탭으로 넘어가게끔..')}
					/>

					{/* 섹션 04. 프로젝트 목표 */}
					<BulletTextArea
						value={projectGoal}
						onChange={setProjectGoal}
						sectionTitle='프로젝트 목표'
						placeholder='프로젝트 목표를 간략하게 작성해주세요.'
					/>

					{/* 섹션 05. 주요 내용 */}
					<BulletTextArea
						value={mainContent}
						onChange={setMainContent}
						sectionTitle='주요 내용'
						placeholder={`프로젝트에서 진행할 주요 활동 / 구현 기능 등을 작성해주세요. (5가지 권장)\nex. 알림 및 채팅, 실시간 커뮤니케이션 기능`}
					/>

					{/* 섹션 06. 서비스 사용자 */}
					<BulletTextArea
						value={serviceUser}
						onChange={setServiceUser}
						sectionTitle='서비스 사용자'
						hasStar={false}
						placeholder={`서비스의 주요 사용자/사용층을 간략하게 적어주세요.\nex. 대학생 - 공모전, 해커톤, 포트폴리오 프로젝트를 진행하고 싶은 학생`}
					/>

					{/* 섹션 07. 프로젝트 세부 기획 파일 */}
					<Section07Portfolio />

					{/* 섹션 08. 리더 프로필 */}
					<LeaderProfileSection />

					{/* 섹션 09. 팀원들의 프로젝트 히스토리 */}
					<TeamHistorySection projectHistories={projectHistories} getRoleColor={getRoleColor} />
				</div>
			</div>
		</div>
	)
}

export default OngoingProject
