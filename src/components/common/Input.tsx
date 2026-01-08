import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import CheckIcon from '@/assets/icons/signup/check-icon.svg?react'

type InputType = 'auth' | 'onboarding'

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
	category?: InputType
	error?: string
	success?: string
}

const Input = forwardRef<HTMLInputElement, IInput>(
	({ category = 'auth', placeholder, error, success, className, ...rest }, ref) => {
		const message = error || success
		const statusColor = error ? 'text-[#FF7F38]' : 'text-[#22C55E]'

		const baseStyles = {
			auth: 'w-full h-14 px-4 py-3.5 rounded-10 border-[1.5px] border-neutral-200 bg-neutral-100 focus:border-primary-500-normal focus:outline-none title-2 placeholder:text-neutral-300',
			onboarding:
				'w-75 h-13.5 bg-primary-50-light px-5 py-2.5 rounded-10 border-2 border-primary-200-light focus:border-primary-400-normal focus:outline-none duration-200 ease-in-out placeholder:body-1 placeholder:text-neutral-400 text-neutral-900',
		}

		const wrapperWidthClass = category === 'auth' ? 'w-full' : 'w-fit'

		return (
			<div className={cn('relative', wrapperWidthClass)}>
				<input
					ref={ref}
					className={cn('duration-300 ease-in-out', baseStyles[category], className)}
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
	}
)

export default Input
