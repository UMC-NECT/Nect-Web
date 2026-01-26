interface IProjectCard {
	img?: string
	title: string
	description: string
	date: string
	onUpdate?: (field: 'title' | 'description' | 'date', value: string) => void
	isEditable?: boolean
}

const ProjectCard = ({ img, title, description, date, onUpdate, isEditable = false }: IProjectCard) => {
	return (
		<div className='flex gap-4'>
			{/* 카드 컨테이너*/}
			<div className='w-full rounded-12 border border-neutral-200 overflow-hidden shadow-drop-neutral-1'>
				{/* 썸네일 */}
				<div className='flex justify-center p-0.5'>
					{img ? (
						<img src={img} alt={`${title}의 썸네일 이미지`} />
					) : (
						<div className='w-full h-55.25 bg-neutral-200 rounded-12' />
					)}
				</div>

				{/* 프로젝트 정보 */}
				<div className='flex flex-col gap-1.5 px-5 pt-3.5 pb-4'>
					{isEditable ? (
						<>
							<input
								type='text'
								className='title-3 font-semibold text-neutral-900 bg-transparent focus:outline-none placeholder:text-neutral-300'
								placeholder='프로젝트 이름'
								value={title}
								onChange={e => onUpdate?.('title', e.target.value)}
							/>
							<textarea
								className='body-2 text-neutral-600 bg-transparent focus:outline-none placeholder:text-neutral-300 resize-none'
								placeholder='프로젝트 설명 (2줄까지 보여짐)'
								value={description}
								onChange={e => onUpdate?.('description', e.target.value)}
								rows={2}
							/>
							<input
								type='text'
								className='body-2 text-neutral-400 bg-transparent focus:outline-none placeholder:text-neutral-300'
								placeholder='0000.00~0000.00'
								value={date}
								onChange={e => onUpdate?.('date', e.target.value)}
							/>
						</>
					) : (
						<>
							<h3 className='title-3 font-semibold text-neutral-900'>{title || '프로젝트 이름'}</h3>
							<p className='body-2 text-neutral-600 line-clamp-2'>
								{description || '프로젝트 설명 (2줄까지 보여짐)'}
							</p>
							<span className='body-2 text-neutral-400'>{date || '0000.00~0000.00'}</span>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProjectCard
