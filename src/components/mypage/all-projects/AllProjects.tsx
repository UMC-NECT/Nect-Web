import { useNavigate } from 'react-router'
import HistoryCard from '../HistoryCard'
import { MyPageHeader } from '../MyPageHeader'
import { useMypageProjectsQuery, useMypageProfileQuery } from '@/hooks/mypage/useMypageApi'
import { useProjectIdStore } from '@/stores/useProjectIdStroe'
import Button from '@/components/common/Button'
import NecttyIcon from '@/assets/nectty.png'
import LoadingModal from '@/components/splash/LoadingModal'

const AllProjects = () => {
	const navigate = useNavigate()
	const { setProjectId } = useProjectIdStore()

	// api - 현재 참여중인 프로젝트 조회
	const { data, isLoading } = useMypageProjectsQuery()
	const { data: profileData } = useMypageProfileQuery()
	const projects = data?.body?.projects.flat()
	const userId = profileData?.body?.userId

	const handleProjectClick = (projectId: number) => {
		setProjectId(projectId, userId)
		navigate('/mypage/ongoing')
	}

	const isNoProjects = projects?.length === 0

	if (isNoProjects) {
		return (
			<div className='ml-7 items-center flex flex-col'>
				<MyPageHeader />
				<div className='w-full bg-bg-gray px-[46px] py-[56px] rounded-12 border border-neutral-200 max-w-[916px]'>
					<div className='flex flex-col items-center gap-5'>
						<p className='title-3 font-semibold text-primary-600-normal'>NECT Project</p>
						<div className='flex flex-col items-center gap-3'>
							<p className='heading-3 font-bold text-neutral-900'> 나의 프로젝트가 없습니다.</p>
							<p className='title-3 font-medium text-neutral-600'>프로젝트를 생성하거나 매칭 신청을 해보세요!</p>
						</div>
						<img src={NecttyIcon} className='w-[185px] h-[158px] mt-[53px] mb-[86px]' />
						<Button color='primary' onClick={() => navigate('/')} size='xl' className='w-[320px]'>홈화면에서 탐색하기</Button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-50 flex flex-col ml-7 items-center'>
			<MyPageHeader />
			{isLoading && <LoadingModal />}
			<div className='grid grid-cols-2 gap-4 justify-items-center bg-neutral-000 border border-neutral-200 rounded-12 p-11.5 w-[916px]'>
				{projects?.map(project => (
					<HistoryCard key={project.project_id} {...project} onClick={() => handleProjectClick(project.project_id)} />
				))}
			</div>
		</div>
	)
}

export default AllProjects
