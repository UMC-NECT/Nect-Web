import ProfileSampleIcon from '@/assets/icons/mypage/profile-sample.svg?react'

interface ITeamMemberCard {
	profileImage?: React.ReactNode
	nickname: string
	email: string
	introduction?: string
	onMenuClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const TeamMemberCard = ({ profileImage, nickname, email, introduction, onMenuClick }: ITeamMemberCard) => {
	return (
		<div className='flex items-center gap-4 p-4 rounded-12 bg-neutral-000 border-[1.5px] border-neutral-200 w-96.5 h-28'>
			{/* 프로필 사진 */}
			<div className='shrink-0'>
				{profileImage || (
					<div className='w-20 h-20 rounded-full bg-neutral-100 border border-neutral-100 overflow-hidden'>
						<ProfileSampleIcon className='w-full h-full' />
					</div>
				)}
			</div>

			{/* 정보 영역 */}
			<div className='flex flex-col gap-3 flex-1 min-w-0 pl-3 pr-3'>
				<div className='flex flex-col gap-0.5'>
					<span className='title-3 font-bold text-neutral-900 truncate'>{nickname}</span>
					<span className='caption-1 text-neutral-500 truncate'>{email}</span>
				</div>
				{introduction && (
					<p className='body-2 text-neutral-600 line-clamp-2 overflow-hidden text-ellipsis'>{introduction}</p>
				)}
			</div>

			{/* 메뉴 버튼 */}
			{onMenuClick && (
				<button type='button' onClick={e => onMenuClick(e)} className='shrink-0 p-2 hover:bg-neutral-50 rounded-6'>
					<svg width='16' height='16' viewBox='0 0 16 16' fill='none' className='text-neutral-500'>
						<path d='M0 0H12' stroke='currentColor' strokeWidth='1.3' strokeLinecap='round' />
						<path d='M0 6H12' stroke='currentColor' strokeWidth='1.3' strokeLinecap='round' />
						<path d='M0 12H12' stroke='currentColor' strokeWidth='1.3' strokeLinecap='round' />
					</svg>
				</button>
			)}
		</div>
	)
}

export default TeamMemberCard
