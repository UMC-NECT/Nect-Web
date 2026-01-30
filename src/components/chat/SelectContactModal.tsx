import { useState } from 'react'

interface Contact {
	id: number
	name: string
	profileImage?: string
}

interface SelectContactModalProps {
	onClose: () => void
	onConfirm: (selectedContacts: Contact[]) => void
}

const SelectContactModal = ({ onClose, onConfirm }: SelectContactModalProps) => {
	const [selectedContacts, setSelectedContacts] = useState<number[]>([])
	const [searchQuery, setSearchQuery] = useState('')

	const contacts: Contact[] = [
		{ id: 1, name: '시루/강승희' },
		{ id: 2, name: '이방토/이예원' },
	]

	const handleToggleContact = (contactId: number) => {
		setSelectedContacts(prev => (prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]))
	}

	const handleConfirm = () => {
		const selected = contacts.filter(contact => selectedContacts.includes(contact.id))
		onConfirm(selected)
	}

	return (
		<div className='w-[360px] bg-white rounded-2xl border border-neutral-200 z-50 overflow-hidden shadow-drop-neutral-1 flex flex-col h-[500px]'>
			{/* 헤더 */}
			<div className='h-12 border-b border-neutral-200 flex items-center justify-between px-4 shrink-0'>
				<button onClick={onClose}>X</button>
				<span>대화상대 선택</span>
				<button onClick={handleConfirm} disabled={selectedContacts.length === 0}>
					확인
				</button>
			</div>

			{/* 검색 바 */}
			<div className='px-4 py-3 border-b border-neutral-200'>
				<input
					type='text'
					placeholder='팀원 닉네임/이름을 검색'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					className='w-full h-10 px-3 border border-neutral-200 rounded-lg'
				/>
			</div>

			{/* 동료 리스트 */}
			<div className='flex-1 overflow-y-auto p-4'>
				<div className='mb-3 text-sm font-medium text-neutral-600'>동료</div>
				<div className='flex flex-col gap-2'>
					{contacts.map(contact => (
						<div
							key={contact.id}
							className='flex items-center justify-between p-2 hover:bg-neutral-50 rounded-lg cursor-pointer'
							onClick={() => handleToggleContact(contact.id)}
						>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 rounded-full bg-neutral-200' />
								<span className='text-sm'>{contact.name}</span>
							</div>
							<input
								type='radio'
								checked={selectedContacts.includes(contact.id)}
								onChange={() => handleToggleContact(contact.id)}
								className='w-4 h-4'
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default SelectContactModal

