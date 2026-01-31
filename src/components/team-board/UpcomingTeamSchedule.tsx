import ChevronRightIcon from '@/assets/icons/common/chevron-right.svg?react'

interface UpcomingTeamScheduleItem {
	dayOfWeek: string // "Fri", "Wed", "Mon" 등
	date: number // 12, 17, 19 등
	title: string
	dateString: string // "12월 12일", "12월 17일" 등
	time?: string // "15:00 - 17:00" 등
	isHighlighted?: boolean // primary-500 배경 (기본은 primary-300)
	outlineColor?: 'primary-300' | 'neutral-100' // outline 색상
}

interface UpcomingTeamScheduleProps {
	items: UpcomingTeamScheduleItem[]
	className?: string
}

const UpcomingTeamSchedule = ({ items, className = '' }: UpcomingTeamScheduleProps) => {
	return (
		<div
			className={`w-[392px] h-[518px] px-5 pt-5 pb-3.5 bg-neutral-000 rounded-xl outline-1 -outline-offset-1 outline-neutral-100 inline-flex justify-center items-start gap-2.5 ${className}`}
		>
			<div className="self-stretch inline-flex flex-col justify-start items-start gap-4">
				{/* 헤더 */}
				<div className="self-stretch inline-flex justify-start items-center gap-2">
					<div className="justify-start text-neutral-900 title-2 font-bold">다가오는 팀 일정</div>
					<div className="w-4 h-4 flex justify-center items-center gap-2.5">
						<ChevronRightIcon className="w-4 h-4 text-neutral-700" />
					</div>
				</div>

				{/* 일정 리스트 */}
				<div className="self-stretch flex flex-col justify-start items-start gap-2">
					{items.map((item, index) => {
						const bgColor = item.isHighlighted ? 'bg-primary-500-normal' : 'bg-primary-300-light'
						const outlineColor =
							item.outlineColor === 'primary-300' ? 'outline-primary-300-light' : 'outline-neutral-100'
						const isLast = index === items.length - 1

						return (
							<div
								key={index}
								className={`${isLast ? '' : 'self-stretch'} rounded-xl inline-flex justify-start items-center overflow-hidden`}
							>
								{/* 날짜 박스 */}
								<div className={`w-[54px] h-[60px] ${bgColor} flex justify-center items-center`}>
									<div className="w-7 inline-flex flex-col justify-start items-center">
										<div className="self-stretch h-4 text-center justify-start text-neutral-000 body-2 font-medium">
											{item.dayOfWeek}
										</div>
										<div className="self-stretch h-5 text-center justify-start text-neutral-000 title-3 font-semibold">
											{item.date}
										</div>
									</div>
								</div>

								{/* 일정 정보 */}
								<div
									className={`w-[298px] h-[60px] pl-4 pr-3 py-2 bg-neutral-50 rounded-tr-xl rounded-br-xl outline-1 -outline-offset-1 ${outlineColor} inline-flex flex-col justify-start items-start gap-2.5`}
								>
									<div className="self-stretch inline-flex justify-between items-end">
										<div className="w-44 inline-flex flex-col justify-start items-start">
											<div className="self-stretch justify-center text-neutral-800 body-1 font-semibold line-clamp-1">
												{item.title}
											</div>
											<div className="self-stretch justify-center text-neutral-600 caption-1 font-medium">
												{item.dateString}
											</div>
										</div>
										{item.time && (
											<div className="opacity-80 text-right justify-start text-neutral-400 body-2 font-regular">
												{item.time}
											</div>
										)}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default UpcomingTeamSchedule
