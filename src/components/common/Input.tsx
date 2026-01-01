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
		<div>
			<input
				ref={ref}
				className={cn(
					'w-75 h-13.5 bg-primary-50-light px-5 py-2.5 rounded-10 border-2 border-primary-400-normal focus:outline-none placeholder:body-1',
					className
				)}
				placeholder={placeholder}
				{...rest}
			/>

			{message && (
				<div className='flex gap-0.5 mt-1 ml-1.75 items-center'>
					<CheckIcon className={cn('w-2.5 h-2.5 mr-0.5', statusColor)} />
					<p className={cn('caption-3', statusColor)}>{message}</p>
				</div>
			)}
		</div>
	)
})

export default Input
