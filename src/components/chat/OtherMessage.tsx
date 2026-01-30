interface OtherMessageProps {
	senderName: string
	content: string
	time: string
	role?: string
	profileImage?: string
	readCount?: number
}

export const OtherMessage = ({
	senderName,
	content,
	time,
	role,
	profileImage,
	readCount,
}: OtherMessageProps) => {
	return (
		<div className="flex gap-2 items-start justify-start pt-2.5">
			{/* 프로필 이미지 */}
			<div className="relative w-[30px] h-[30px] shrink-0">
				{profileImage ? (
					<img
						src={profileImage}
						alt={senderName}
						className="w-[30px] h-[30px] rounded-full object-cover"
					/>
				) : (
					<div className="w-[30px] h-[30px] rounded-full bg-neutral-200" />
				)}
			</div>

			{/* 메시지 컨텐츠 */}
			<div className="flex flex-col gap-1 items-start w-[305px]">
				{/* 이름과 역할 */}
				<div className="flex gap-[3px] items-center">
					<div className="text-neutral-900 caption-1 font-semibold leading-normal">
						{senderName}
					</div>
					{role && (
						<div className="text-neutral-500 caption-3 font-medium leading-normal">
							{role}
						</div>
					)}
				</div>

				{/* 메시지 버블 */}
				<div className="flex gap-1.5 items-end w-full">
					<div className="px-3 py-1.5 flex items-center bg-white rounded-bl-[6px] rounded-br-[6px] rounded-tr-[6px]">
						<div className="flex-1 max-w-[248px] text-neutral-900 label font-medium tracking-[-0.26px] leading-[1.4]">
							{content}
						</div>
					</div>

					{/* 시간 및 읽음 수 */}
					<div className="flex flex-col h-[30px] items-start justify-end py-0.5">
						{readCount !== undefined && (
							<div className="h-3.5 text-primary-400-normal caption-2 font-medium">
								{readCount}
							</div>
						)}
						<div className="h-3.5 text-neutral-500 caption-3 font-regular">
							{time}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
