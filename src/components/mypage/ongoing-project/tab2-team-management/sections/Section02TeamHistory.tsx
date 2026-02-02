import RoleTag from '@/components/mypage/RoleTag'

interface ProjectHistory {
	id: number
	title: string
	description: string
	period: string
	imageUrl?: string
	tags: string[]
}

interface ISection02TeamHistory {
	projectHistories: ProjectHistory[]
}

const Section02TeamHistory = ({ projectHistories }: ISection02TeamHistory) => {
	return (
		<div className='flex flex-col gap-5 ml-5'>
			<h3 className='title-2 font-bold text-neutral-900'>팀원들의 프로젝트 히스토리</h3>

			<div className='grid grid-cols-2 gap-6'>
				{projectHistories.map(project => (
					<div key={project.id} className='flex flex-col gap-2'>
						{/* 역할 태그들 */}
						<div className='flex flex-wrap gap-2'>
							{project.tags.map((tag, index) => (
								<RoleTag key={index} role={tag} showTotal={false} />
							))}
						</div>

						<div className='border-[3px] border-transparent hover:border-primary-400-normal rounded-16 transition-colors cursor-pointer overflow-hidden'>
							{/* 썸네일 */}
							<div className='w-full h-52 bg-neutral-600'></div>

							{/* 프로젝트 정보 */}
							<div className='flex flex-col gap-1 p-4'>
								<h4 className='body-1 font-semibold text-neutral-900'>{project.title}</h4>
								<p className='body-2 text-neutral-600 line-clamp-2'>{project.description}</p>
								<span className='caption-1 text-neutral-400'>{project.period}</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Section02TeamHistory
