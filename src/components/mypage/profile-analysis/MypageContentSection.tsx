import { cn } from '@/utils/cn'

interface MypageContentSectionProps {
	title: string
	children: React.ReactNode
	className?: string
}

const MypageContentSection = ({ title, children, className }: MypageContentSectionProps) => {
	return (
		<div className={cn('flex flex-col w-full justify-center gap-7', className)}>
			<span className='title-2 font-bold text-primary-600-normal'>{title}</span>
			{children}
		</div>
	)
}

export default MypageContentSection
