import { useState } from 'react'
import { cn } from '@/utils/cn'
import ArrowDownIcon from '@/assets/icons/signup/arrow-down.svg'

interface IAccordion {
	title: string
	children: React.ReactNode
	className?: string
	defaultOpen?: boolean
}

const Accordion = ({ title, children, className, defaultOpen = false }: IAccordion) => {
	const [isOpen, setIsOpen] = useState(defaultOpen)

	const toggleAccordion = () => setIsOpen(!isOpen)

	return (
		<div className={cn('w-full', className)}>
			{/* 타이틀 */}
			<button
				type='button'
				onClick={toggleAccordion}
				className={cn(
					'w-full flex items-center justify-between px-4 py-3.25 duration-300 ease-in-out',
					'body-1 text-left',
					'border border-primary-300-light rounded-10',
					isOpen
						? 'bg-primary-400-normal text-primary-50-light'
						: 'bg-primary-100-light text-[#191919] hover:bg-primary-300-light'
				)}
			>
				<span>{title}</span>
				<img
					src={ArrowDownIcon}
					alt='토글 이미지'
					className={cn('w-4 h-4 transition-transform duration-200', isOpen ? 'rotate-180 brightness-0 invert' : '')}
				/>
			</button>

			{/* 체크박스 항목들 */}
			<div
				className={cn(
					'overflow-hidden transition-all duration-300 ease-in-out',
					isOpen ? 'max-h-44 opacity-100' : 'max-h-0 opacity-0'
				)}
			>
				<div className='bg-neutral-50 max-h-44 overflow-y-auto'>{children}</div>
			</div>
		</div>
	)
}

export default Accordion
