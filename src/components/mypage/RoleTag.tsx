import type { ColorType } from '@/types/mypage/ongoindProject'
import { cn } from '@/utils/cn'

interface IRoleTag extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	role?: string
	color?: ColorType
	showTotal?: boolean
	total?: number
}

const base = 'w-fit body-2 text-neutral-700 px-2 py-0.5 rounded-6'

const RoleTag = ({ role = '역할', color = 'purple', showTotal = true, total = 0, className, ...props }: IRoleTag) => {
	const colorStyles = {
		purple: 'bg-[var(--color-semantic-purple)]',
		pink: 'bg-[var(--color-semantic-pink)]',
		green: 'bg-[var(--color-semantic-green)]',
		blue: 'bg-[var(--color-semantic-blue)]',
	}

	return (
		<span className={cn(base, colorStyles[color], className)} {...props}>
			{role}
			{showTotal ? <>({total})</> : ''}
		</span>
	)
}

export default RoleTag
