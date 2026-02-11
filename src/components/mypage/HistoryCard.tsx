import { useState } from 'react'
import type { MypageProjectType } from '@/types/api/mypage'

type HistoryCardProps = MypageProjectType & {
	onClick?: () => void
}

const HistoryCard = ({
	project_title,
	description,
	planned_started_on,
	planned_ended_on,
	image_name,
	onClick,
}: HistoryCardProps) => {
	const [imgError, setImgError] = useState(false)

	return (
		<div
			className='w-96 h-85.5 border-[3px] border-transparent hover:border-primary-400-normal rounded-16 transition-colors cursor-pointer overflow-hidden shrink-0'
			onClick={onClick}
		>
			{/* 썸네일 */}
			{image_name && !imgError ? (
				<img
					src={image_name}
					alt={project_title}
					className='w-full h-52 object-cover rounded-12'
					onError={() => setImgError(true)}
				/>
			) : (
				<div className='w-full h-52 bg-neutral-600 rounded-12' />
			)}

			{/* 프로젝트 정보 */}
			<div className='flex flex-col gap-1 p-4'>
				<h4 className='title-3 font-semibold text-neutral-900'>{project_title}</h4>
				<p className='body-2 font-medium h-10.5 text-neutral-600 line-clamp-2'>{description}</p>
				<span className='body-2 font-normal text-neutral-400'>
					{planned_started_on} ~ {planned_ended_on}
				</span>
			</div>
		</div>
	)
}

export default HistoryCard
