export const ChatReadLine = () => {
	return (
		<div className="flex flex-col items-center pb-0.5 pt-3.5 w-full">
			<div className="h-[18px] relative shrink-0 w-full">
				{/* 구분선 */}
				<div className="absolute h-0 left-0 top-[9px] w-full">
					<div className="absolute inset-[-0.5px_0] border-t border-neutral-200" />
				</div>
				{/* 텍스트 */}
				<div className="absolute bg-primary-50-light flex items-center justify-center left-1/2 -translate-x-1/2 px-3 top-0">
					<div className="text-neutral-500 caption-1 font-medium leading-normal whitespace-nowrap">
						여기까지 읽었습니다
					</div>
				</div>
			</div>
		</div>
	)
}
