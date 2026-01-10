import PlusIcon from '@/assets/icons/week-mission/plus-block.svg?react'

interface PlusBlockProps {
	onClick?: () => void
}

const PlusBlock = ({ onClick }: PlusBlockProps) => {
	return (
		<div
			className='flex flex-col items-center justify-center rounded-xl border border-neutral-200 w-full h-full cursor-pointer transition-all duration-300'
			onClick={onClick}
		>
			<div className='flex items-center justify-center w-6 h-6'>
				<PlusIcon className='w-6 h-6 stroke-neutral-500' />
			</div>
		</div>
	)
}

export default PlusBlock