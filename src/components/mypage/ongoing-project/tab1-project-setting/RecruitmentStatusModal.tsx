import RecruitmentStatusChip from '@/components/common/RecruitmentStatusChip'
import { RECRUIT_STATUS, type RecruitType } from '@/types/mypage/ongoindProject'

interface RecruitmentStatusModalProps {
	currentStatus: RecruitType
	onStatusChange: (status: RecruitType) => void
	onClose: () => void
}

const RecruitmentStatusModal = ({ onStatusChange, onClose }: RecruitmentStatusModalProps) => {
	const statuses = RECRUIT_STATUS

	const handleStatusClick = (status: RecruitType) => {
		onStatusChange(status)
		onClose()
	}

	return (
		<div className='absolute top-full left-0 z-50'>
			{/* 상태 변경 카드 */}
			<div className='bg-neutral-000 rounded-6 px-3.5 py-2.5 w-30 shadow-drop-neutral-1 border border-neutral-200'>
				<h3 className='caption-1 font-semibold text-neutral-500 mb-2'>상태 변경</h3>

				<div className='flex flex-col gap-2.5'>
					{statuses.map(status => (
						<div key={status} onClick={() => handleStatusClick(status)}>
							<RecruitmentStatusChip status={status} />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default RecruitmentStatusModal
