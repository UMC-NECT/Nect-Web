interface SegmentButtonProps {
	title: string
	isActive?: boolean
	onClick?: () => void
}

const SegmentButton = ({ title, isActive = false, onClick }: SegmentButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`inline-flex items-center justify-center h-8 px-[14px] py-1 body-1 transition-all ${
				isActive
					? 'bg-neutral-000 text-neutral-900 font-medium rounded-[12px] shadow-[0px_1px_2px_0px_rgba(95,14,200,0.2),0px_0px_4px_0px_rgba(154,92,235,0.2)]'
					: 'text-primary-500-normal font-normal rounded-10'
			}`}
		>
			{title}
		</button>
	)
}

export default SegmentButton