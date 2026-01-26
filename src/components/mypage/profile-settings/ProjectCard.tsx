interface IProjectCard {
	img?: string
	title: string
	description: string
	date: string
}

const ProjectCard = ({ img, title, description, date }: IProjectCard) => {
	return (
		<div className='flex gap-4'>
			{/* 카드 컨테이너*/}
			<div className='w-[384px] rounded-12 border border-neutral-200 overflow-hidden shadow-drop-neutral-1'>
				{/* 썸네일 */}
				<div className='flex justify-center p-0.5'>
					{img ? (
						<img src={img} alt={`${title}의 썸네일 이미지`} />
					) : (
						<div className='w-full h-55.25 bg-[#707070] rounded-12' />
					)}
				</div>

				{/* 프로젝트 정보 */}
				<div className='flex flex-col gap-1.5 px-5 pt-3.5 pb-4'>
					<h3 className='title-3 font-semibold text-neutral-900'>{title}</h3>
					<p className='body-2 text-neutral-600 line-clamp-2'>{description}</p>
					<span className='body-2 text-neutral-400'>{date}</span>
				</div>
			</div>
		</div>
	)
}

export default ProjectCard
