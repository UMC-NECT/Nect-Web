import { useState } from 'react'
import type { TeamMembersByRole } from '@/types/mypage/ongoindProject'
import Button from '@/components/common/Button'
import RoleTag from '@/components/mypage/RoleTag'

interface IPartSettingsModal {
	teamMembersByRole: TeamMembersByRole[]
	onClose: () => void
	onSave: (updatedParts: TeamMembersByRole[]) => void
}

const PartSettingsModal = ({ teamMembersByRole, onClose, onSave }: IPartSettingsModal) => {
	const [parts, setParts] = useState<TeamMembersByRole[]>(teamMembersByRole)

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	// 새 파트 추가
	const handleAddPart = () => {
		const newPart: TeamMembersByRole = {
			role: `new-part-${Date.now()}`,
			roleLabel: '새 파트',
			color: 'gray',
			members: [],
		}
		setParts([...parts, newPart])
	}

	// 저장
	const handleSave = () => {
		onSave(parts)
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50' onClick={handleBackdropClick}>
			<div className='w-177.5 max-h-[90vh] bg-neutral-000 rounded-16 flex flex-col pl-14 pr-2.5'>
				{/* 헤더 */}
				<div className='flex items-center justify-between pt-12 pb-6'>
					<h2 className='heading-2 font-bold text-neutral-900'>파트 설정</h2>

					<Button color='text' className='body-1 text-neutral-500' onClick={handleAddPart}>
						+ 파트 추가
					</Button>
				</div>

				{/* 컨텐츠 */}
				<div className='flex-1 overflow-y-auto'>
					<div className='flex flex-col gap-11.5 pb-10.5'>
						{parts.map(({ role, roleLabel, members }) => (
							<div key={role} className='flex flex-col gap-4.5'>
								{/* 역할 태그 */}
								<RoleTag role={roleLabel} showTotal={false} />

								{/* 멤버 목록 */}
								<div className='flex flex-wrap gap-3'>
									{members.map(member => (
										<button
											key={member.id}
											type='button'
											className='flex items-center gap-3 bg-neutral-000 min-w-50 border-[1.5px] border-neutral-100 rounded-12 pl-2 py-1 w-68.5 hover:border-neutral-200 hover:bg-neutral-100 transition-colors cursor-pointer'
										>
											{/* 프로필 이미지 */}
											<div className='w-10 h-10 rounded-full bg-neutral-200 overflow-hidden shrink-0'>
												{member.profileImage}
											</div>

											{/* 정보 */}
											<div className='flex items-center gap-1'>
												{member.isLeader && (
													<span className='body-2 font-medium text-primary-400-normal'>Leader</span>
												)}
												<span className='title-3 font-semibold text-neutral-800'>{member.nickname}</span>
												<span className='body-2 text-neutral-300'>|</span>
												<span className='title-3 text-neutral-500'>{member.part}</span>
											</div>
										</button>
									))}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* 푸터 */}
				<div className='flex items-center justify-center gap-3 pb-12 pt-2'>
					<Button color='mypage1' onClick={onClose} className='w-40 h-12'>
						취소
					</Button>

					<Button color='mypage2' onClick={handleSave} className='w-40 h-12'>
						저장
					</Button>
				</div>
			</div>
		</div>
	)
}

export default PartSettingsModal
