interface BoardListItemProps {
	tag?: string // [공지], [필독] 등
	title: string
	author: string
	date: string
	onClick?: () => void
	className?: string
}

const BoardListItem = ({ tag, title, author, date, onClick, className = '' }: BoardListItemProps) => {
	return (
		<div
			className={`w-[1224px] flex px-5 items-center cursor-pointer hover:bg-neutral-50 transition-colors ${className}`}
			onClick={onClick}
		>
            <div className="flex items-center py-3 gap-[42px] border-b border-neutral-100 border-solid">
                {/* 왼쪽: 태그 + 제목 */}
                <div className="flex-1 flex items-center pl-[10px] w-[770px]">
                    <div className="flex items-center gap-1">
                        {tag && (
                            <span className="body-2 font-bold text-primary-600-normal whitespace-nowrap">
                                {tag}
                            </span>
                        )}
                        <span className={`body-2 ${tag ? 'font-bold' : 'font-medium'} text-neutral-900`}>{title}</span>
                    </div>
                </div>

                {/* 오른쪽: 작성자 */}
                <div className="flex items-center justify-center w-[184px] shrink-0">
                    <span className="body-2 font-medium text-neutral-900 whitespace-nowrap">{author}</span>
                </div>

                {/* 오른쪽: 날짜 */}
                <div className="flex items-center justify-center w-[146px] shrink-0">
                    <span className="body-2 font-medium text-neutral-900 whitespace-nowrap">{date}</span>
                </div>
            </div>
		</div>
	)
}

export default BoardListItem
