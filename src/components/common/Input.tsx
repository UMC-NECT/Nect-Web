import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import errorCheckIcon from '../../assets/icons/signup/error-check.svg'
import successCheckIcon from '../../assets/icons/signup/success-check.svg'

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string
	success?: string
}

const Input = forwardRef<HTMLInputElement, IInput>(({ placeholder, error, success, className, ...rest }, ref) => {
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

			{(error || success) && (
				<div className='flex gap-0.5 mt-1 ml-1.75'>
					{error ? (
						<>
							<img src={errorCheckIcon} alt='error' />
							<p className='caption-3 text-[#FF7F38]'>{error}</p>
						</>
					) : success ? (
						<>
							<img src={successCheckIcon} alt='success' />
							<p className='caption-3 text-[#22C55E]'>{success}</p>
						</>
					) : (
						<></>
					)}
				</div>
			)}
		</div>
	)
})

export default Input
