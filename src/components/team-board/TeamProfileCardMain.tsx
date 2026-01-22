import { WORK_STATUS_CONFIG } from '@/constants/workStatus'
import ResetIcon from '@/assets/icons/common/reset.svg?react'
import PlayIcon from '@/assets/icons/common/play.svg?react'

interface WorkStatus {
	beforeProgress: number // 진행 전
	inProgress: number // 진행 중
	completed: number // 완료
}

interface TeamProfileCardMainProps {
	name: string
	role: string
	time: string // "04:58:57" 형식
	avatarUrl?: string
	status: WorkStatus
	onStartWork?: () => void
	className?: string
}

const TeamProfileCardMain = ({
	name,
	role,
	time,
	avatarUrl = 'https://placehold.co/68x68',
	status,
	onStartWork,
	className = '',
}: TeamProfileCardMainProps) => {
	const statusItems = WORK_STATUS_CONFIG.map((config) => ({
		...config,
		value: status[config.key],
	}))

	return (
		<div
			className={`w-[378px] h-[208px] px-4 pt-5 bg-neutral-000 rounded-xl outline-1 -outline-offset-1 outline-primary-500-normal flex flex-col justify-start items-start overflow-hidden shrink-0 ${className}`}
		>
			<div className="self-stretch relative flex flex-col justify-start items-start">
				{/* 상단: 프로필 정보 및 작업 시작 버튼 */}
				<div className="self-stretch h-[120px] pr-0.5 flex flex-col justify-start items-end gap-1">
					<div className="self-stretch inline-flex justify-between items-start">
						{/* 프로필 정보 */}
						<div className="flex justify-start items-center gap-[18px]">
							<img
								className="w-[68px] h-[68px] rounded-full outline-1 outline-neutral-000 object-cover"
								src={avatarUrl}
								alt={name}
							/>
							<div className="inline-flex flex-col justify-center items-start gap-1">
								<div className="justify-center text-neutral-900 heading-3 font-bold">{name}</div>
								<div className="justify-center text-neutral-600 title-3 font-medium">{role}</div>
							</div>
						</div>

						{/* 작업 시작 버튼 */}
						<div className="w-[116px] inline-flex flex-col justify-start items-start gap-[6px]">
							<button
								onClick={onStartWork}
								className="self-stretch pl-3.5 pr-[18px] py-2.5 bg-primary-500-normal rounded-xl inline-flex justify-start items-center gap-1.5"
							>
								{/* Play 아이콘 */}
								<PlayIcon className="w-[18px] h-[18px]" />
								<div className="text-center justify-center text-neutral-50 body-1 font-semibold">작업 시작</div>
							</button>
						</div>
					</div>

					{/* 타이머 */}
					<div className="pr-1 inline-flex justify-start items-center gap-1">
						{/* 새로고침 아이콘 */}
						<div className="w-7 h-7 rounded-lg shadow-inner-neutral-2 flex justify-center items-center">
							<ResetIcon className="w-6 h-6 text-neutral-300" />
						</div>
						<div className="text-right justify-center text-primary-500-normal heading-1 font-bold">{time}</div>
					</div>
				</div>

				{/* 구분선 */}
				<div className="w-[346px] h-0 mt-4 mb-3 outline -outline-offset-[0.50px] outline-neutral-200"></div>


				{/* 하단: 진행 상태 */}
				<div className="self-stretch inline-flex justify-between items-center">
					<div className="flex-1 flex justify-center items-center gap-[26px]">
						{statusItems.map((item, index) => (
							<div key={index} className={`${index === 2 ? 'w-20' : ''} h-6 flex justify-start items-center gap-2`}>
								<div className="flex justify-start items-center gap-2">
									<div className="w-3.5 h-3.5 relative">
										<div className={`w-3.5 h-3.5 left-0 top-0 absolute ${item.color} rounded-full`} />
									</div>
									<div className="text-center justify-center text-neutral-700 body-1 font-semibold">{item.label}</div>
								</div>
								<div className="justify-center text-neutral-700 title-3 font-semibold">{item.value}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default TeamProfileCardMain
