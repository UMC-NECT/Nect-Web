import { useRef } from 'react'
import { USER_STATUS, type UserStatusType } from '../../constants/userStatus'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useUserStatusStore } from '@/stores/useUserStatusStore'
import { useUserStore } from '@/stores/useUserStore'

interface UserStatusModalState {
	isOpen: boolean
}

const UserStatusModal = ({ isOpen }: UserStatusModalState) => {
	const { setUserStatus } = useUserStore() // 유저 상태 변경 (재학/구직/재직)

	// 외부 클릭시 닫히도록
	const ref = useRef<HTMLDivElement>(null)
	const { close } = useUserStatusStore()
	useClickOutside(ref, close, isOpen)

	// (모달 핸들러) 유저 상태 변경
	const handleStatusClick = (status: UserStatusType) => {
		setUserStatus(status)
		close()
	}

	return (
		<div className='absolute top-7 left-0 w-23 bg-neutral-000 rounded-6 shadow-drop-neutral-1 px-2.5 py-3.5' ref={ref}>
			<div className='caption-1 text-neutral-500 mb-2'>상태 변경</div>

			{/* 상태 3가지 */}
			<div className='flex flex-col gap-2.5'>
				{USER_STATUS.map(status => (
					<span
						key={status}
						className='text-[14px] text-neutral-600 leading-[140%] font-semibold bg-neutral-100 border border-neutral-300 px-3 py-1 rounded-100 text-center cursor-pointer'
						onClick={() => handleStatusClick(status)}
					>
						{status}
					</span>
				))}
			</div>
		</div>
	)
}

export default UserStatusModal
