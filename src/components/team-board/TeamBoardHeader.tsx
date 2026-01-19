import ChevronDownIcon from '@/assets/icons/common/chevron-down.svg?react'
import SettingsIcon from '@/assets/icons/common/settings.svg?react'
import { calculateDDay } from '@/utils/dateUtils'

interface TeamBoardHeaderProps {
	title: string
	description: string
	notice?: string
	regularMeeting?: string
	memberCount?: number
	memberAvatars?: string[]
	startDate: string
	endDate: string
}

const TeamBoardHeader = ({
	title,
	description,
	notice = '이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~',
	regularMeeting = '매주 금요일 PM 8:30  /  강남 사거리역 스타벅스',
	memberCount = 20,
	memberAvatars = [],
	startDate,
	endDate,
}: TeamBoardHeaderProps) => {
	const dDay = calculateDDay(endDate)

	// 멤버 아바타 생성 (더미 데이터가 없을 경우)
	const avatars = memberAvatars.length > 0 ? memberAvatars : Array.from({ length: 9 }, () => `https://placehold.co/30x30`)

	// 공지사항 및 정기회의 정보 배열
	const infoItems = [
		{
			label: '공지사항',
			content: notice,
			textColor: 'text-primary-600-normal',
			contentClassName: 'justify-center',
		},
		{
			label: '정기회의',
			content: regularMeeting,
			textColor: 'text-neutral-900',
			contentClassName: 'flex-1 justify-center',
		},
	].filter(item => item.content) // 내용이 있는 항목만 필터링

	return (
		<div className='self-stretch inline-flex justify-between items-start'>
			{/* 왼쪽 영역: 프로젝트 정보 및 공지사항 */}
			<div className='w-[808px] inline-flex flex-col justify-start items-start gap-8'>
				{/* 프로젝트 제목 및 설명 */}
				<div className='self-stretch flex flex-col justify-start items-start gap-2'>
					<div className='self-stretch justify-start text-neutral-900 heading-2 font-bold line-clamp-1'>{title}</div>
					<div className='self-stretch justify-start text-[#5f5f5f] title-3 font-medium line-clamp-2'>{description}</div>
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
			{/* 오른쪽 영역: 멤버 정보 및 프로젝트 날짜 */}
			<div className='inline-flex flex-col justify-between items-end gap-[93px]'>
				{/* 설정 아이콘 및 멤버 아바타 그룹 */}
				<div className='inline-flex justify-start items-center gap-1'>
					{/* 설정 아이콘 */}
					<div className='w-10 h-10 flex justify-center items-center'>
						<SettingsIcon className='w-6 h-6 text-neutral-700' />
					</div>
					{/* 멤버 아바타 그룹 및 멤버 수 */}
					<div className='px-4 py-3.5 bg-neutral-000 rounded-[42px] shadow-drop-neutral-2 outline-1 -outline-offset-1 outline-neutral-100 inline-flex flex-col justify-start items-end gap-2.5 overflow-hidden'>
						<div className='self-stretch inline-flex justify-end items-center gap-1'>
							{/* 멤버 아바타 리스트 */}
							<div className='flex justify-start items-center'>
								{avatars.slice(0, 9).map((avatar, index) => (
									<div key={index} className='w-[30px] h-[30px] relative first:ml-0 -ml-1'>
										<img
											className='w-[30px] h-[30px] absolute inset-0 rounded-full outline-1 outline-neutral-000 object-cover'
											src={avatar}
											alt={`Member ${index + 1}`}
										/>
									</div>
								))}
							</div>
							{/* 멤버 수 표시 */}
							<div className='pl-3 pr-1.5 py-1 bg-neutral-100 rounded-100 outline-1 -outline-offset-1 outline-neutral-200 flex justify-center items-center gap-0.5'>
								<div className="text-center justify-center text-neutral-700 body-2 font-medium line-clamp-1">{memberCount}</div>
								<div className='w-4 h-4 relative overflow-hidden'>
									<ChevronDownIcon className='w-4 h-4 text-Color-Neutrals-500' />
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* 프로젝트 기간 및 D-day */}
				<div className='mt-auto self-stretch pr-3.5 inline-flex justify-end items-center gap-3'>
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

