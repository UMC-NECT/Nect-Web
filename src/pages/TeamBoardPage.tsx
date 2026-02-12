import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import TeamBoardHeader from '@/components/team-board/TeamBoardHeader'
import RadarChartCard from '@/components/team-board/RadarChartCard'
import ContentListCard from '@/components/team-board/ContentListCard'
import TeamProfileBoard from '@/components/team-board/TeamProfileBoard'
import Calendar from '@/components/team-board/Calendar'
import AddScheduleButton from '@/components/team-board/AddScheduleButton'
import AddScheduleModal from '@/components/team-board/AddScheduleModal'
import UpcomingTeamSchedule from '@/components/team-board/UpcomingTeamSchedule'
import { useTeamBoardOverview } from '@/hooks/team-board/useTeamBoardOverview'
import { useCalendarMonth } from '@/hooks/team-board/useCalendarMonth'
import { useCreateScheduleMutation } from '@/hooks/team-board/useCreateSchedule'
import { useUpdateScheduleMutation } from '@/hooks/team-board/useUpdateSchedule'
import { useDeleteScheduleMutation } from '@/hooks/team-board/useDeleteSchedule'
import { useStartWorkMutation } from '@/hooks/team-board/useStartWork'
import { useStopWorkMutation } from '@/hooks/team-board/useStopWork'
import { useUpdateTeamBoardBasicInfoMutation } from '@/hooks/team-board/useUpdateTeamBoardBasicInfo'
import { getProjectUsers } from '@/api/project-users/projectUsers'
import { useGetProfileQuery } from '@/hooks/auth/useUsersApi'
import type { FieldType } from '@/types/api/team-board/overview'

