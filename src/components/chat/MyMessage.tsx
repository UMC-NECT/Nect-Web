interface MyMessageProps {
	content: string
	time: string
	readCount?: number
}

export const MyMessage = ({ content, time, readCount }: MyMessageProps) => {
	return (
		<div className="flex gap-1.5 items-end justify-end pt-2.5">
			{/* 시간 표시 */}
			<div className="flex flex-col h-[30px] items-end justify-end py-0.5">
				{readCount !== undefined && (
					<div className="h-3.5 text-primary-400-normal caption-2 font-medium">
						{readCount}
					</div>
				)}
				<div className="h-3.5 text-neutral-500 caption-3 font-regular">
					{time}
				</div>
			</div>

			{/* 메시지 버블 */}
			<div className="flex flex-col gap-1 items-start max-w-[248px]">
				<div className="px-3 py-1.5 flex items-center bg-primary-150-light rounded-bl-[6px] rounded-br-[6px] rounded-tl-[6px]">
					<div className="flex-1 max-w-[248px] text-neutral-900 label font-medium tracking-[-0.26px] leading-[1.4]">
						{content}
					</div>
				</div>
			</div>
		</div>
	)
}
