import { useNavigate } from 'react-router'
import HistoryCard from '../HistoryCard'
import { MyPageHeader } from '../MyPageHeader'
import { useMypageProjectsQuery, useMypageProfileQuery } from '@/hooks/mypage/useMypageApi'
import { useProjectIdStore } from '@/stores/useProjectIdStroe'

const AllProjects = () => {
	const navigate = useNavigate()
	const { setProjectId } = useProjectIdStore()

	// api - 현재 참여중인 프로젝트 조회
	const { data } = useMypageProjectsQuery()
	const { data: profileData } = useMypageProfileQuery()
	const projects = data?.body?.projects.flat()
	const userId = profileData?.body?.userId

	const handleProjectClick = (projectId: number) => {
		setProjectId(projectId, userId)
		navigate('/mypage/ongoing')
	}

	return (
		<div className='min-h-50 flex flex-col'>
			<MyPageHeader />

			<div className='grid grid-cols-3 gap-4 bg-neutral-000 border border-neutral-200 rounded-12 p-11.5'>
				{projects?.map(project => (
					<HistoryCard key={project.project_id} {...project} onClick={() => handleProjectClick(project.project_id)} />
				))}
			</div>
		</div>
	)
}

export default AllProjects
