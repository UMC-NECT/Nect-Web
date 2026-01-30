interface RoleRecommendProps {
	role: string
	title: string
	description: string
}

const RoleRecommend = ({ role, title, description }: RoleRecommendProps) => {
	return (
		<div className='flex w-full gap-3'>
			{/* 역할 */}
			<p className='title-3 font-bold text-neutral-900 shrink-0 w-[64px] py-5'>{role}</p>

			{/* 내용 */}
			<div className='flex flex-col gap-2 py-5 px-[22px] bg-white rounded-12 w-full'>
				<p className='title-3 font-semibold text-neutral-900'>{title}</p>
				<p className='body-2 text-neutral-800 whitespace-pre-line'>
					{description}
				</p>
			</div>
		</div>
	)
}

export default RoleRecommend