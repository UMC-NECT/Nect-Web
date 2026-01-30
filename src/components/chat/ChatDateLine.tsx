interface ChatDateLineProps {
	date: string
}

export const ChatDateLine = ({ date }: ChatDateLineProps) => {
	return (
		<div className="flex flex-col items-center justify-center pt-2.5 w-full">
			<div className="bg-[#e3e3e8] flex h-[25px] items-center justify-center px-2.5 py-[3.5px] rounded-xl">
				<div className="text-neutral-700 caption-1 font-medium leading-normal">
					{date}
				</div>
			</div>
		</div>
	)
}
