import TeamBoardHeader from '@/components/team-board/TeamBoardHeader'
import RadarChartCard from '@/components/team-board/RadarChartCard'
import ContentListCard from '@/components/team-board/ContentListCard'
import TeamProfileBoard from '@/components/team-board/TeamProfileBoard'
import Calendar from '@/components/team-board/Calendar'
import AddScheduleButton from '@/components/team-board/AddScheduleButton'
import UpcomingTeamSchedule from '@/components/team-board/UpcomingTeamSchedule'

const TeamBoardPage = () => {
	// 샘플 데이터
	const avatars = [
		'https://placehold.co/60x60',
		'https://placehold.co/60x60',
		'https://placehold.co/60x60',
		'https://placehold.co/60x60',
		'https://placehold.co/60x60',
	]

	const radarChartData = [
		{
			label: 'PM',
			score: 16,
			maxScore: 20,
			color: 'var(--color-roletag-purple)',
			roleColor: 'var(--color-roletag-purple)',
			angle: 0, // 12시 방향
		},
		{
			label: 'Design',
			score: 16,
			maxScore: 20,
			color: 'var(--color-roletag-pink)',
			roleColor: 'var(--color-roletag-pink)',
			angle: 60, // 2시 방향
		},
		{
			label: 'Role',
			score: 18,
			maxScore: 20,
			color: 'var(--color-roletag-orange)',
			roleColor: 'var(--color-roletag-orange)',
			angle: 120, // 4시 방향
		},
		{
			label: 'Backend',
			score: 16,
			maxScore: 20,
			color: 'var(--color-roletag-blue)',
			roleColor: 'var(--color-roletag-blue)',
			angle: 180, // 6시 방향
		},
		{
			label: 'Frontend',
			score: 16,
			maxScore: 20,
			color: 'var(--color-roletag-green)',
			roleColor: 'var(--color-roletag-green)',
			angle: 240, // 8시 방향
		},
		{
			label: 'Role',
			score: 18,
			maxScore: 20,
			color: 'var(--color-roletag-yellow)',
			roleColor: 'var(--color-roletag-yellow)',
			angle: 300, // 10시 방향
		},
	]

	const bulletinBoardItems = [
		{ title: '팀별 주간 업무 보고 양식 안내', date: '2024.1.10', tag: '[필독]' },
		{ title: '이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~', date: '2024.01.10', tag: '[공지]' },
		{ title: '회의록 (댓글에 변동사항 추가)', date: '2024.1.10' },
		{ title: '프로젝트 공동 경비 사용 내역', date: '0000.00.00' },
	]

	const sharedDocumentItems = [
		{ title: '서비스 기획안 & 기능 명세서', date: '2024.1.10', fileType: 'PDF' as const },
		{ title: 'UI/UX 디자인 시스템', date: '2024.1.10', fileType: 'Figma' as const },
		{ title: 'UI 구현 피그마 페이지', date: '2024.1.10', fileType: 'Figma' as const },
		{ title: '웹사이트 개발 임시 배포 링크', date: '0000.00.00', fileType: 'PDF' as const },
	]

	const upcomingScheduleItems = [
		{
			dayOfWeek: 'Mon',
			date: 16,
			title: '개발 스프링부트 데이',
			dateString: '12월 16일 - 12월 17일',
			isHighlighted: false,
			outlineColor: 'neutral-100' as const,
		},
		{
			dayOfWeek: 'Wed',
			date: 18,
			title: '프로젝트 회의',
			dateString: '12월 18일',
			time: '14:00 - 15:30',
			isHighlighted: true,
			outlineColor: 'primary-300' as const,
		},
		{
			dayOfWeek: 'Fri',
			date: 26,
			title: '개발 스프링부트 데이',
			dateString: '12월 26일 - 12월 27일',
			isHighlighted: false,
			outlineColor: 'neutral-100' as const,
		},
		{
			dayOfWeek: 'Fri',
			date: 2,
			title: '파트 팀장 회의',
			dateString: '2026년 1월 2일',
			time: '13:15 - 14:30',
			isHighlighted: false,
			outlineColor: 'neutral-100' as const,
		},
	]

	const calendarDays = [
		// 일요일
		[
			{ date: 30, isActive: false, isToday: false, isSelected: false, hasTasks: true },
			{ date: 7, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 14, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 21, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 28, isActive: true, isToday: false, isSelected: false, hasTasks: false },
		],
		// 월요일
		[
			{ date: 1, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 8, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 15, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 22, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 29, isActive: true, isToday: false, isSelected: false, hasTasks: false },
		],
		// 화요일
		[
			{ date: 2, isActive: true, isToday: false, isSelected: false, hasTasks: true },
			{ date: 9, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 16, isActive: true, isToday: true, isSelected: true, hasTasks: true },
			{ date: 23, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 30, isActive: true, isToday: false, isSelected: false, hasTasks: false },
		],
		// 수요일
		[
			{ date: 3, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 10, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 17, isActive: true, isToday: false, isSelected: false, hasTasks: true },
			{ date: 24, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 31, isActive: true, isToday: false, isSelected: false, hasTasks: false },
		],
		// 목요일
		[
			{ date: 4, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 11, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 18, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 25, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 1, isActive: false, isToday: false, isSelected: false, hasTasks: false },
		],
		// 금요일
		[
			{ date: 5, isActive: true, isToday: false, isSelected: false, hasTasks: true },
			{ date: 12, isActive: true, isToday: false, isSelected: false, hasTasks: true },
			{ date: 19, isActive: true, isToday: false, isSelected: false, hasTasks: true },
			{ date: 26, isActive: true, isToday: false, isSelected: false, hasTasks: true },
			{ date: 2, isActive: false, isToday: false, isSelected: false, hasTasks: true },
		],
		// 토요일
		[
			{ date: 6, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 13, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 20, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 27, isActive: true, isToday: false, isSelected: false, hasTasks: false },
			{ date: 3, isActive: false, isToday: false, isSelected: false, hasTasks: false },
		],
	]

	const teamProfiles = [
		{
			name: '닉네임5자',
			role: '파트',
			contact: '000-0000-000',
			time: '04:08:56',
			status: {
				beforeProgress: 0,
				inProgress: 0,
				completed: 0,
			},
		},
		{
			name: '이방토',
			role: '파트',
			contact: '000-0000-000',
			time: '04:58:57',
			status: {
				beforeProgress: 0,
				inProgress: 0,
				completed: 0,
			},
		},
		{
			name: '닉네임5자',
			role: '파트',
			contact: '000-0000-000',
			time: '04:08:56',
			status: {
				beforeProgress: 0,
				inProgress: 0,
				completed: 0,
			},
		},
		{
			name: '이방토',
			role: '파트',
			contact: '000-0000-000',
			time: '04:58:57',
			status: {
				beforeProgress: 0,
				inProgress: 0,
				completed: 0,
			},
		},
		{
			name: '닉네임5자',
			role: '파트',
			contact: '000-0000-000',
			time: '04:08:56',
			status: {
				beforeProgress: 0,
				inProgress: 0,
				completed: 0,
			},
		},
		{
			name: '이방토',
			role: '파트',
			contact: '000-0000-000',
			time: '04:58:57',
			status: {
				beforeProgress: 0,
				inProgress: 0,
				completed: 0,
			},
		},
	]

	return (
		<div className="flex flex-col w-full max-w-[1440px] mx-auto px-6 py-8 gap-7">
			{/* 상단 헤더 영역 (1224x180) */}
			<div className="w-[1224px] h-[180px]">
				<TeamBoardHeader
					title="넥트 웹사이트 개발 프로젝트"
					description="크리에이터를 위한 사이드 프로젝트 매칭 & 협업 플랫폼"
					notice="이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~"
					regularMeeting="매주 금요일 PM 8:30 / 강남 사거리역 스타벅스"
					memberCount={20}
					memberAvatars={avatars}
					startDate="2025.11.14"
					endDate="2026.2.20"
				/>
			</div>

			{/* 헤더/메인 구분선 */}
			<div className="w-[1224px] border-b border-neutral-200" />

			{/* 메인 콘텐츠 영역 (1224x990) */}
			<div className="flex items-start justify-between w-[1224px]">
				{/* 왼쪽 영역 (808x990) */}
				<div className="flex flex-col gap-4 w-[808px]">
					{/* 상단: RadarChartCard + ContentListCard 두 개 (808x448) */}
					<div className="flex gap-4 h-[448px]">
						{/* RadarChartCard (392x448) */}
						<RadarChartCard title="팀 역할별 역량" totalScore={80} maxScore={80} data={radarChartData} />
						{/* ContentListCard 두 개 (세로 배치, 392x216 각각) */}
						<div className="flex flex-col gap-4">
							<ContentListCard type="게시판" items={bulletinBoardItems} />
							<ContentListCard type="공유 문서함" items={sharedDocumentItems} />
						</div>
					</div>

					{/* 하단: TeamProfileBoard (808x518) */}
					<div className="h-[518px]">
						<TeamProfileBoard
							mainProfile={{
								name: '이방토',
								role: 'Design',
								time: '04:58:57',
								status: {
									beforeProgress: 20,
									inProgress: 20,
									completed: 20,
								},
								onStartWork: () => console.log('작업 시작'),
							}}
							profiles={teamProfiles}
						/>
					</div>
				</div>

				{/* 오른쪽 영역 (392x990) */}
				<div className="flex flex-col gap-4 w-[392px]">
					{/* 상단: Calendar + AddScheduleButton (392x448) */}
					<div className="flex flex-col gap-4 h-[448px]">
						<Calendar
							year={2026}
							month={12}
							days={calendarDays}
							onPreviousMonth={() => console.log('이전 달')}
							onNextMonth={() => console.log('다음 달')}
							onDayClick={(date) => console.log('날짜 클릭:', date)}
						/>
						<AddScheduleButton onClick={() => console.log('새 일정 추가')} />
					</div>

					{/* 하단: UpcomingTeamSchedule (392x518) */}
					<div className="h-[518px]">
						<UpcomingTeamSchedule items={upcomingScheduleItems} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default TeamBoardPage
