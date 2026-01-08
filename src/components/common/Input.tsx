import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import CheckIcon from '@/assets/icons/signup/check-icon.svg?react'

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string
	success?: string
}

const Input = forwardRef<HTMLInputElement, IInput>(({ placeholder, error, success, className, ...rest }, ref) => {
	const message = error || success
	const statusColor = error ? 'text-[#FF7F38]' : 'text-[#22C55E]'

	return (
		<div className='relative w-fit'>
			<input
				ref={ref}
				className={cn(
					'w-75 h-13.5 bg-primary-50-light px-5 py-2.5 rounded-10 border-2 border-primary-200-light focus:border-primary-400-normal focus:outline-none duration-200 ease-in-out placeholder:body-1 placeholder:text-neutral-400 text-neutral-900',
					className
				)}
				placeholder={placeholder}
				{...rest}
			/>

			<div className='absolute top-full left-0 w-full'>
				{message && (
					<div className='flex items-center gap-1 mx-1.75 mt-1.5'>
						<CheckIcon className={cn('w-3 h-3 mr-1', statusColor)} />
						<p className={cn('body-3', statusColor)}>{message}</p>
					</div>
				)}
			</div>
		</div>
	)
})

export default Input
