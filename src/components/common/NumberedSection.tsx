interface NumberedSectionProps {
	number: string
	title: string
	children: React.ReactNode
	className?: string
}

const NumberedSection = ({ number, title, children, className = '' }: NumberedSectionProps) => {
	return (
		<div className={`${className}`}>
			<div className='flex items-center gap-3'>
				<span className='heading-1 font-bold text-neutral-900'>{number}</span>
				<h2 className='heading-3 font-bold text-primary-600-normal'>{title}</h2>
			</div>
			<div className='mt-6 pl-[50px]'>{children}</div>
		</div>
	)
}

export default NumberedSection
