import { useEffect } from 'react'
import PersonTagChip from '@/components/mission-modal/PersonTagChip'
import { useTeamStore } from '@/stores/teamStore'
import type { Assignees } from '@/types/api/assignees'

interface ProfileModalProps {
	isOpen: boolean
	onClose: () => void
	assignees: Assignees[]
}

const ProfileModal = ({ isOpen, onClose, assignees }: ProfileModalProps) => {
	const persons = useTeamStore(state => state.persons)

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
			return () => document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	const getRoleId = (userId: number) => persons.find(p => p.id === userId)?.roleId ?? 0

	return (
		<div
			className='absolute top-full -right-2.5 mt-2 z-50 min-w-32 bg-white rounded-12 shadow-drop-neutral-3 px-3.5 pt-2.5 pb-3 flex flex-col gap-2.5 border border-neutral-100'
			onClick={e => e.stopPropagation()}
		>
			{assignees.length === 0 ? (
				<p className='body-2 text-neutral-500 py-2'>담당자가 없습니다.</p>
			) : (
				assignees.map(assignee => (
					<PersonTagChip
						key={assignee.user_id}
						personName={assignee.nickname}
						roleId={getRoleId(assignee.user_id)}
						personImage={assignee.profile_image_url ?? ''}
						state='default'
					/>
				))
			)}
		</div>
	)
}

export default ProfileModal
