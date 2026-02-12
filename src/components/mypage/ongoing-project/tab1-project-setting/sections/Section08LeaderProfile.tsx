import ProfileCard from '@/components/mypage/ProfileCard'
import RoleTagChip from '@/components/mission-modal/RoleTagChip'
import { formatRoleName } from '@/utils/roleColor'

interface LeaderInfo {
	name: string
	nickname: string
	role: string
	bio: string
	profileImageUrl: string
}

interface ISection08LeaderProfile {
	leaderInfo: LeaderInfo | null
	hasTag: boolean
	/** LEADER 멤버의 part_label (API /mypage/projects/:id/users 응답에서 추출) */
	partLabel?: string | null
}

const Section08LeaderProfile = ({ leaderInfo, hasTag, partLabel }: ISection08LeaderProfile) => {
	if (!leaderInfo) {
		return (
			<div className='flex flex-col gap-6 ml-5'>
				<h3 className='title-2 font-semibold text-neutral-900'>리더 프로필</h3>
				<div className='flex flex-col gap-3'>
					<span className='body-2 text-neutral-500'>리더 정보를 불러오는 중...</span>
				</div>
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-6 ml-5'>
			<h3 className='title-2 font-semibold text-neutral-900'>리더 프로필</h3>

			<div className='flex flex-col gap-3'>
				{hasTag && (
					<RoleTagChip
						roleId={1}
						roleName={formatRoleName(leaderInfo.role)}
						roleField={leaderInfo.role}
						state='default'
					/>
				)}
				<ProfileCard
					isLeader
					nickname={leaderInfo.nickname}
					part={partLabel ?? formatRoleName(leaderInfo.role)}
					introduction={leaderInfo.bio}
					highlighted={true}
					profileImage={
						leaderInfo.profileImageUrl ? (
							<img
								src={leaderInfo.profileImageUrl}
								alt={leaderInfo.nickname}
								className='w-20 h-20 rounded-full object-cover'
							/>
						) : undefined
					}
				/>
			</div>
		</div>
	)
}

export default Section08LeaderProfile
