import { useState, useRef } from 'react'
import { DndContext, closestCenter, useDraggable, useDroppable } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import type { TeamMembersByRole, TeamMember } from '@/types/mypage/ongoindProject'
import Button from '@/components/common/Button'
import RoleTag from '@/components/mypage/RoleTag'
import HamburgerIcon from '@/assets/icons/common/hamburger.svg?react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { usePartSettingsModal } from '@/stores/usePartSettingsModal'
import { useTeamMembersStore } from '@/stores/useTeamMembersStore'

// 드래그 가능한 멤버 카드 컴포넌트
const DraggableMemberCard = ({ member, index, role }: { member: TeamMember; index: number; role: string }) => {
	const {
		attributes,
		listeners,
		setNodeRef: setDragRef,
		isDragging,
	} = useDraggable({
		id: member.id,
	})

	const { setNodeRef: setDropRef, isOver } = useDroppable({
		id: `slot-${role}-${index}`,
	})

	// PM 파트의 첫 번째 멤버만 Leader 표시
	const isProjectLeader = role === 'PM' && index === 0

	return (
		<div
			ref={node => {
				setDragRef(node)
				setDropRef(node)
			}}
			{...listeners}
			{...attributes}
			className={`flex items-center gap-3 bg-neutral-000 border-[1.5px] rounded-12 pl-2 py-1 transition-colors cursor-grab active:cursor-grabbing ${
				isDragging ? 'opacity-50' : ''
			} ${isOver ? 'border-primary-400-normal bg-primary-50' : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-100'}`}
		>
			{/* 프로필 이미지 */}
			<div className='w-10 h-10 rounded-full bg-neutral-200 overflow-hidden shrink-0'>{member.profileImage}</div>

			{/* 정보 */}
			<div className='flex items-center gap-1'>
				{isProjectLeader && <span className='body-2 font-medium text-primary-400-normal'>Leader</span>}
				<span className='title-3 font-semibold text-neutral-800'>{member.nickname}</span>
				<span className='body-2 text-neutral-300'>|</span>
				<span className='title-3 text-neutral-500'>{member.part}</span>
			</div>
		</div>
	)
}

