import ProfileImageIcon from '@/assets/icons/mypage/profile-image.svg?react'
import ProfileSampleIcon from '@/assets/Default_Profile.svg?react'
import BarIcon from '@/assets/icons/common/Bar.svg?react'

interface IProfileCard {
	profileImage?: React.ReactNode
	isLeader?: boolean
	highlighted?: boolean
	isMatching?: boolean
	nickname: string
	part?: string
	introduction?: string
}

const ProfileCard = ({
	profileImage,
	isLeader = false,
	highlighted = false,
	isMatching = false,
	nickname,
	part,
	introduction,
}: IProfileCard) => {
	return (
		<div
			className={`flex items-start gap-4 p-4 rounded-12 w-96.5 h-28 border-[1.5px] ${
				highlighted ? 'bg-primary-50-light border-primary-200-light' : 'bg-neutral-000 border-neutral-200'
			} ${isMatching ? 'opacity-40' : ''}`}
		>
			{/* 프사 */}
			<div className='shrink-0 w-20 h-20'>
				{isMatching ? (
					<ProfileImageIcon className='w-20 h-20' />
				) : profileImage ? (
					profileImage
				) : (
					<ProfileSampleIcon className='w-20 h-20 rounded-full' />
				)}
			</div>

			<div className='flex flex-col gap-1.5'>
				<div className='flex items-center gap-1.5'>
					{/* 리더 */}
					{(isLeader || highlighted) && (
						<span className='title-3 font-medium text-primary-500-normal'>{highlighted ? 'Leader' : 'Lead'}</span>
					)}

					{/* 닉네임 */}
					<span className='title-3 font-semibold text-neutral-900 max-w-[63px] whitespace-nowrap'>{nickname}</span>

					{/* 파트 */}
					<BarIcon className='w-0.5 h-3 text-neutral-300 ' />
					{part && <span className='title-3 font-medium text-neutral-500 max-w-[122px] line-clamp-1'>{part}</span>}
				</div>

				{/* 소개글 */}
				{introduction && <span className='body-2 font-medium text-neutral-600'>{introduction}</span>}
			</div>
		</div>
	)
}

export default ProfileCard
