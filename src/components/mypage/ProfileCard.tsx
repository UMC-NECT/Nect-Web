import ProfileSampleIcon from '@/assets/icons/mypage/profile-sample.svg?react'

interface IProfileCard {
	profileImage?: React.ReactNode
	isLeader?: boolean
	nickname: string
	part?: string
	introduction?: string
}

const ProfileCard = ({ profileImage, isLeader = false, nickname, part, introduction }: IProfileCard) => {
	return (
		<div className='flex items-start gap-4 p-4 rounded-12 bg-primary-50-light w-96.5 border-[1.5px] border-primary-200-light'>
			{/* 프사 */}
			{profileImage || <ProfileSampleIcon className='w-20 h-20 rounded-full' />}

			<div className='flex flex-col gap-1'>
				<div className='flex items-center gap-1.5'>
					{/* 리더 */}
					{isLeader && <span className='title-3 font-semibold text-primary-500-normal'>Leader</span>}

					{/* 닉네임 */}
					<span className='title-3 font-semibold text-neutral-900'>{nickname}</span>

					{/* 파트 */}
					{part && <span className='title-3 text-neutral-500'>ㅣ {part}</span>}
				</div>

				{/* 소개글 */}
				{introduction && <span className='body-2 text-neutral-600'>{introduction}</span>}
			</div>
		</div>
	)
}

export default ProfileCard