// 드롭 가능한 파트 영역 컴포넌트
const DroppablePartSection = ({
	role,
	members,
	targetCount,
	onCountChange,
	onRoleChange,
}: {
	role: string
	members: TeamMember[]
	targetCount: number
	onCountChange: (oldRole: string, count: number) => void
	onRoleChange: (oldRole: string, newRole: string) => void
}) => {
	const [isEditingCount, setIsEditingCount] = useState(false)
	const [editCount, setEditCount] = useState(targetCount)
	const [isEditingRole, setIsEditingRole] = useState(false)
	const [editRole, setEditRole] = useState(role)

	const { setNodeRef, isOver } = useDroppable({
		id: role,
	})

	const minCount = members.length // 최소값은 현재 멤버 수

	const handleCountClick = () => {
		setEditCount(targetCount)
		setIsEditingCount(true)
	}

	const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value
		// 숫자만 허용 (빈 문자열도 허용하여 전체 삭제 가능)
		if (inputValue === '' || /^\d{1,2}$/.test(inputValue)) {
			const value = inputValue === '' ? 0 : parseInt(inputValue, 10)
			if (value <= 99) {
				setEditCount(value)
			}
		}
	}

	const handleCountBlur = () => {
		const finalCount = Math.max(editCount, minCount)
		setEditCount(finalCount)
		onCountChange(role, finalCount)
		setIsEditingCount(false)
	}

	const handleCountKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleCountBlur()
		} else if (e.key === 'Escape') {
			setEditCount(targetCount)
			setIsEditingCount(false)
		}
	}

	// 파트 이름 편집 핸들러
	const handleRoleClick = () => {
		setEditRole(role)
		setIsEditingRole(true)
	}

	const handleRoleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditRole(e.target.value)
	}

	const handleRoleBlur = () => {
		const finalRole = editRole.trim() || role
		setEditRole(finalRole)
		onRoleChange(role, finalRole)
		setIsEditingRole(false)
	}

	const handleRoleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleRoleBlur()
		} else if (e.key === 'Escape') {
			setEditRole(role)
			setIsEditingRole(false)
		}
	}

	return (
		<div className='flex flex-col gap-2.5'>
			{/* 역할 태그 + 인원 수 (모집 원하는 전체 인원) */}
			<div className='flex items-center gap-0.5'>
				<HamburgerIcon className='w-6 h-6 px-1.5 py-2 text-neutral-300' />

				{isEditingRole ? (
					<input
						type='text'
						value={editRole}
						onChange={handleRoleInputChange}
						onBlur={handleRoleBlur}
						onKeyDown={handleRoleKeyDown}
						autoFocus
						className='w-24 h-7 px-2 text-center body-2 font-medium text-neutral-800 border border-primary-400-normal rounded-4 outline-none'
					/>
				) : (
					<button type='button' onClick={handleRoleClick} className='cursor-pointer'>
						<RoleTag role={role} showTotal={false} />
					</button>
				)}

				{isEditingCount ? (
					<div className='flex items-center'>
						<input
							type='text'
							inputMode='numeric'
							value={editCount || ''}
							onChange={handleCountChange}
							onBlur={handleCountBlur}
							onKeyDown={handleCountKeyDown}
							autoFocus
							className='w-10 h-6 text-center body-1 text-neutral-900 border border-primary-400-normal rounded-4 outline-none'
						/>
						<span className='body-1 text-neutral-900'>명</span>
					</div>
				) : (
					<button
						type='button'
						onClick={handleCountClick}
						className='body-1 text-neutral-900 hover:text-primary-400-normal hover:underline cursor-pointer font-medium ml-2'
					>
						{targetCount}명
					</button>
				)}
			</div>

			{/* 멤버 목록 (2열 그리드) */}
			<div
				ref={setNodeRef}
				className={`grid grid-cols-2 gap-3 min-h-16 p-2 rounded-12 transition-colors ${isOver ? 'bg-neutral-100' : ''}`}
			>
				{members.map((member, index) => (
					<DraggableMemberCard key={member.id} member={member} index={index} role={role} />
				))}
			</div>
		</div>
	)
}

