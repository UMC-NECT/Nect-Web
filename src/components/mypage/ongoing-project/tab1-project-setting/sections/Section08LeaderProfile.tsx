import ProfileCard from '@/components/mypage/ProfileCard'
import RoleTag from '@/components/mypage/RoleTag'
import type { RoleType } from '@/types/mypage/ongoindProject'
import { formatRoleName } from '@/utils/roleColor'

interface LeaderInfo {
	name: string
	nickname: string
	role: string
	bio: string
	profileImageFileName: string
}

interface ISection08LeaderProfile {
	leaderInfo: LeaderInfo | null
	hasTag: boolean
}

const Section08LeaderProfile = ({ leaderInfo, hasTag }: ISection08LeaderProfile) => {
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
				{hasTag && <RoleTag role={formatRoleName(leaderInfo.role) as RoleType} showTotal={false} />}
				<ProfileCard
					isLeader
					nickname={leaderInfo.nickname}
					part={formatRoleName(leaderInfo.role)}
					introduction={leaderInfo.bio}
					highlighted={true}
					profileImage={
						leaderInfo.profileImageFileName ? (
							<img
								src={leaderInfo.profileImageFileName}
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
