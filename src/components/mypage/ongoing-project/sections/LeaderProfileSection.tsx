import ProfileCard from '@/components/mypage/ProfileCard'
import RoleTag from '../../RoleTag'

const LeaderProfileSection = () => {
	return (
		<div className='flex flex-col gap-4'>
			<h3 className='title-2 font-semibold text-neutral-900'>리더 프로필</h3>
			<RoleTag role='PM' color='purple' showTotal={false} />
			<div className='flex flex-col gap-3'>
				<ProfileCard isLeader nickname='닉네임' part='Part' introduction='프로필 소개' />
			</div>
		</div>
	)
}

export default LeaderProfileSection