const PartSettingsModal = () => {
	const { isOpen, teamMembersByRole, close } = usePartSettingsModal()
	const { setTeamMembersByRole } = useTeamMembersStore()
	const [parts, setParts] = useState<TeamMembersByRole[]>(teamMembersByRole)
	const modalRef = useRef<HTMLDivElement>(null)

	// 모달 바깥 클릭 시 닫기
	useClickOutside(modalRef, close, isOpen)

	// 모달이 열리지 않은 경우 렌더링하지 않음
	if (!isOpen) return null

	// (버튼 핸들러) 새 파트 추가
	const handleAddPart = () => {
		const newPart: TeamMembersByRole = {
			role: '새 파트',
			color: 'gray',
			targetCount: 0,
			members: [],
		}
		setParts([...parts, newPart])
	}

	// (버튼 핸들러) 저장
	const handleSave = () => {
		setTeamMembersByRole(parts)
		close()
	}

	// (팀원 드래그 핸들러) 파트 변경
	const handleRoleChange = (oldRole: string, newRole: string) => {
		setParts(prevParts => prevParts.map(part => (part.role === oldRole ? { ...part, role: newRole } : part)))
	}

	// (팀원 드래그 핸들러) 희망 모집인원 변경
	const handleCountChange = (role: string, count: number) => {
		setParts(prevParts => prevParts.map(part => (part.role === role ? { ...part, targetCount: count } : part)))
	}

	// (팀원 드래그 핸들러) 드래그 종료
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (!over) return

		const memberId = active.id as string
		const targetId = over.id as string

		// 슬롯에 드롭한 경우
		if (targetId.startsWith('slot-')) {
			const [, targetRole, targetIndexStr] = targetId.split('-')
			const targetIndex = parseInt(targetIndexStr, 10)

			setParts(prevParts => {
				const newParts = prevParts.map(part => ({
					...part,
					members: [...part.members],
				}))

				// 드래그한 멤버가 속한 파트 찾기
				let sourcePart: TeamMembersByRole | undefined
				let sourceIndex = -1
				let movedMember: TeamMember | undefined

				newParts.forEach(part => {
					const idx = part.members.findIndex(m => m.id === memberId)
					if (idx !== -1) {
						sourcePart = part
						sourceIndex = idx
						movedMember = { ...part.members[idx] }
					}
				})

				if (!movedMember || !sourcePart) return prevParts

				const targetPart = newParts.find(part => part.role === targetRole)
				if (!targetPart) return prevParts

				// 같은 파트 내에서 순서 변경
				if (sourcePart.role === targetRole) {
					// 자기 자신 위에 드롭하면 무시
					if (sourceIndex === targetIndex) return prevParts

					// 멤버 제거 후 새 위치에 삽입
					sourcePart.members.splice(sourceIndex, 1)
					sourcePart.members.splice(targetIndex, 0, movedMember)

					// 첫 번째 위치로 이동하면 리더로 설정
					sourcePart.members = sourcePart.members.map((m, idx) => ({
						...m,
						isLeader: idx === 0,
					}))
				} else {
					// 다른 파트로 이동
					sourcePart.members.splice(sourceIndex, 1)

					// 원래 파트에서 첫 번째 멤버를 리더로 설정
					if (sourcePart.members.length > 0) {
						sourcePart.members = sourcePart.members.map((m, idx) => ({
							...m,
							isLeader: idx === 0,
						}))
					}

					// 새 파트에 삽입
					targetPart.members.splice(targetIndex, 0, {
						...movedMember,
						part: targetPart.role,
					})

					// 새 파트에서 첫 번째 멤버를 리더로 설정
					targetPart.members = targetPart.members.map((m, idx) => ({
						...m,
						isLeader: idx === 0,
					}))
				}

				return newParts
			})
			return
		}

		// 파트 영역에 드롭한 경우, 맨 뒤에 추가
		const targetRole = targetId

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

					// 원래 파트에서 첫 번째 멤버를 리더로 설정
					if (part.members.length > 0) {
						part.members = part.members.map((m, idx) => ({
							...m,
							isLeader: idx === 0,
						}))
					}
				}
			})

			// 대상 파트에 멤버 추가
			if (movedMember) {
				const targetPart = newParts.find(part => part.role === targetRole)
				if (targetPart) {
					const isFirstMember = targetPart.members.length === 0
					targetPart.members.push({
						...movedMember,
						part: targetPart.role,
						isLeader: isFirstMember,
					})

					// 첫 번째 멤버를 리더로 설정
					targetPart.members = targetPart.members.map((m, idx) => ({
						...m,
						isLeader: idx === 0,
					}))
				}
			}

			return newParts
		})
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
			<div ref={modalRef} className='w-177.5 max-h-[90vh] bg-neutral-000 rounded-16 flex flex-col pl-14 pr-2.5'>
				{/* 헤더 */}
				<div className='flex items-center justify-between pt-12 pb-6'>
					<h2 className='heading-2 font-bold text-neutral-900'>파트 설정 및 배치 인원</h2>

					<Button color='text' className='body-1 text-neutral-500' onClick={handleAddPart}>
						+ 파트 추가
					</Button>
				</div>

				{/* 컨텐츠 */}
				<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<div className='flex-1 overflow-y-auto'>
						<div className='flex flex-col gap-11.5 pb-10.5'>
							{parts.map(({ role, members, targetCount }) => (
								<DroppablePartSection
									key={role}
									role={role}
									members={members}
									targetCount={targetCount ?? members.length}
									onCountChange={handleCountChange}
									onRoleChange={handleRoleChange}
								/>
							))}
						</div>
					</div>
				</DndContext>

				{/* 푸터 */}
				<div className='flex items-center justify-center gap-3 pb-12 pt-2'>
					<Button color='mypage1' onClick={close} className='w-40 h-12'>
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
