import type { ColorType } from '@/types/mypage/ongoindProject'
import { cn } from '@/utils/cn'

interface IRoleTag extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	role?: string
	showTotal?: boolean
	total?: number
}

const base = 'w-fit body-2 text-neutral-700 px-2 py-0.5 rounded-6'

// 역할에 따라 자동으로 색상 결정
const getRoleColor = (role: string): ColorType => {
	switch (role) {
		case 'PM':
			return 'purple'
		case 'Design':
			return 'pink'
		case 'Backend':
			return 'blue'
		case 'Frontend':
			return 'green'
		default:
			return 'gray'
	}
}

const RoleTag = ({ role = '역할', showTotal = true, total = 0, className, ...props }: IRoleTag) => {
	const color = getRoleColor(role)

	const colorStyles = {
		purple: 'bg-[var(--color-roletag-purple)]',
		pink: 'bg-[var(--color-roletag-pink)]',
		green: 'bg-[var(--color-roletag-green)]',
		blue: 'bg-[var(--color-roletag-blue)]',
		gray: 'bg-[var(--color-roletag-gray)]',
	}

	return (
		<span className={cn(base, colorStyles[color], className)} {...props}>
			{role}
			{showTotal ? <>({total})</> : ''}
		</span>
	)
}

export default RoleTag
