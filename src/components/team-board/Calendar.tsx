import ChevronLeftIcon from '@/assets/icons/common/chevron-left.svg?react'
import ChevronRightIcon from '@/assets/icons/common/chevron-right.svg?react'

interface CalendarDay {
	date: number
	isActive: boolean // 현재 달인지
	isToday: boolean
	isSelected: boolean
	hasTasks: boolean
	isSunday?: boolean
	isSaturday?: boolean
}

interface CalendarProps {
	year: number
	month: number
	days: CalendarDay[][]
	onPreviousMonth?: () => void
	onNextMonth?: () => void
	onDayClick?: (date: number) => void
	className?: string
}

const Calendar = ({
	year,
	month,
	days,
	onPreviousMonth,
	onNextMonth,
	onDayClick,
	className = '',
}: CalendarProps) => {
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]

	const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

	return (
		<div className={`w-[392px] h-[374px] px-5 py-6 bg-neutral-000 rounded-xl outline-1 -outline-offset-1 outline-neutral-100 inline-flex flex-col justify-start items-end gap-6 ${className}`}>
			{/* 헤더: 월/년도 + 네비게이션 */}
			<div className="self-stretch h-7 pl-1.5 inline-flex justify-between items-center">
				<div className="flex justify-start items-center gap-2.5">
					<div className="justify-start text-neutral-900 heading-3 font-bold">{monthNames[month - 1]}</div>
					<div className="justify-start text-neutral-900 heading-3 font-bold">{year}</div>
				</div>
				<div className="flex justify-start items-center gap-2">
					{/* 이전 달 버튼 */}
					<button
						onClick={onPreviousMonth}
						className="relative w-7 h-7 p-1 rounded-lg flex justify-center items-center"
					>
						<ChevronLeftIcon className="w-4 h-4 text-neutral-700" />
					</button>
					{/* 다음 달 버튼 */}
					<button
						onClick={onNextMonth}
						className="relative w-7 h-7 p-1 rounded-lg flex justify-center items-center"
					>
						<ChevronRightIcon className="w-4 h-4 text-neutral-700" />
					</button>
				</div>
			</div>

			{/* 캘린더 그리드 */}
			<div className="self-stretch h-64 inline-flex justify-between items-center">
				{days.map((week, weekIndex) => (
					<div key={weekIndex} className="w-9 self-stretch inline-flex flex-col justify-between items-center">
						{/* 요일 레이블 */}
						<div
							className={`w-9 h-6 text-center justify-start title-3 font-medium ${
								weekIndex === 0
									? 'text-danger-600'
									: weekIndex === 6
										? 'text-status-complete'
										: 'text-neutral-400'
							}`}
						>
							{dayLabels[weekIndex]}
						</div>
						{/* 날짜 셀들 */}
						<div className="flex flex-col justify-start items-start gap-3 title-3 font-medium">
							{week.map((day, dayIndex) => {
								const bgColor = day.isToday
									? 'bg-primary-500-normal'
									: day.isSelected
										? 'bg-primary-300-light'
										: ''
								const textColor = day.isToday
									? 'text-neutral-000'
									: !day.isActive
										? 'text-neutral-200'
										: day.isSelected
											? 'text-neutral-000'
											: 'text-neutral-900'
								const dotColor = (day.isToday || day.isSelected) && day.hasTasks
									? 'bg-neutral-000'
									: day.hasTasks
										? 'bg-primary-500-normal'
										: 'bg-neutral-200'

								return (
									<button
										key={dayIndex}
										onClick={() => onDayClick?.(day.date)}
										className={`w-9 h-9 relative ${bgColor} rounded-100 flex flex-col justify-center items-center`}
									>
										<div className="inline-flex justify-center items-center">
											<div className={`text-right justify-start ${textColor} title-3 font-medium`}>
												{day.date}
											</div>
										</div>
										{day.hasTasks && (
											<div className={`w-1 h-1 absolute bottom-1 left-1/2 -translate-x-1/2 ${dotColor} rounded-full`} />
										)}
									</button>
								)
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Calendar
