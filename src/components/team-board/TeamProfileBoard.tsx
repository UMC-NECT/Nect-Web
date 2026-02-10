import TeamProfileCard from './TeamProfileCard'
import TeamProfileCardMain from './TeamProfileCardMain'

interface TeamProfile {
	name: string
	role: string
	contact: string
	time: string
	avatarUrl?: string
	status: {
		beforeProgress: number
		inProgress: number
		completed: number
	}
}

interface TeamProfileBoardProps {
	mainProfile?: Omit<TeamProfile, 'contact'> & { isWorking?: boolean; onStartWork?: () => void } // 메인 카드용 (큰 카드)
	profiles?: TeamProfile[] // 그리드 카드용 (작은 카드들)
	className?: string
}

const TeamProfileBoard = ({ mainProfile, profiles = [], className = '' }: TeamProfileBoardProps) => {
	return (
		<div
			className={`w-[808px] h-[518px] p-5 bg-neutral-000 rounded-xl outline-1 -outline-offset-1 outline-neutral-100 inline-flex flex-col justify-start items-start gap-[18px] ${className}`}
		>
			{/* 헤더 */}
			<div className="self-stretch text-neutral-900 title-2 font-bold">팀원 프로필 보드</div>

			{/* 프로필 카드 영역 */}
			<div className="self-stretch flex flex-col justify-start items-start gap-4">
				{/* 첫 번째 행: 메인 카드 + 오른쪽 작은 카드들 */}
				<div className="self-stretch flex justify-start items-start gap-4">
					{/* 메인 카드 */}
					{mainProfile && (
						<TeamProfileCardMain
							name={mainProfile.name}
							role={mainProfile.role}
							time={mainProfile.time}
							avatarUrl={mainProfile.avatarUrl}
							status={mainProfile.status}
							isWorking={mainProfile.isWorking}
							onStartWork={mainProfile.onStartWork}
						/>
					)}

					{/* 오른쪽 작은 카드들 (세로) */}
					{profiles.length > 0 && (
						<div className="flex flex-col justify-start items-start gap-4">
							{profiles.slice(0, 2).map((profile, index) => (
								<TeamProfileCard key={index} {...profile} />
							))}
						</div>
					)}
				</div>

				{/* 두 번째 행: 아래 작은 카드들 (2x2 그리드) */}
				{profiles.length > 2 && (
					<div className="self-stretch grid grid-cols-2 gap-4">
						{profiles.slice(2).map((profile, index) => (
							<TeamProfileCard key={index + 2} {...profile} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default TeamProfileBoard
