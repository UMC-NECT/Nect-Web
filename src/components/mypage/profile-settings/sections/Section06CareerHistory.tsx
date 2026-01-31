import { useFieldArray, Controller, type Control, type UseFormSetValue, type UseFormWatch } from 'react-hook-form'
import Button from '@/components/common/Button'
import GoalIcon from '@/assets/icons/week-mission/goal.svg?react'
import CheckboxIcon from '@/assets/icons/common/checkbox.svg?react'
import type { ProfileFormDataType } from '@/utils/schemas/profileSchema'

interface ISection06CareerHistory {
	control: Control<ProfileFormDataType>
	setValue: UseFormSetValue<ProfileFormDataType>
	watch: UseFormWatch<ProfileFormDataType>
}

const Section06CareerHistory = ({ control, setValue, watch }: ISection06CareerHistory) => {
	const { fields: careers, append: appendCareer } = useFieldArray({
		control,
		name: 'careers',
	})
	// 기간 계산 함수
	const getDuration = (start: string, end: string, isInProgress: boolean) => {
		// 진행중이면 현재 날짜를 종료일로 사용
		const effectiveEnd = isInProgress ? '2026.02' : end

		const regex = /^\d{4}\.\d{2}$/
		if (!regex.test(start) || !regex.test(effectiveEnd)) return '(0년 0개월)'

		const [sY, sM] = start.split('.').map(Number)
		const [eY, eM] = effectiveEnd.split('.').map(Number)
		const totalMonths = eY * 12 + eM - (sY * 12 + sM)

		if (totalMonths < 0) return '(유효하지 않은 날짜)'
		const years = Math.floor(totalMonths / 12)
		const months = totalMonths % 12
		return `(${years}년 ${months}개월)`
	}

	// 경력 추가
	const addCareer = () => {
		appendCareer({
			id: Date.now(),
			projectName: '',
			startDate: '',
			endDate: '',
			isInProgress: false,
			industry: '',
			role: '',
			achievements: [{ id: 1, title: '', content: '' }],
		})
	}

	// 주요 성과 추가
	const addAchievement = (careerIndex: number) => {
		const currentAchievements = watch(`careers.${careerIndex}.achievements`)
		const newAchievementId = Math.max(...currentAchievements.map(a => a.id), 0) + 1
		setValue(`careers.${careerIndex}.achievements`, [
			...currentAchievements,
			{ id: newAchievementId, title: '', content: '' },
		])
	}

	// 불렛 리스트 핸들러
	const handleAchievementFocus = (careerIndex: number, achievementIndex: number) => {
		const content = watch(`careers.${careerIndex}.achievements.${achievementIndex}.content`)
		if (!content) {
			setValue(`careers.${careerIndex}.achievements.${achievementIndex}.content`, '• ')
		}
	}

	const handleAchievementKeyDown = (
		e: React.KeyboardEvent<HTMLTextAreaElement>,
		careerIndex: number,
		achievementIndex: number
	) => {
		if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
			e.preventDefault()
			const content = watch(`careers.${careerIndex}.achievements.${achievementIndex}.content`)
			setValue(`careers.${careerIndex}.achievements.${achievementIndex}.content`, content + '\n• ')
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

				<Button color='text' size='sm' onClick={addCareer}>
					+ 경력/이력 추가
				</Button>
			</div>

			{/* 경력 입력 컨테이너 */}
			<section className='w-full'>
				{careers.map((career, careerIndex) => (
					<div key={career.id} className='mb-8'>
						{/* 경력 입력 섹션 */}
						<div className='flex gap-4 hover:bg-neutral-50 focus:bg-neutral-50 rounded-12 p-5 duration-200 ease-in-out'>
							{/* 목표 아이콘 */}
							<GoalIcon className='w-10 h-10 bg-primary-400-normal p-2.5 rounded-12' stroke='#FBF9FF' />

							<div className='flex-1 my-1'>
								{/* 프로젝트 및 회사 산업군 */}
								<div className='flex items-start mb-1'>
									<Controller
										name={`careers.${careerIndex}.projectName`}
										control={control}
										render={({ field }) => (
											<input
												{...field}
												className='w-full title-3 font-semibold resize-none focus:outline-none placeholder:text-neutral-300 bg-transparent'
												placeholder='프로젝트 및 회사 산업군'
											/>
										)}
									/>
								</div>

								{/* 날짜 / 진행중 / 분야 / 역할 */}
								<div className='flex items-center flex-wrap body-1 text-neutral-400'>
									{/* 날짜 입력 그룹 */}
									<div className='flex items-center'>
										<Controller
											name={`careers.${careerIndex}.startDate`}
											control={control}
											render={({ field }) => (
												<textarea
													{...field}
													rows={1}
													className='w-18.25 bg-transparent resize-none text-neutral-900 focus:outline-none placeholder:text-neutral-300 overflow-hidden whitespace-nowrap text-center'
													placeholder='YYYY.MM'
													maxLength={7}
												/>
											)}
										/>
										<span>~</span>
										<Controller
											name={`careers.${careerIndex}.endDate`}
											control={control}
											render={({ field }) => {
												const isInProgress = watch(`careers.${careerIndex}.isInProgress`)
												return (
													<textarea
														{...field}
														rows={1}
														className='w-18.25 bg-transparent resize-none focus:outline-none placeholder:text-neutral-300 text-neutral-900 overflow-hidden whitespace-nowrap text-center disabled:text-neutral-300'
														placeholder='YYYY.MM'
														value={isInProgress ? '2026.02' : field.value}
														maxLength={7}
														disabled={isInProgress}
													/>
												)
											}}
										/>

										{/* 기간 계산 결과 */}
										<span className='whitespace-nowrap'>
											{getDuration(
												watch(`careers.${careerIndex}.startDate`),
												watch(`careers.${careerIndex}.endDate`),
												watch(`careers.${careerIndex}.isInProgress`)
											)}
										</span>
									</div>

									{/* 진행중 체크박스 */}
									<Controller
										name={`careers.${careerIndex}.isInProgress`}
										control={control}
										render={({ field }) => (
											<button
												type='button'
												onClick={() => {
													field.onChange(!field.value)
													if (!field.value) {
														setValue(`careers.${careerIndex}.endDate`, '2026.02')
													}
												}}
												className={`flex items-center cursor-pointer ml-4 select-none transition-colors whitespace-nowrap ${
													field.value ? 'text-primary-500-normal' : 'hover:text-neutral-600'
												}`}
											>
												<CheckboxIcon
													className={`w-4 h-4 mr-1.5 transition-colors ${field.value ? 'text-primary-500-normal' : 'text-neutral-400'}`}
												/>
												<span>진행중</span>
											</button>
										)}
									/>

									{/* 구분선 */}
									<span className='mx-3 text-neutral-300 font-semibold'>|</span>

									{/* 분야 (산업체) */}
									<div className='flex items-center'>
										<Controller
											name={`careers.${careerIndex}.industry`}
											control={control}
											render={({ field }) => (
												<input
													{...field}
													className='min-w-23.25 bg-transparent resize-none focus:outline-none placeholder:text-neutral-300 text-neutral-900 overflow-hidden whitespace-nowrap'
													placeholder='분야 (산업체)'
													style={{ width: `${Math.max(93, field.value.length * 16)}px` }}
												/>
											)}
										/>
									</div>

									{/* 구분선 */}
									<span className='mx-3 text-neutral-300 font-semibold'>|</span>

									{/* 역할 (직무) */}
									<div className='flex items-center'>
										<Controller
											name={`careers.${careerIndex}.role`}
											control={control}
											render={({ field }) => (
												<input
													{...field}
													className='min-w-18.25 bg-transparent resize-none focus:outline-none placeholder:text-neutral-300 text-neutral-900 overflow-hidden whitespace-nowrap'
													placeholder='역할 (직무)'
												/>
											)}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* 주요 성과 섹션 */}
						<div className='ml-15'>
							{watch(`careers.${careerIndex}.achievements`)?.map((achievement, achievementIndex) => (
								<div
									key={achievement.id}
									className='rounded-12 hover:bg-neutral-50 duration-200 ease-in-out p-5 mb-2'
								>
									<Controller
										name={`careers.${careerIndex}.achievements.${achievementIndex}.title`}
										control={control}
										render={({ field }) => (
											<input
												{...field}
												className='w-full body-1 font-semibold resize-none focus:outline-none placeholder:text-neutral-300 bg-transparent mb-1.5'
												placeholder='주요 성과'
											/>
										)}
									/>

									<Controller
										name={`careers.${careerIndex}.achievements.${achievementIndex}.content`}
										control={control}
										render={({ field }) => (
											<textarea
												{...field}
												className={`w-full body-1 leading-[180%] tracking-[-0.5px] resize-none focus:outline-none placeholder:text-[16px] placeholder:text-neutral-300 bg-transparent overflow-hidden ${
													hasActualContent(field.value) ? 'text-neutral-900' : 'text-neutral-300'
												}`}
												placeholder={`업무 경헙을 성과 기반으로 작성해 보세요.\n나의 역할과 기여도, 사용 기술을 포함하는 것을 권장 합니다.`}
												onFocus={() => handleAchievementFocus(careerIndex, achievementIndex)}
												onChange={e => {
													field.onChange(e)
													e.target.style.height = 'auto'
													e.target.style.height = `${e.target.scrollHeight}px`
												}}
												onKeyDown={e => handleAchievementKeyDown(e, careerIndex, achievementIndex)}
												onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
													const target = e.currentTarget
													target.style.height = 'auto'
													target.style.height = `${target.scrollHeight}px`
												}}
											/>
										)}
									/>
								</div>
							))}

							<Button
								color='text'
								size='sm'
								className='text-neutral-400 hover:text-neutral-600 p-0 ml-5'
								onClick={() => addAchievement(careerIndex)}
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

export default Section06CareerHistory
