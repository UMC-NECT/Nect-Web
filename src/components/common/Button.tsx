import { cn } from '@/utils/cn'
import React from 'react'

type SizeType = 'sm' | 'md' | 'lg'
type ColorType = 'auth' | 'socialLogin' | 'onboarding' | 'mypage1' | 'mypage2' | 'text'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	size?: SizeType
	color?: ColorType
	fullWidth?: boolean
}

const Button = ({ size = 'md', color = 'onboarding', fullWidth = false, className, children, ...props }: ButtonProps) => {
	const base = 'rounded-12 transition-colors duration-300 ease-in-out flex items-center justify-center'

	const colors = {
		auth: 'title-2 bg-primary-500-normal text-neutral-000 font-medium disabled:font-normal disabled:bg-primary-200-light',
		socialLogin:
			'w-full h-14 title-2 text-neutral-900 py-3.5 border border-neutral-300 rounded-12 flex justify-center items-center gap-3',
		onboarding:
			'bg-primary-500-normal text-white hover:bg-primary-600-normal disabled:bg-primary-300-light disabled:text-primary-50-light disabled:cursor-not-allowed',
		primary:
			'font-semibold bg-primary-400-normal text-neutral-50 hover:bg-primary-500-normal disabled:bg-primary-200-light disabled:text-neutral-000',
		secondary:
			'font-semibold bg-primary-50-light text-primary-600-normal border border-primary-300-light hover:bg-primary-200-light disabled:border-primary-200-light disabled:text-primary-300-normal',
		mypage1: 'w-32.5 h-12 body-1 font-semibold text-neutral-900 border-[1.5px] border-neutral-200 	bg-neutral-50 rounded-12',
		mypage2: 'w-32.5 h-12 body-1 font-semibold text-neutral-50 bg-primary-400-normal rounded-12',
		text: 'bg-transparent text-neutral-500 hover:text-neutral-700 duration-200',
	}

	const sizes = {
		sm: 'px-4 py-2 body-1',
		md: 'px-10 py-2.5 title-3',
		lg: 'px-29.25 py-3.25 title-2',
		xl: 'px-5 py-2.5 title-3 h-[60px]',
	}

	const widthStyles = fullWidth ? 'w-full' : 'w-fit'

	return (
		<button className={cn(base, colors[color], sizes[size], widthStyles, className)} {...props}>
			{children}
		</button>
	)
}

export default Button