const TeamBoardPage = () => {
	const { projectId: projectIdParam } = useParams<{ projectId?: string }>()
	const navigate = useNavigate()
	const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
	const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null)

	// 프로젝트 목록 조회 및 projectId 설정
	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await getProjectUsers()
				if (response.body) {
					// URL에 projectId가 없으면 첫 번째 프로젝트로 리다이렉트
					if (!projectIdParam && response.body.length > 0) {
						navigate(`/team-board/${response.body[0].projectId}`, { replace: true })
						return
					}
				}
			} catch (error) {
				console.error('프로젝트 목록 조회 실패:', error)
			}
		}
		fetchProjects()
	}, [projectIdParam, navigate])

	// URL에서 projectId 가져오기
	const projectId = projectIdParam ? parseInt(projectIdParam, 10) : null

	// 현재 캘린더 월/년도 상태
	const today = new Date()
	const [calendarYear, setCalendarYear] = useState(today.getFullYear())
	const [calendarMonth, setCalendarMonth] = useState(today.getMonth() + 1)
	const [selectedDate, setSelectedDate] = useState<number | null>(null)

	// 현재 사용자 프로필 정보
	const { data: profileData } = useGetProfileQuery()
	const currentUserId = profileData?.body?.userId

	// API 호출 (projectId가 있을 때만)
	const { data: overviewResponse, isLoading } = useTeamBoardOverview(projectId, {
		docsLimit: 4,
		postsLimit: 4,
		scheduleLimit: 6,
	})
	const overview = overviewResponse?.body

	// 캘린더 월간 인디케이터 API 호출
	const { data: calendarResponse } = useCalendarMonth(projectId, calendarYear, calendarMonth)
	const calendarData = calendarResponse?.body

	// 일정 생성 mutation (projectId가 있을 때만)
	const createScheduleMutation = useCreateScheduleMutation(projectId || 0)

	// 일정 수정 mutation (projectId가 있을 때만)
	const updateScheduleMutation = useUpdateScheduleMutation(projectId || 0)

	// 일정 삭제 mutation (projectId가 있을 때만)
	const deleteScheduleMutation = useDeleteScheduleMutation(projectId || 0)

	// 작업 시작 mutation (projectId가 있을 때만)
	const startWorkMutation = useStartWorkMutation(projectId || 0)

	// 작업 정지 mutation (projectId가 있을 때만)
	const stopWorkMutation = useStopWorkMutation(projectId || 0)

	// 팀보드 기본 정보 수정 mutation (projectId가 있을 때만)
	const updateBasicInfoMutation = useUpdateTeamBoardBasicInfoMutation(projectId || 0)

	/**
	 * 날짜 포맷 변환: "2026-01-01" -> "2026.01.01"
	 */
	const formatDateForDisplay = (dateString: string): string => {
		return dateString.replace(/-/g, '.')
	}

	/**
	 * ISO 날짜 포맷 변환: "2026-01-31T10:00:00" -> "2026.01.31"
	 */
	const formatISODateForDisplay = (isoDateString: string): string => {
		const date = new Date(isoDateString)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		return `${year}.${month}.${day}`
	}

	/**
	 * 필드 타입에 따른 색상 매핑
	 */
	const getFieldColor = (fieldType: FieldType, index: number): string => {
		const colorMap: Record<FieldType, string> = {
			PM: 'var(--color-roletag-purple)',
			DESIGN: 'var(--color-roletag-pink)',
			FRONTEND: 'var(--color-roletag-green)',
			BACKEND: 'var(--color-roletag-blue)',
			CUSTOM: index % 2 === 0 ? 'var(--color-roletag-yellow)' : 'var(--color-roletag-orange)',
		}
		return colorMap[fieldType] || 'var(--color-roletag-gray)'
	}

	/**
	 * 미션 진행도 데이터를 RadarChart 형식으로 변환
	 */
	const radarChartData = useMemo(() => {
		if (!overview?.mission_progress?.teams || overview.mission_progress.teams.length === 0) {
			return []
		}

		const angleStep = 360 / overview.mission_progress.teams.length

		return overview.mission_progress.teams.map((team, index) => {
			const fieldColor = getFieldColor(team.field.type, index)
			// completed_count를 score로, total_count를 maxScore로 사용
			const score = team.completed_count
			const maxScore = team.total_count

			return {
				label: team.field.custom_name || team.field.type, // 프로필 보드와 동일하게 처리
				score,
				maxScore,
				color: fieldColor,
				roleColor: fieldColor,
				angle: index * angleStep,
			}
		})
	}, [overview])

	/**
	 * 전체 미션 완료 개수 (Total completed count)
	 * API 스펙: total.completed_count
	 */
	const totalCompletedCount = useMemo(() => {
		if (!overview?.mission_progress?.total) return 0
		return overview.mission_progress.total.completed_count
	}, [overview])

	/**
	 * 전체 미션 총 개수 (Total count)
	 * API 스펙: total.total_count
	 */
	const totalCount = useMemo(() => {
		if (!overview?.mission_progress?.total) return 0
		return overview.mission_progress.total.total_count
	}, [overview])

	/**
	 * 게시글 프리뷰 데이터를 ContentListCard 형식으로 변환
	 */
	const bulletinBoardItems = useMemo(() => {
		if (!overview?.posts_preview?.posts || overview.posts_preview.posts.length === 0) {
			return []
		}

		return overview.posts_preview.posts.map((post) => {
			let tag: string | undefined
			if (post.post_type === 'NOTICE') {
				tag = '[공지]'
			} else if (post.post_type === 'REQUIRED') {
				tag = '[필독]'
			}

			return {
				title: post.title,
				date: formatISODateForDisplay(post.created_at),
				tag,
			}
		})
	}, [overview])

	/**
	 * 공유 문서함 프리뷰 데이터를 ContentListCard 형식으로 변환
	 */
	const sharedDocumentItems = useMemo(() => {
		if (!overview?.shared_documents_preview?.documents || overview.shared_documents_preview.documents.length === 0) {
			return []
		}

		return overview.shared_documents_preview.documents.map((document) => ({
			title: document.title,
			date: formatISODateForDisplay(document.created_at),
			fileExt: document.file_ext, // 파일 확장자를 직접 전달
		}))
	}, [overview])

	/**
	 * 시간 포맷 변환: "2026-02-01T10:00:00" -> "10:00"
	 */
	const formatTimeFromISO = (isoDateString: string): string => {
		const date = new Date(isoDateString)
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		return `${hours}:${minutes}`
	}

	/**
	 * 날짜 포맷 변환: ISO -> "12월 16일" 또는 "12월 16일 - 12월 17일"
	 */
	const formatScheduleDateString = (startAt: string, endAt: string, isMultiDay: boolean): string => {
		const startDate = new Date(startAt)
		const endDate = new Date(endAt)

		const startMonth = startDate.getMonth() + 1
		const startDay = startDate.getDate()
		const endMonth = endDate.getMonth() + 1
		const endDay = endDate.getDate()

		if (isMultiDay) {
			return `${startMonth}월 ${startDay}일 - ${endMonth}월 ${endDay}일`
		}
		return `${startMonth}월 ${startDay}일`
	}

	/**
	 * 요일 추출: Date -> "Mon", "Wed" 등
	 */
	const getDayOfWeek = (date: Date): string => {
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
		return days[date.getDay()]
	}

	/**
	 * 다가오는 일정 데이터를 UpcomingTeamSchedule 형식으로 변환
	 */
	const upcomingScheduleItems = useMemo(() => {
		if (!overview?.upcoming_schedules?.items || overview.upcoming_schedules.items.length === 0) {
			return []
		}

		return overview.upcoming_schedules.items.map((schedule) => {
			const startDate = new Date(schedule.start_at)

			let time: string | undefined
			if (!schedule.all_day) {
				const startTime = formatTimeFromISO(schedule.start_at)
				const endTime = formatTimeFromISO(schedule.end_at)
				time = `${startTime} - ${endTime}`
			}

			// 오늘 날짜인지 확인
			const today = new Date()
			const isToday = startDate.getFullYear() === today.getFullYear() &&
				startDate.getMonth() === today.getMonth() &&
				startDate.getDate() === today.getDate()

			// 선택된 날짜와 일치하는지 확인
			const isSelectedDate = selectedDate !== null &&
				startDate.getFullYear() === calendarYear &&
				startDate.getMonth() + 1 === calendarMonth &&
				startDate.getDate() === selectedDate

			return {
				scheduleId: schedule.schedule_id,
				dayOfWeek: getDayOfWeek(startDate),
				date: startDate.getDate(),
				title: schedule.title,
				dateString: formatScheduleDateString(schedule.start_at, schedule.end_at, schedule.is_multi_day),
				time,
				isHighlighted: isToday, // 오늘 날짜면 primary-500 배경
				outlineColor: isSelectedDate ? ('primary-300' as const) : ('neutral-100' as const),
			}
		})
	}, [overview, selectedDate, calendarYear, calendarMonth])

	/**
	 * 작업 시간을 "HH:MM:SS" 형식으로 변환
	 */
	const formatWorkTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const secs = seconds % 60
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
	}

	/**
	 * 팀원 데이터를 TeamProfileBoard 형식으로 변환
	 */
	const teamProfiles = useMemo(() => {
		if (!overview?.members?.members || overview.members.members.length === 0) {
			return []
		}

		// 현재 사용자는 메인 카드(TeamProfileCardMain)로만 보여주기 위해 목록에서는 제외
		const membersForCards = overview.members.members.filter((member) =>
			currentUserId ? member.user_id !== currentUserId : true
		)

		return membersForCards.map((member) => ({
			name: member.nickname || member.name,
			role: member.field.custom_name || member.field.type, // 백엔드 값 그대로 사용
			contact: '',
			time: formatWorkTime(member.today_work_seconds),
			avatarUrl: member.profile_image_url || undefined,
			status: {
				beforeProgress: member.counts.planning,
				inProgress: member.counts.in_progress,
				completed: member.counts.done,
			},
			isWorking: member.is_working || false,
		}))
	}, [overview, currentUserId])

	/**
	 * 메인 프로필 (현재 사용자 또는 리더 또는 첫 번째 팀원)
	 */
	const mainProfile = useMemo(() => {
		if (!overview?.members?.members || overview.members.members.length === 0) {
			return undefined
		}

		// 현재 사용자를 먼저 찾기
		const currentUser = currentUserId 
			? overview.members.members.find((m) => m.user_id === currentUserId)
			: null
		
		// 현재 사용자가 있으면 현재 사용자, 없으면 리더, 그것도 없으면 첫 번째 팀원
		const targetMember = currentUser || 
			overview.members.members.find((m) => m.member_type === 'LEADER') || 
			overview.members.members[0]

		return {
			name: targetMember.nickname || targetMember.name,
			role: targetMember.field.custom_name || targetMember.field.type, // 백엔드 값 그대로 사용
			time: formatWorkTime(targetMember.today_work_seconds),
			avatarUrl: targetMember.profile_image_url || undefined,
			status: {
				beforeProgress: targetMember.counts.planning,
				inProgress: targetMember.counts.in_progress,
				completed: targetMember.counts.done,
			},
			isWorking: targetMember.is_working,
			onStartWork: () => {
				if (targetMember.is_working) {
					// 작업 중이면 정지
					stopWorkMutation.mutate()
				} else {
					// 작업 중이 아니면 시작
					startWorkMutation.mutate()
				}
			},
		}
	}, [overview, currentUserId, startWorkMutation, stopWorkMutation])

	// 헤더 데이터
	const headerData = useMemo(() => {
		if (!overview?.basic_info) {
			return {
				title: '넥트 웹사이트 개발 프로젝트',
				description: '크리에이터를 위한 사이드 프로젝트 매칭 & 협업 플랫폼',
				notice: '이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~',
				regularMeeting: '매주 금요일 PM 8:30 / 강남 사거리역 스타벅스',
				startDate: '2025.11.14',
				endDate: '2026.2.20',
			}
		}

		return {
			title: overview.basic_info.title,
			description: overview.basic_info.description,
			notice: overview.basic_info.notice_text || '공지사항이 없습니다',
			regularMeeting: overview.basic_info.regular_meeting_text || '정기회의가 없습니다',
			startDate: formatDateForDisplay(overview.basic_info.planned_started_on),
			endDate: formatDateForDisplay(overview.basic_info.planned_ended_on),
		}
	}, [overview])

	/**
	 * 캘린더 데이터를 Calendar 컴포넌트 형식으로 변환
	 */
	const calendarDays = useMemo(() => {
		// API 데이터에서 일정이 있는 날짜를 Map으로 변환
		const scheduleDaysMap = new Map<string, number>()
		if (calendarData?.days) {
			calendarData.days.forEach((day) => {
				scheduleDaysMap.set(day.date, day.event_count)
			})
		}

		// 해당 월의 첫 날과 마지막 날 계산
		const firstDayOfMonth = new Date(calendarYear, calendarMonth - 1, 1)
		const lastDayOfMonth = new Date(calendarYear, calendarMonth, 0)
		const daysInMonth = lastDayOfMonth.getDate()
		const startingDayOfWeek = firstDayOfMonth.getDay() // 0 = 일요일, 6 = 토요일

		// 이전 달 마지막 날짜 (이전/다음 달 날짜 채우기용)
		const lastDayOfPrevMonth = new Date(calendarYear, calendarMonth - 1, 0).getDate()

		// 오늘 날짜 확인
		const todayDate = new Date()
		const isCurrentMonth = todayDate.getFullYear() === calendarYear && todayDate.getMonth() + 1 === calendarMonth

		// 7x6 그리드 생성 (최대 6주)
		const daysGrid: Array<Array<{ date: number; isActive: boolean; isToday: boolean; isSelected: boolean; hasTasks: boolean }>> = Array.from({ length: 7 }, () => [])

		let dayCounter = 1
		let nextMonthDayCounter = 1
		for (let week = 0; week < 6; week++) {
			for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
				if (week === 0 && dayOfWeek < startingDayOfWeek) {
					// 이전 달의 날짜를 실제 날짜로 표시 (비활성 스타일 유지)
					const prevMonthDate = lastDayOfPrevMonth - (startingDayOfWeek - dayOfWeek - 1)
					daysGrid[dayOfWeek].push({
						date: prevMonthDate,
						isActive: false,
						isToday: false,
						isSelected: false,
						hasTasks: false,
					})
				} else if (dayCounter > daysInMonth) {
					// 다음 달의 날짜를 실제 날짜로 표시 (비활성 스타일 유지)
					daysGrid[dayOfWeek].push({
						date: nextMonthDayCounter,
						isActive: false,
						isToday: false,
						isSelected: false,
						hasTasks: false,
					})
					nextMonthDayCounter++
				} else {
					// 현재 달의 날짜
					const dateString = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`
					const hasTasks = scheduleDaysMap.has(dateString) && (scheduleDaysMap.get(dateString) || 0) > 0
					const isToday = isCurrentMonth && dayCounter === todayDate.getDate()
					const isSelected = selectedDate === dayCounter && hasTasks

					daysGrid[dayOfWeek].push({
						date: dayCounter,
						isActive: true,
						isToday,
						isSelected,
						hasTasks,
					})
					dayCounter++
				}
			}
			if (dayCounter > daysInMonth) break // 모든 날짜를 채웠으면 종료
		}

		return daysGrid
	}, [calendarData, calendarYear, calendarMonth, selectedDate])

	/**
	 * 이전 달로 이동
	 */
	const handlePreviousMonth = () => {
		setSelectedDate(null) // 월 변경 시 선택 해제
		if (calendarMonth === 1) {
			setCalendarYear(calendarYear - 1)
			setCalendarMonth(12)
		} else {
			setCalendarMonth(calendarMonth - 1)
		}
	}

	/**
	 * 다음 달로 이동
	 */
	const handleNextMonth = () => {
		setSelectedDate(null) // 월 변경 시 선택 해제
		if (calendarMonth === 12) {
			setCalendarYear(calendarYear + 1)
			setCalendarMonth(1)
		} else {
			setCalendarMonth(calendarMonth + 1)
		}
	}

	/**
	 * 날짜 클릭 핸들러 (일정이 있는 날짜만 선택)
	 */
	const handleDayClick = (date: number) => {
		// 해당 날짜에 일정이 있는지 확인
		const dateString = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(date).padStart(2, '0')}`
		const hasTasks = calendarData?.days?.some((day) => day.date === dateString && day.event_count > 0) || false

		if (hasTasks) {
			// 이미 선택된 날짜를 다시 클릭하면 선택 해제, 아니면 선택
			setSelectedDate(selectedDate === date ? null : date)
		}
	}

	return (
		<div className="flex flex-col w-full max-w-main mx-auto px-[72px] py-16 gap-7">
			{/* 상단 헤더 영역 (1224x180) */}
			<div className="w-[1224px] h-[180px]">
				{isLoading ? (
					<div className="flex items-center justify-center h-full">로딩 중...</div>
				) : (
					<TeamBoardHeader
						title={headerData.title}
						description={headerData.description}
						notice={headerData.notice}
						regularMeeting={headerData.regularMeeting}
						startDate={headerData.startDate}
						endDate={headerData.endDate}
						onUpdateBasicInfo={
							projectId && overview?.basic_info?.can_edit
								? (payload) => {
										updateBasicInfoMutation.mutate(payload)
									}
								: undefined
						}
					/>
				)}
			</div>

			{/* 헤더/메인 구분선 */}
			<div className="w-[1224px] border-b border-neutral-200" />

			{/* 메인 콘텐츠 영역 (1224x990) */}
			<div className="flex items-start justify-between w-[1224px]">
				{/* 왼쪽 영역 (808x990) */}
				<div className="flex flex-col gap-4 w-[808px]">
					{/* 상단: RadarChartCard + ContentListCard 두 개 (808x448) */}
					<div className="flex gap-6 h-[448px]">
						{/* RadarChartCard (392x448) */}
						<RadarChartCard
							title="팀 미션 진행 현황"
							totalScore={totalCompletedCount}
							maxScore={totalCount}
							data={radarChartData}
						/>
						{/* ContentListCard 두 개 (세로 배치, 392x216 각각) */}
						<div className="flex flex-col gap-4">
							<ContentListCard type="게시판" items={bulletinBoardItems} />
							<ContentListCard type="공유 문서함" items={sharedDocumentItems} />
						</div>
					</div>

					{/* 하단: TeamProfileBoard (808x518) */}
					<div className="h-[518px]">
						<TeamProfileBoard
							mainProfile={mainProfile}
							profiles={teamProfiles}
						/>
					</div>
				</div>

				{/* 오른쪽 영역 (392x990) */}
				<div className="flex flex-col gap-4 w-[392px]">
					{/* 상단: Calendar + AddScheduleButton (392x448) */}
					<div className="flex flex-col gap-4 h-[448px] relative">
						<Calendar
							year={calendarYear}
							month={calendarMonth}
							days={calendarDays}
							onPreviousMonth={handlePreviousMonth}
							onNextMonth={handleNextMonth}
							onDayClick={handleDayClick}
						/>
						<div className="relative">
							<AddScheduleButton onClick={() => {
								setEditingScheduleId(null)
								setIsScheduleModalOpen(true)
							}} />
							<AddScheduleModal
								isOpen={isScheduleModalOpen}
								onClose={() => {
									setIsScheduleModalOpen(false)
									setEditingScheduleId(null)
								}}
								initialTitle={editingScheduleId ? overview?.upcoming_schedules?.items.find(s => s.schedule_id === editingScheduleId)?.title : undefined}
								initialStartDate={editingScheduleId ? overview?.upcoming_schedules?.items.find(s => s.schedule_id === editingScheduleId)?.start_at : undefined}
								initialEndDate={editingScheduleId ? overview?.upcoming_schedules?.items.find(s => s.schedule_id === editingScheduleId)?.end_at : undefined}
								initialAllDay={editingScheduleId ? overview?.upcoming_schedules?.items.find(s => s.schedule_id === editingScheduleId)?.all_day : undefined}
								onSave={(title, startDate, endDate, time) => {
									// 날짜 파싱: "2026년 02월 01일" -> Date 객체
									const parseDateString = (dateStr: string): Date => {
										const numbers = dateStr.replace(/[^0-9]/g, '')
										if (numbers.length !== 8) {
											throw new Error('Invalid date format')
										}
										const year = parseInt(numbers.slice(0, 4), 10)
										const month = parseInt(numbers.slice(4, 6), 10)
										const day = parseInt(numbers.slice(6, 8), 10)
										return new Date(year, month - 1, day)
									}

									try {
										const startDateObj = parseDateString(startDate)
										const endDateObj = endDate ? parseDateString(endDate) : startDateObj

										// 시간 파싱: "15:00 - 17:00" 또는 "15:00-17:00" 형식 지원
										let allDay = true
										let startHour = 0
										let startMinute = 0
										let endHour = 23
										let endMinute = 59

										if (time && time.trim()) {
											// 더 유연한 정규식: 공백과 하이픈 형식 다양하게 지원
											const timeMatch = time.trim().match(/^(\d{1,2}):(\d{1,2})\s*[-~]\s*(\d{1,2}):(\d{1,2})$/)
											if (timeMatch) {
												allDay = false
												startHour = parseInt(timeMatch[1], 10)
												startMinute = parseInt(timeMatch[2], 10)
												endHour = parseInt(timeMatch[3], 10)
												endMinute = parseInt(timeMatch[4], 10)

												// 시간 유효성 검사
												if (startHour < 0 || startHour > 23 || startMinute < 0 || startMinute > 59 ||
													endHour < 0 || endHour > 23 || endMinute < 0 || endMinute > 59) {
													throw new Error('Invalid time format')
												}
											} else {
												// 시간 형식이 맞지 않으면 allDay로 처리
												console.warn('시간 형식이 올바르지 않습니다:', time)
											}
										}

										// ISO 형식으로 변환 (입력한 시간 그대로, 시간대 변환 없이)
										const formatToISO = (year: number, month: number, day: number, hour: number, minute: number): string => {
											const yearStr = String(year).padStart(4, '0')
											const monthStr = String(month + 1).padStart(2, '0')
											const dayStr = String(day).padStart(2, '0')
											const hourStr = String(hour).padStart(2, '0')
											const minuteStr = String(minute).padStart(2, '0')
											return `${yearStr}-${monthStr}-${dayStr}T${hourStr}:${minuteStr}:00`
										}

										const startAt = formatToISO(
											startDateObj.getFullYear(),
											startDateObj.getMonth(),
											startDateObj.getDate(),
											startHour,
											startMinute,
										)

										const endAt = formatToISO(
											endDateObj.getFullYear(),
											endDateObj.getMonth(),
											endDateObj.getDate(),
											endHour,
											endMinute,
										)

										// 수정 모드인지 확인
										if (editingScheduleId) {
											// 일정 수정 API 호출
											updateScheduleMutation.mutate({
												scheduleId: editingScheduleId,
												scheduleData: {
													title,
													description: '', // description 필수이므로 빈 문자열로 전송
													start_at: startAt,
													end_at: endAt,
													all_day: allDay,
												},
											})
										} else {
											// 일정 생성 API 호출
											createScheduleMutation.mutate({
												title,
												description: '', // description 필수이므로 빈 문자열로 전송
												start_at: startAt,
												end_at: endAt,
												all_day: allDay,
											})
										}

										// 성공 시 모달 닫기
										setIsScheduleModalOpen(false)
										setEditingScheduleId(null)
									} catch (error) {
										console.error('일정 생성 실패:', error)
										// TODO: 에러 처리 (토스트 메시지 등)
									}
								}}
							/>
						</div>
					</div>

					{/* 하단: UpcomingTeamSchedule (392x518) */}
					<div className="h-[518px]">
						<UpcomingTeamSchedule
							items={upcomingScheduleItems}
							onEdit={(scheduleId) => {
								setEditingScheduleId(scheduleId)
								setIsScheduleModalOpen(true)
							}}
							onDelete={(scheduleId) => {
								deleteScheduleMutation.mutate(scheduleId)
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TeamBoardPage
