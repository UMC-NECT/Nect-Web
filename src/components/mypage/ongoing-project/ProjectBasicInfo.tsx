interface ProjectData {
	name: string
	intro: string
	startDate: string
	endDate: string
	recruitmentStatus: '모집 전' | '모집 중' | '모집 완료'
	thumbnailUrl?: string
}

interface IProjectBasicInfo {
	projectData: ProjectData
}

const ProjectBasicInfo = ({ projectData }: IProjectBasicInfo) => {
	return (
		<div className='flex items-start gap-7'>
			{/* 썸네일 */}
			<div className='w-80 h-44.5 rounded-12 bg-neutral-400' />

			{/* 기본 정보 */}
			<div className='flex-1 flex flex-col gap-3.5 pt-2.5'>
				<div className='flex items-start gap-5'>
					<span className='w-25 body-1 text-neutral-600'>프로젝트 이름</span>
					<span className='flex-1 body-1 font-semibold text-primary-600-normal'>{projectData.name}</span>
				</div>
				<div className='flex items-start gap-5'>
					<span className='w-25 body-1 text-neutral-600'>프로젝트 소개</span>
					<span className='flex-1 body-1 text-neutral-900'>{projectData.intro}</span>
				</div>
				<div className='flex items-center gap-5'>
					<span className='w-25 body-1 text-neutral-600'>예상 기간</span>
					<div className='flex items-center gap-1'>
						<span className='body-1 text-neutral-900'>{projectData.startDate}</span>
						<span className='body-1 text-neutral-500'>~</span>
						<span className='body-1 text-neutral-900'>{projectData.endDate}</span>
					</div>
				</div>
				<div className='flex items-center gap-5'>
					<span className='w-25 body-1 text-neutral-600'>모집 여부</span>
					<div className='flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-100 border border-neutral-300'>
						<div className='w-2 h-2 rounded-full bg-neutral-400' />
						<span className='body-2 text-neutral-600'>{projectData.recruitmentStatus}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProjectBasicInfo
