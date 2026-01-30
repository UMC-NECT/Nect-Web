import type { ReactNode } from 'react'

interface FormFieldProps {
	label: string
	children: ReactNode
	messageArea?: ReactNode
	className?: string
}

const FormField = ({ label, children, messageArea, className = 'h-29' }: FormFieldProps) => {
	return (
		<div className={className}>
			<div className='flex flex-col items-start w-full'>
				<div className='title-3 text-neutral-900 mb-2'>{label}</div>
				{children}
				<div className='mb-1.5'></div>
				{messageArea && messageArea}
			</div>
		</div>
	)
}

export default FormField
