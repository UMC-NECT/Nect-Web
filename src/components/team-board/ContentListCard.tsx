import ChevronRightIcon from '@/assets/icons/common/chevron-right.svg?react'

interface ContentListItem {
	title: string
	date: string
	tag?: string // 게시판용: [필독], [공지] 등
	fileType?: 'PDF' | 'Figma' // 공유 문서함용
}

interface ContentListCardProps {
	type: '게시판' | '공유 문서함'
	items: ContentListItem[]
	className?: string
}

const ContentListCard = ({ type, items, className = '' }: ContentListCardProps) => {
	return (
		<div className={`w-[392px] h-[216px] p-5 bg-neutral-000 rounded-xl outline-1 -outline-offset-1 outline-neutral-100 inline-flex flex-col justify-start items-start gap-2.5 ${className}`}>
            <div className={`self-stretch ${type === '게시판' ? 'h-44' : ''} flex flex-col justify-start items-start gap-4`}>
				{/* 헤더 */}
				<div className="self-stretch inline-flex justify-start items-center gap-2">
					<div className="justify-start text-neutral-900 title-2 font-bold">{type}</div>
					<div className="w-4 h-4 flex justify-center items-center gap-2.5">
						<ChevronRightIcon className="w-4 h-4 text-neutral-700" /> 
					</div>
				</div>

				{/* 아이템 리스트 */}
				<div className="self-stretch flex flex-col justify-start items-start gap-3">
					{items.map((item, index) => (
						<div key={index} className="self-stretch inline-flex justify-between items-center">
							{type === '게시판' ? (
								<div className="w-[270px] justify-start flex items-center gap-1">
									{item.tag && (
										<span className="text-primary-600-normal body-1 font-semibold whitespace-nowrap shrink-0">
											{item.tag}
										</span>
									)}
									<span className="text-neutral-900 body-1 font-medium truncate">
										{' '}
										{item.title}
									</span>
								</div>
							) : (
								<div className="flex justify-start items-center gap-1.5">
									<div className="w-5 h-5 bg-neutral-200 rounded-md shrink-0" />
									<div className="w-64 justify-center text-neutral-900 body-1 font-medium line-clamp-1">
										{item.title}
									</div>
								</div>
							)}
							<div className="w-20 text-right justify-center text-neutral-400 body-2 font-medium">
								{item.date}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default ContentListCard
