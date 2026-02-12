import { cn } from '@/utils/cn'

interface ContentSectionProps {
	title: string
	children: React.ReactNode
	className?: string
}

const ContentSection = ({ title, children, className }: ContentSectionProps) => {
	return (
		<div className={cn('flex flex-col w-full justify-center mt-12 gap-7', className)}>
			<span className='heading-3 font-bold text-primary-600-normal'>{title}</span>
			{children}
		</div>
	)
}

export default ContentSection
