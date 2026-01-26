import { useState } from 'react'

import Button from '@/components/common/Button'
import GoalIcon from '@/assets/icons/week-mission/goal.svg?react'
import RefreshIcon from '@/assets/icons/mypage/refresh.svg?react'
import CheckboxIcon from '@/assets/icons/common/checkbox.svg?react'

interface Achievement {
	id: number
	title: string
	content: string
}

interface Career {
	id: number
	projectName: string
	startDate: string
	endDate: string
	isInProgress: boolean
	industry: string
	role: string
	achievements: Achievement[]
}

const CareerHistorySection = () => {
	// 경력 목록 상태 (배열로 관리)
	const [careers, setCareers] = useState<Career[]>([
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

	// 기간 계산 함수
	const getDuration = (start: string, end: string, isInProgress: boolean) => {
		if (isInProgress) return '(재직중)'

		const regex = /^\d{4}\.\d{2}$/
		if (!regex.test(start) || !regex.test(end)) return '(0년 0개월)'

		const [sY, sM] = start.split('.').map(Number)
		const [eY, eM] = end.split('.').map(Number)
		const totalMonths = eY * 12 + eM - (sY * 12 + sM)

		if (totalMonths < 0) return '(유효하지 않은 날짜)'
		return `(${Math.floor(totalMonths / 12)}년 ${totalMonths % 12}개월)`
	}

	// 경력 추가
	const addCareer = () => {
		const newId = Math.max(...careers.map(c => c.id)) + 1
		setCareers(prev => [
			...prev,
			{
				id: newId,
				projectName: '',
				startDate: '',
				endDate: '',
				isInProgress: false,
				industry: '',
				role: '',
				achievements: [{ id: 1, title: '', content: '' }],
			},
		])
	}

	// 경력 필드 업데이트
	const updateCareer = (careerId: number, field: keyof Omit<Career, 'id' | 'achievements'>, value: string | boolean) => {
		setCareers(prev => prev.map(c => (c.id === careerId ? { ...c, [field]: value } : c)))
	}

	// 주요 성과 추가
	const addAchievement = (careerId: number) => {
		setCareers(prev =>
			prev.map(c => {
				if (c.id === careerId) {
					const newAchievementId = Math.max(...c.achievements.map(a => a.id)) + 1
					return {
						...c,
						achievements: [...c.achievements, { id: newAchievementId, title: '', content: '' }],
					}
				}
				return c
			})
		)
	}

	// 주요 성과 필드 업데이트
	const updateAchievement = (careerId: number, achievementId: number, field: 'title' | 'content', value: string) => {
		setCareers(prev =>
			prev.map(c => {
				if (c.id === careerId) {
					return {
						...c,
						achievements: c.achievements.map(a => (a.id === achievementId ? { ...a, [field]: value } : a)),
					}
				}
				return c
			})
		)
	}

	// 불렛 리스트 핸들러
	const handleAchievementFocus = (careerId: number, achievementId: number) => {
		const career = careers.find(c => c.id === careerId)
		const achievement = career?.achievements.find(a => a.id === achievementId)
		if (achievement && !achievement.content) {
			updateAchievement(careerId, achievementId, 'content', '• ')
		}
	}

	const handleAchievementKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, careerId: number, achievementId: number) => {
		if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
			e.preventDefault()
			const career = careers.find(c => c.id === careerId)
			const achievement = career?.achievements.find(a => a.id === achievementId)
			if (achievement) {
				updateAchievement(careerId, achievementId, 'content', achievement.content + '\n• ')
			}
		}
	}

	// 불렛만 있는지 확인
	const hasActualContent = (text: string) => {
		const withoutBullets = text.replace(/•/g, '').replace(/\s/g, '')
		return withoutBullets.length > 0
	}

	return (
		<section className='my-2.5 ml-5'>
			{/* 타이틀바 */}
			<div className='flex items-center justify-between mb-4'>
				<h2 className='title-2 font-bold text-neutral-900'>
					주요 경력/이력 <span className='text-danger-700'>*</span>
				</h2>

				{/* 버튼 2개 */}
				<div className='flex items-center'>
					<Button color='text' size='sm' onClick={addCareer}>
						+ 경력/이력 추가
					</Button>
					<Button color='text' size='sm'>
						<RefreshIcon className='w-4 h-4 mr-1' />
						불러오기
					</Button>
				</div>
			</div>

			{/* 경력 입력 컨테이너 */}
			<section className='w-full'>
				{careers.map(career => (
					<div key={career.id} className='mb-8'>
						{/* 경력 입력 섹션 */}
						<div className='flex gap-4 hover:bg-neutral-50 focus:bg-neutral-50 rounded-12 p-5 duration-200 ease-in-out'>
							{/* 아이콘 */}
							<GoalIcon className='w-10 h-10 bg-primary-400-normal p-2.5 rounded-12' />

							<div className='flex-1 my-1'>
								{/* 프로젝트 및 회사 산업군 */}
								<div className='flex items-start mb-1'>
									<textarea
										rows={1}
										className='w-full title-3 font-semibold resize-none focus:outline-none placeholder:text-neutral-300 bg-transparent'
										placeholder='프로젝트 및 회사 산업군'
										value={career.projectName}
										onChange={e => updateCareer(career.id, 'projectName', e.target.value)}
									/>
								</div>

								{/* 날짜 / 진행중 / 분야 / 역할 */}
								<div className='flex items-center flex-wrap body-1 text-neutral-400'>
									{/* 날짜 입력 그룹 */}
									<div className='flex items-center'>
										<textarea
											rows={1}
											className='w-18.25 bg-transparent resize-none text-neutral-900 focus:outline-none placeholder:text-neutral-300 overflow-hidden whitespace-nowrap text-center'
											placeholder='YYYY.MM'
											value={career.startDate}
											onChange={e => updateCareer(career.id, 'startDate', e.target.value)}
											maxLength={7}
										/>
										<span>~</span>
										<textarea
											rows={1}
											className='w-18.25 bg-transparent resize-none focus:outline-none placeholder:text-neutral-300 text-neutral-900 overflow-hidden whitespace-nowrap text-center disabled:text-neutral-300'
											placeholder='YYYY.MM'
											value={career.isInProgress ? '' : career.endDate}
											onChange={e => updateCareer(career.id, 'endDate', e.target.value)}
											maxLength={7}
											disabled={career.isInProgress}
										/>

										{/* 기간 계산 결과 */}
										<span className='whitespace-nowrap'>
											{getDuration(career.startDate, career.endDate, career.isInProgress)}
										</span>
									</div>

									{/* 진행중 체크박스 */}
									<button
										type='button'
										onClick={() => updateCareer(career.id, 'isInProgress', !career.isInProgress)}
										className={`flex items-center cursor-pointer ml-4 select-none transition-colors whitespace-nowrap ${
											career.isInProgress ? 'text-primary-500-normal' : 'hover:text-neutral-600'
										}`}
									>
										<CheckboxIcon
											className={`w-4 h-4 mr-1.5 transition-colors ${career.isInProgress ? 'text-primary-500-normal' : 'text-neutral-400'}`}
										/>
										<span>진행중</span>
									</button>

									{/* 구분선 */}
									<span className='mx-3 text-neutral-300 font-semibold'>|</span>

									{/* 분야 (산업체) */}
									<div className='flex items-center'>
										<textarea
											rows={1}
											className='min-w-23.25 bg-transparent resize-none focus:outline-none placeholder:text-neutral-300 text-neutral-900 overflow-hidden whitespace-nowrap'
											placeholder='분야 (산업체)'
											value={career.industry}
											onChange={e => updateCareer(career.id, 'industry', e.target.value)}
											style={{ width: `${Math.max(93, career.industry.length * 16)}px` }}
										/>
									</div>

									{/* 구분선 */}
									<span className='mx-3 text-neutral-300 font-semibold'>|</span>

									{/* 역할 (직무) */}
									<div className='flex items-center'>
										<textarea
											rows={1}
											className='min-w-18.25 bg-transparent resize-none focus:outline-none placeholder:text-neutral-300 text-neutral-900 overflow-hidden whitespace-nowrap'
											placeholder='역할 (직무)'
											value={career.role}
											onChange={e => updateCareer(career.id, 'role', e.target.value)}
											style={{ width: `${Math.max(73, career.role.length * 16)}px` }}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* 주요 성과  섹션*/}
						<div className='ml-15'>
							{career.achievements.map(achievement => (
								<div
									key={achievement.id}
									className='rounded-12 hover:bg-neutral-50 duration-200 ease-in-out p-5 mb-2'
								>
									<textarea
										rows={1}
										className='w-full body-1 font-semibold resize-none focus:outline-none placeholder:text-neutral-300 bg-transparent mb-1.5'
										placeholder='주요 성과'
										value={achievement.title}
										onChange={e => updateAchievement(career.id, achievement.id, 'title', e.target.value)}
									/>

									<textarea
										className={`w-full body-1 leading-[180%] tracking-[-0.5px] resize-none focus:outline-none placeholder:text-[16px] placeholder:text-neutral-300 bg-transparent ${
											hasActualContent(achievement.content) ? 'text-neutral-900' : 'text-neutral-300'
										}`}
										placeholder={`업무 경헙을 성과 기반으로 작성해 보세요.\n나의 역할과 기여도, 사용 기술을 포함하는 것을 권장 합니다.`}
										value={achievement.content}
										onFocus={() => handleAchievementFocus(career.id, achievement.id)}
										onChange={e => updateAchievement(career.id, achievement.id, 'content', e.target.value)}
										onKeyDown={e => handleAchievementKeyDown(e, career.id, achievement.id)}
									/>
								</div>
							))}

							<Button
								color='text'
								size='sm'
								className='text-neutral-400 hover:text-neutral-600 p-0 ml-5'
								onClick={() => addAchievement(career.id)}
							>
								+ 주요 성과 추가
							</Button>
						</div>
					</div>
				))}
			</section>
		</section>
	)
}

export default CareerHistorySection
