import HistoryCard from '@/components/mypage/HistoryCard'
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

						<HistoryCard title={project.title} description={project.description} period={project.period} />
					</div>
				))}
			</div>
		</div>
	)
}

export default Section02TeamHistory
