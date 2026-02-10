import { WORK_STATUS_CONFIG } from '@/constants/workStatus'

interface WorkStatus {
	beforeProgress: number // 진행 전
	inProgress: number // 진행 중
	completed: number // 완료
}

interface TeamProfileCardProps {
	name: string
	role: string
	contact: string
	time: string // "00:00:00" 형식
	avatarUrl?: string
	status: WorkStatus
	isWorking?: boolean // 작업 중 여부
	className?: string
}

const TeamProfileCard = ({
	name,
	role,
	contact,
	time,
	avatarUrl = 'https://placehold.co/60x60',
	status,
	isWorking = false,
	className = '',
}: TeamProfileCardProps) => {
	const statusItems = WORK_STATUS_CONFIG.map((config) => ({
		...config,
		value: status[config.key],
	}))

	return (
		<div
			className={`w-[378px] h-[96px] px-3.5 py-4 bg-neutral-50 rounded-xl outline-1 -outline-offset-1 outline-neutral-100 inline-flex flex-col justify-start items-start gap-2.5 ${className}`}
		>
			<div className="self-stretch inline-flex justify-between items-center">
				{/* 왼쪽: 프로필 정보 */}
				<div className="w-60 flex justify-start items-center gap-4">
					{/* 프로필 이미지 */}
					<div className="w-14 h-14 relative">
						<img
							className="w-14 h-14 absolute inset-0 outline-1 outline-neutral-000 rounded-full object-cover"
							src={avatarUrl}
							alt={name}
						/>
					</div>

					{/* 이름, 역할, 연락처 */}
					<div className="flex flex-col justify-start items-start gap-1">
						{/* 이름, 역할 (한 줄) */}
						<div className="w-[160px] flex justify-start items-center gap-1.5">
							<div className="justify-center text-neutral-900 title-3 font-bold">{name}</div>
							<div className="w-0.5 h-3 relative bg-neutral-300 rounded-md" />
							<div className="justify-center text-neutral-800 body-1 font-medium">{role}</div>
						</div>
						{/* 연락처 (아래 줄) */}
						<div className="justify-center text-neutral-600 caption-1 font-medium">{contact}</div>
					</div>
				</div>

				{/* 오른쪽: 시간 및 상태 */}
				<div className="h-16 inline-flex flex-col justify-between items-end">
					{/* 시간 */}
					<div className={`text-right justify-center title-1 font-bold ${
						isWorking ? 'text-primary-500-normal' : 'text-neutral-400'
					}`}>{time}</div>

					{/* 상태 점들 */}
					<div className="self-stretch h-3 inline-flex justify-end items-center gap-1.5">
						{statusItems.map((item, index) => (
							<div key={index} className="flex justify-start items-center gap-1">
								<div className="h-4 px-[3px] bg-neutral-000 rounded-xl shadow-drop-primary-2 flex justify-center items-center gap-1 overflow-hidden">
									<div className={`w-2.5 h-2.5 ${item.color} rounded-full`} />
								</div>
								<div className="justify-center text-neutral-600 body-1 font-semibold">{item.value}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default TeamProfileCard
