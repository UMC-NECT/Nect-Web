import { cn } from '@/utils/cn'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	size?: 'sm' | 'md' | 'lg'
	fullWidth?: boolean
}

const Button = ({ size = 'md', fullWidth = false, className, children, ...props }: ButtonProps) => {
	const base = 'rounded-10 transition-colors duration-300 ease-in-out flex items-center justify-center'

	const color =
		'bg-primary-500-normal text-white hover:bg-primary-600-normal disabled:bg-primary-300-light disabled:text-primary-50-light disabled:cursor-not-allowed'

	const sizes = {
		sm: 'px-4 py-2 body-1',
		md: 'px-10 py-2.5 title-3',
		lg: 'px-29.25 py-3.25 title-2',
	}

	const widthStyles = fullWidth ? 'w-full' : 'w-fit'

	return (
		<button className={cn(base, color, sizes[size], widthStyles, className)} {...props}>
			{children}
		</button>
	)
}

export default Button
