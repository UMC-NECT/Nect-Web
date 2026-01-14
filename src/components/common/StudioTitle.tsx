import CalendarIcon from '@/assets/icons/common/calendar.svg?react'

interface StudioTitleProps {
	title: string
	description: string
}

const StudioTitle = ({ title, description }: StudioTitleProps) => {
	return (
		<div className='flex items-center gap-6'>
				<div className='flex items-center justify-center p-2.5 bg-neutral-50 rounded-xl w-[72px] h-[72px]'>
					<CalendarIcon className='w-[50px] h-[50px]' />
				</div>
				<div className='flex flex-col gap-2'>
					<h1 className='heading-2 font-bold text-neutral-900'>{title}</h1>
					<p className='title-3 font-medium text-neutral-600'>
						{description}
					</p>
				</div>
			</div>
	)
}

export default StudioTitle