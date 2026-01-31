import { useState } from 'react'
import { DndContext, closestCenter, useDraggable, useDroppable } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import type { TeamMembersByRole, TeamMember } from '@/types/mypage/ongoindProject'
import Button from '@/components/common/Button'
import RoleTag from '@/components/mypage/RoleTag'

interface IPartSettingsModal {
	teamMembersByRole: TeamMembersByRole[]
	onClose: () => void
	onSave: (updatedParts: TeamMembersByRole[]) => void
}

// 드래그 가능한 멤버 카드 컴포넌트
const DraggableMemberCard = ({ member }: { member: TeamMember }) => {
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
		id: member.id,
	})

	return (
		<button
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			type='button'
			className={`flex items-center gap-3 bg-neutral-000 min-w-50 border-[1.5px] border-neutral-100 rounded-12 pl-2 py-1 w-68.5 hover:border-neutral-200 hover:bg-neutral-100 transition-colors cursor-grab active:cursor-grabbing ${
				isDragging ? 'opacity-50' : ''
			}`}
		>
			{/* 프로필 이미지 */}
			<div className='w-10 h-10 rounded-full bg-neutral-200 overflow-hidden shrink-0'>{member.profileImage}</div>

			{/* 정보 */}
			<div className='flex items-center gap-1'>
				{member.isLeader && <span className='body-2 font-medium text-primary-400-normal'>Leader</span>}
				<span className='title-3 font-semibold text-neutral-800'>{member.nickname}</span>
				<span className='body-2 text-neutral-300'>|</span>
				<span className='title-3 text-neutral-500'>{member.part}</span>
			</div>
		</button>
	)
}

// 드롭 가능한 파트 영역 컴포넌트
const DroppablePartSection = ({ role, roleLabel, members }: { role: string; roleLabel: string; members: TeamMember[] }) => {
	const { setNodeRef } = useDroppable({
		id: role,
	})

	return (
		<div className='flex flex-col gap-4.5'>
			{/* 역할 태그 */}
			<RoleTag role={roleLabel} showTotal={false} />

			{/* 멤버 목록 */}
			<div ref={setNodeRef} className={`flex flex-wrap gap-3 min-h-20 p-2 rounded-12 `}>
				{members.map(member => (
					<DraggableMemberCard key={member.id} member={member} />
				))}
			</div>
		</div>
	)
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

	// 드래그 종료 핸들러
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (!over) return

		const memberId = active.id as string
		const targetRole = over.id as string

		// 같은 파트로 드롭하면 무시
		const sourcePart = parts.find(part => part.members.some(member => member.id === memberId))
		if (sourcePart?.role === targetRole) return

		// 멤버를 새 파트로 이동
		setParts(prevParts => {
			const newParts = prevParts.map(part => ({
				...part,
				members: [...part.members],
			}))

			// 원본 파트에서 멤버 제거
			let movedMember: TeamMember | undefined
			newParts.forEach(part => {
				const memberIndex = part.members.findIndex(m => m.id === memberId)
				if (memberIndex !== -1) {
					movedMember = { ...part.members[memberIndex] }
					part.members.splice(memberIndex, 1)
				}
			})

			// 대상 파트에 멤버 추가
			if (movedMember) {
				const targetPart = newParts.find(part => part.role === targetRole)
				if (targetPart) {
					targetPart.members.push({
						...movedMember,
						part: targetPart.roleLabel,
					})
					// 리더를 맨 앞으로 정렬
					targetPart.members.sort((a, b) => {
						if (a.isLeader && !b.isLeader) return -1
						if (!a.isLeader && b.isLeader) return 1
						return 0
					})
				}
			}

			return newParts
		})
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
				<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<div className='flex-1 overflow-y-auto'>
						<div className='flex flex-col gap-11.5 pb-10.5'>
							{parts.map(({ role, roleLabel, members }) => (
								<DroppablePartSection key={role} role={role} roleLabel={roleLabel} members={members} />
							))}
						</div>
					</div>
				</DndContext>

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
