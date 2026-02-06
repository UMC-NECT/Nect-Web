import { cn } from '@/utils/cn'

type RecruitmentStatus = '모집 전' | '모집 중' | '모집 완료'

interface RecruitmentStatusChipProps {
	status: RecruitmentStatus
	isSelected?: boolean
	onClick?: () => void
}

const RecruitmentStatusChip = ({ status, isSelected = false, onClick }: RecruitmentStatusChipProps) => {
	const statusConfig = {
		'모집 전': {
			dotColor: 'bg-primary-300-light',
		},
		'모집 중': {
			dotColor: 'bg-primary-500-normal',
		},
		'모집 완료': {
			dotColor: 'bg-neutral-400',
		},
	}

	const config = statusConfig[status]

	const dotStyle = 'w-2 h-2 rounded-full mr-1'

	return (
		<div
			className={`w-fit flex items-center justify-center px-2.5 py-0.75 border border-neutral-200 rounded-100 cursor-pointer ${isSelected ? (status === '모집 완료' ? 'bg-neutral-100' : 'bg-primary-100-light border-primary-150-light') : 'bg-neutral-000'}`}
			onClick={onClick}
		>
			<div className={cn(dotStyle, config.dotColor)} />
			<span className='text-neutral-700 text-[14px] font-semibold'>{status}</span>
		</div>
	)
}

export default RecruitmentStatusChip
