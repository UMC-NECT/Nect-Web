interface ChatDateLineProps {
	date: string
}

interface ChatDateLineProps {
	date: string
	className?: string
}

export const ChatDateLine = ({ date, className }: ChatDateLineProps) => {
	return (
		<div className={`flex flex-col items-center justify-center pt-2.5 px-2.5 w-full ${className || ''}`}>
			<div className="bg-neutral-100 flex h-[25px] items-center justify-center px-2.5 py-[3px] rounded-12">
				<div className="text-neutral-700 caption-1 font-medium leading-normal">
					{date}
				</div>
			</div>
		</div>
	)
}
