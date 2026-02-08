import type { ColorType } from '@/types/mypage/ongoindProject'
import { cn } from '@/utils/cn'

interface IRoleTag extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	role?: string
	showTotal?: boolean
	total?: number
}

const base = 'w-fit button-1 font-medium text-neutral-700 px-2 py-0.5 rounded-6 shadow-drop-neutral-2'

// 역할에 따라 자동으로 색상 결정
const getRoleColor = (role: string): ColorType => {
	switch (role) {
		case 'PM':
		case '기획':
			return 'purple'
		case 'Design':
		case 'UI/UX':
			return 'pink'
		case 'Backend':
		case '백엔드':
			return 'blue'
		case 'Frontend':
		case '프론트엔드':
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
			&nbsp;{showTotal ? <>({total})</> : ''}
		</span>
	)
}

export default RoleTag
