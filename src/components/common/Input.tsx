import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import CheckIcon from '@/assets/icons/signup/check-icon.svg?react'

type InputType = 'auth' | 'onboarding'

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
	category: InputType
	error?: string
	success?: string
}

const Input = forwardRef<HTMLInputElement, IInput>(({ category, placeholder, error, success, className, ...rest }, ref) => {
	const message = error || success
	const statusColor = error ? 'text-[#FF7F38]' : 'text-[#22C55E]'

	const baseStyles = {
		auth: 'w-full h-14 px-4 py-3.5 rounded-10 border-[1.5px] border-neutral-200 bg-neutral-100 focus:border-primary-500-normal focus:outline-none title-2 placeholder:text-neutral-300',
		onboarding:
			'w-75 h-13.5 bg-primary-50-light px-5 py-2.5 rounded-10 border-2 border-primary-200-light focus:border-primary-400-normal focus:outline-none placeholder:body-1 placeholder:text-neutral-600',
	}

	return (
		<div>
			<input
				ref={ref}
				className={cn('duration-300 ease-in-out', baseStyles[category], className)}
				placeholder={placeholder || 'placeholder를 입력하세요'}
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
