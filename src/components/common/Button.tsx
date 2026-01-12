import { cn } from '@/utils/cn'
import React from 'react'

type SizeType = 'sm' | 'md' | 'lg'
type ColorType = 'auth' | 'socialLogin' | 'onboarding'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	size?: SizeType
	color?: ColorType
	fullWidth?: boolean
}

const Button = ({ size = 'md', color = 'onboarding', fullWidth = false, className, children, ...props }: ButtonProps) => {
	const base = 'rounded-10 transition-colors duration-300 ease-in-out flex items-center justify-center'

	const colors = {
		auth: 'title-2 bg-primary-500-normal text-neutral-000 disabled:bg-primary-150-light disabled:text-primary-300-light hover:bg-primary-600-normal duration-300 ease-in-out',
		socialLogin:
			'w-full h-14 title-2 text-neutral-900 py-3.5 border border-neutral-700 rounded-10 flex justify-center items-center gap-2.5 hover:bg-neutral-200 duration-200 ease-in-out',
		onboarding:
			'bg-primary-500-normal text-white hover:bg-primary-600-normal disabled:bg-primary-300-light disabled:text-primary-50-light disabled:cursor-not-allowed',
	}

	const sizes = {
		sm: 'px-4 py-2 body-1',
		md: 'px-10 py-2.5 title-3',
		lg: 'px-29.25 py-3.25 title-2',
	}

	const widthStyles = fullWidth ? 'w-full' : 'w-fit'

	return (
		<button className={cn(base, colors[color], sizes[size], widthStyles, className)} {...props}>
			{children}
		</button>
	)
}

export default Button
