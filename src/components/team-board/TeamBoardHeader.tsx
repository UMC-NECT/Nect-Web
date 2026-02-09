import { calculateDDay } from '@/utils/dateUtils'

interface TeamBoardHeaderProps {
	title: string
	description: string
	notice?: string
	regularMeeting?: string
	startDate: string
	endDate: string
}

const TeamBoardHeader = ({
	title,
	description,
	notice = '이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~',
	regularMeeting = '매주 금요일 PM 8:30  /  강남 사거리역 스타벅스',
	startDate,
	endDate,
}: TeamBoardHeaderProps) => {
	const dDay = calculateDDay(endDate)

	// 공지사항 및 정기회의 정보 배열
	const infoItems = [
		{
			label: '공지사항',
			content: notice || '공지사항이 없습니다',
			textColor: 'text-primary-600-normal',
			contentClassName: 'justify-center',
		},
		{
			label: '정기회의',
			content: regularMeeting || '정기회의가 없습니다',
			textColor: 'text-neutral-900',
			contentClassName: 'flex-1 justify-center',
		},
	]

	return (
		<div className='self-stretch w-[1224px] inline-flex justify-between items-start'>
			{/* 왼쪽 영역: 프로젝트 정보 및 공지사항 */}
			<div className='w-[808px] inline-flex flex-col justify-start items-start gap-8'>
				{/* 프로젝트 제목 및 설명 */}
				<div className='self-stretch flex flex-col justify-start items-start gap-2'>
					<div className='self-stretch justify-start text-neutral-900 heading-2 font-bold line-clamp-1'>{title}</div>
					<div className='self-stretch justify-start text-[#5f5f5f] title-3 font-medium line-clamp-1'>{description}</div>
				</div>
				{/* 공지사항 및 정기회의 정보 */}
				<div className='self-stretch flex flex-col justify-start items-center gap-3'>
					{infoItems.map((item, index) => (
						<div key={index} className='self-stretch inline-flex justify-start items-center gap-4'>
							<div className='w-28 px-3 py-1 bg-[#f0e7fb]/70 rounded-md outline-1 -outline-offset-1 outline-primary-200-light flex justify-center items-center gap-1'>
								<div className="justify-center text-neutral-900 body-1 font-medium">{item.label}</div>
							</div>
							<div className={`${item.contentClassName} ${item.textColor} title-3 font-medium line-clamp-1`}>{item.content}</div>
						</div>
					))}
				</div>
			</div>
			{/* 오른쪽 영역: 설정 아이콘 및 프로젝트 날짜 */}
			<div className='inline-flex flex-col items-end gap-[108px]'>
				{/* 설정 아이콘 */}
				<div className='w-10 h-10 flex justify-center items-center'>
				</div>
				{/* 프로젝트 기간 및 D-day */}
				<div className='self-stretch pr-3.5 inline-flex justify-end items-center gap-3'>
					{/* Due 날짜 */}
					<div className='flex justify-start items-center gap-2.5'>
						<div className="justify-center text-neutral-700 font-semibold body-1 line-clamp-1">Due</div>
						<div className="justify-center text-neutral-600 body-1 font-medium line-clamp-1">
							{startDate} ~ {endDate}
						</div>
					</div>
					{/* 구분선 */}
					<div className='w-0.5 h-3 relative bg-neutral-300 rounded-md' />
					{/* D-day */}
					<div className='flex justify-start items-center gap-2.5'>
						<div className="justify-center text-neutral-700 font-semibold title-3 line-clamp-1">Project</div>
						<div className="text-right justify-center text-primary-500-normal heading-3 font-bold line-clamp-1">D-{dDay}</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TeamBoardHeader

