import type { ColorType } from '@/types/mypage/ongoindProject'
import RoleTag from '../../RoleTag'

interface ProjectHistory {
	id: number
	title: string
	description: string
	period: string
	imageUrl?: string
	tags: string[]
}

interface ITeamHistorySection {
	projectHistories: ProjectHistory[]
	getRoleColor: (tag: string) => ColorType
}

const TeamHistorySection = ({ projectHistories, getRoleColor }: ITeamHistorySection) => {
	return (
		<div className='flex flex-col gap-4'>
			<h3 className='title-3 font-semibold text-neutral-900'>팀원들의 프로젝트 히스토리</h3>

			{/* 역할 태그들 */}
			<div className='flex flex-wrap gap-2 mb-2'>
				{['PM', 'Backend', 'Design'].map(tag => (
					<RoleTag role={tag} color={getRoleColor(tag)} showTotal={false} />
				))}
			</div>

			<div className='grid grid-cols-2 gap-6'>
				{projectHistories.map(project => (
					<div key={project.id} className='flex flex-col gap-3'>
						{/* 썸네일 */}
						<div className='w-full h-52 rounded-12 bg-neutral-800 overflow-hidden'>
							{project.id === 2 && (
								<div className='w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center'>
									<span className='text-white text-xl font-bold'>Triple Renewal</span>
								</div>
							)}
						</div>

						{/* 프로젝트 정보 */}
						<div className='flex flex-col gap-1'>
							<h4 className='body-1 font-semibold text-neutral-900'>{project.title}</h4>
							<p className='body-2 text-neutral-600 line-clamp-2'>{project.description}</p>
							<span className='caption-1 text-neutral-400'>{project.period}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default TeamHistorySection
