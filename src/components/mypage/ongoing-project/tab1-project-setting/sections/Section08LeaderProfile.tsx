import ProfileCard from '@/components/mypage/ProfileCard'
import RoleTag from '@/components/mypage/RoleTag'

const Section08LeaderProfile = () => {
	return (
		<div className='flex flex-col gap-6 ml-5'>
			<h3 className='title-2 font-semibold text-neutral-900'>리더 프로필</h3>

			<div className='flex flex-col gap-3'>
				<RoleTag role='PM' showTotal={false} />
				<ProfileCard isLeader nickname='닉네임' part='Part' introduction='프로필 소개' highlighted={true} />
			</div>
		</div>
	)
}

export default Section08LeaderProfile
