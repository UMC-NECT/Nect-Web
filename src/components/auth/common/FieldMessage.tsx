import CheckIcon from '@/assets/icons/auth/check-icon.svg?react'

interface FieldMessageProps {
	type: 'error' | 'success'
	message: string
}

const FieldMessage = ({ type, message }: FieldMessageProps) => {
	const colorClass = type === 'error' ? 'text-danger-700' : 'text-status-success'

	return (
		<span className='flex items-center gap-1'>
			<CheckIcon className={`w-2.25 h-1.5 mx-0.5 my-0.75 ${colorClass}`} />
			<span className={`body-2 ${colorClass}`}>{message}</span>
		</span>
	)
}

export default FieldMessage
