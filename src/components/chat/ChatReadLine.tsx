export const ChatReadLine = () => {
	return (
		<div className="flex items-center pb-0.5 pt-3.5 w-full">
			{/* 구분선 */}
			<div className="flex-1 h-0 border-t border-neutral-200" />
			{/* 텍스트 */}
			<div className="px-3 py-0">
				<div className="text-neutral-500 caption-1 font-medium leading-normal">
					여기까지 읽었습니다
				</div>
			</div>
			{/* 구분선 */}
			<div className="flex-1 h-0 border-t border-neutral-200" />
		</div>
	)
}
