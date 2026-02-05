interface IHistoryCard {
	title: string
	description: string
	period: string
}

const HistoryCard = ({ title, description, period }: IHistoryCard) => {
	return (
		<div className='w-96 h-85.5 border-[3px] border-transparent hover:border-primary-400-normal rounded-16 transition-colors cursor-pointer overflow-hidden'>
			{/* 썸네일 */}
			<div className='w-full h-52 bg-neutral-600 rounded-12'></div>

			{/* 프로젝트 정보 */}
			<div className='flex flex-col gap-1 p-4'>
				<h4 className='body-1 font-semibold text-neutral-900'>{title}</h4>
				<p className='body-2 text-neutral-600 line-clamp-2'>{description}</p>
				<span className='caption-1 text-neutral-400'>{period}</span>
			</div>
		</div>
	)
}

export default HistoryCard
