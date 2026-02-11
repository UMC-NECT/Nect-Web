import type { ColorType } from '@/types/mypage/ongoindProject'
import { cn } from '@/utils/cn'
import { formatRoleName } from '@/utils/roleColor'

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
		case 'PLANNING':
		case 'SERVICE':
			return 'purple'
		case 'Design':
		case 'UI/UX':
		case 'PRODUCT':
		case 'UI_UX':
			return 'pink'
		case 'Backend':
		case '백엔드':
		case 'BACKEND':
			return 'blue'
		case 'Frontend':
		case '프론트엔드':
		case 'FRONTEND':
			return 'green'
		default:
			return 'gray'
	}
}

const RoleTag = ({ role = '역할', showTotal = true, total = 0, className, ...props }: IRoleTag) => {
	const displayRole = role === role.toUpperCase() ? formatRoleName(role) : role
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
			{displayRole}
			&nbsp;{showTotal ? <>({total})</> : ''}
		</span>
	)
}

export default RoleTag
