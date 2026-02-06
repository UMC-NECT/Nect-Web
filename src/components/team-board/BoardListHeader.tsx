const BoardListHeader = () => {
	return (
		<div className="bg-status-info-cool-gray-light flex flex-col items-center pb-[10px] pt-[12px] px-5 w-full">
			<div className="flex gap-[42px] h-[22px] items-center w-full">
				<div className="flex-1 flex items-center justify-center w-[770px]">
					<span className="body-2 font-bold text-neutral-700 whitespace-nowrap">제목</span>
				</div>
				<div className="flex items-center justify-center w-[184px] shrink-0">
					<span className="body-2 font-bold text-neutral-700 whitespace-nowrap">작성자</span>
				</div>
				<div className="flex items-center justify-center w-[146px] shrink-0">
					<span className="body-2 font-bold text-neutral-700 whitespace-nowrap">작성일</span>
				</div>
			</div>
		</div>
	)
}

export default BoardListHeader
