import HistoryCard from '../HistoryCard'
import { MyPageHeader } from '../MyPageHeader'
import { useMypageProjectsQuery } from '@/hooks/mypage/useMypageApi'

const AllProjects = () => {
	// api - 현재 참여중인 프로젝트 조회
	const { data } = useMypageProjectsQuery()
	const projects = data?.body?.projects.flat()

	return (
		<div className='min-h-50 flex flex-col'>
			<MyPageHeader />

			<div className='grid grid-cols-3 gap-4 bg-neutral-000 border border-neutral-200 rounded-12 p-11.5'>
				{projects?.map(project => (
					<HistoryCard key={project.project_id} {...project} />
				))}
			</div>
		</div>
	)
}

export default AllProjects
