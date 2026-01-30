import { useState } from 'react'
import SearchIcon from '@/assets/icons/sidebar/search.svg?react'
import MemberDeleteIcon from '@/assets/icons/sidebar/member-delete.svg?react'
import ChatSidebar from './ChatSidebar'

interface Contact {
	id: number
	name: string
	role: string
	profileImage?: string
}

interface ChatMemberSelectModalProps {
	onClose: () => void
	onConfirm: (selectedContacts: Contact[]) => void
}

const ChatMemberSelectModal = ({ onClose, onConfirm }: ChatMemberSelectModalProps) => {
	const [selectedContacts, setSelectedContacts] = useState<number[]>([])
	const [searchQuery, setSearchQuery] = useState('')

	// 역할별로 그룹화된 멤버 데이터
	const membersByRole: Record<string, Contact[]> = {
		PM: [
			{ id: 1, name: '닉네임', role: 'Part', profileImage: 'https://placehold.co/44x44' },
			{ id: 2, name: '닉네임', role: 'Part', profileImage: 'https://placehold.co/44x44' },
		],
		Design: [
			{ id: 3, name: '닉네임', role: 'Part', profileImage: 'https://placehold.co/44x44' },
			{ id: 4, name: '닉네임', role: 'Part', profileImage: 'https://placehold.co/44x44' },
		],
		Frontend: [
			{ id: 5, name: '닉네임', role: 'Part', profileImage: 'https://placehold.co/44x44' },
			{ id: 6, name: '닉네임', role: 'Part', profileImage: 'https://placehold.co/44x44' },
		],
		Backend: [
			{ id: 7, name: '닉네임', role: 'Part', profileImage: 'https://placehold.co/44x44' },
			{ id: 8, name: '닉네임', role: 'Part', profileImage: 'https://placehold.co/44x44' },
		],
	}

	const allMembers = Object.values(membersByRole).flat()
	const selectedMembers = allMembers.filter(member => selectedContacts.includes(member.id))

	const handleToggleContact = (contactId: number) => {
		setSelectedContacts(prev => (prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]))
	}

	const handleRemoveSelected = (contactId: number) => {
		setSelectedContacts(prev => prev.filter(id => id !== contactId))
	}

	const handleConfirm = () => {
		const selected = allMembers.filter(member => selectedContacts.includes(member.id))
		onConfirm(selected)
	}

	const filteredMembersByRole = Object.entries(membersByRole).reduce((acc, [role, members]) => {
		const filtered = members.filter(member =>
			member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.role.toLowerCase().includes(searchQuery.toLowerCase())
		)
		if (filtered.length > 0) {
			acc[role] = filtered
		}
		return acc
	}, {} as Record<string, Contact[]>)

	return (
		<div className='flex items-start h-full'>
			{/* 사이드바 */}
			<ChatSidebar
				unreadCount={0}
				onMessageClick={() => {}}
				onCloudClick={() => {}}
				onSettingsClick={() => {}}
			/>
			{/* 메인 컨텐츠 */}
			<div className='w-[380px] h-full bg-[#f7f7fa] rounded-2xl rounded-l-none border-l-0 border border-neutral-200 z-50 overflow-hidden relative flex flex-col'>
				{/* 헤더 */}
				<div className='bg-white border-b border-[#f0f0f6] h-[50px] px-[22px] py-[11px] flex items-center justify-center shrink-0'>
					<div className='flex gap-1.5 items-center'>
						<div className='max-w-[172px] text-neutral-900 title-3 font-semibold leading-[1.4] truncate'>
							대화 상대 선택
						</div>
						{selectedContacts.length > 0 && (
							<div className='text-neutral-500 body-1 font-medium leading-normal'>
								{selectedContacts.length}
							</div>
						)}
					</div>
				</div>

				{/* 검색 바 */}
				<div className='bg-white border-b border-[#f0f0f6] h-[50px] px-3 py-2.5 flex items-center shrink-0'>
					<div className='w-full h-[34px] px-2 bg-neutral-50 border border-neutral-100 rounded-md flex items-center gap-2'>
						<SearchIcon className='w-7 h-7 text-neutral-300 shrink-0' />
							<input
								type='text'
								placeholder='이름으로 검색'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								className='flex-1 h-full bg-transparent text-neutral-900 body-1 font-medium tracking-[-0.26px] leading-normal placeholder:text-neutral-300 outline-none'
							/>
					</div>
				</div>

				{/* 멤버 리스트 */}
				<div className='flex-1 overflow-y-auto py-3 min-h-0 notification-scrollbar'>
					<div className='flex flex-col gap-3'>
						{Object.entries(filteredMembersByRole).map(([role, members]) => (
							<div key={role} className='flex flex-col'>
								{/* 역할 헤더 */}
								<div className='px-5 py-1.5 flex items-center justify-start'>
									<div className='text-neutral-500 body-2 font-medium leading-normal'>
										{role}
									</div>
								</div>
								{/* 멤버 리스트 */}
								<div className='flex flex-col'>
									{members.map(member => (
										<div
											key={member.id}
											className='flex gap-3 items-center px-5 py-2 cursor-pointer hover:bg-neutral-50'
											onClick={() => handleToggleContact(member.id)}
										>
											{/* 프로필 이미지 */}
											<div className='w-11 h-11 shrink-0'>
												{member.profileImage ? (
													<img
														src={member.profileImage}
														alt={member.name}
														className='w-11 h-11 rounded-full object-cover'
													/>
												) : (
													<div className='w-11 h-11 rounded-full bg-neutral-200' />
												)}
											</div>
											{/* 이름과 역할 */}
											<div className='flex-1 flex gap-1 items-center min-w-0'>
												<div className='text-neutral-900 title-3 font-semibold leading-[1.4]'>
													{member.name}
												</div>
												<div className='text-neutral-500 body-1 font-medium leading-normal'>
													{member.role}
												</div>
											</div>
											{/* 체크박스 */}
											<div className='shrink-0 relative w-5 h-5'>
												<input
													type='checkbox'
													checked={selectedContacts.includes(member.id)}
													onChange={() => handleToggleContact(member.id)}
													onClick={(e) => e.stopPropagation()}
													className='w-full h-full px-1 py-1.5 rounded-md border-[1.3px] border-neutral-300 cursor-pointer
														checked:bg-primary-500-normal checked:border-primary-500-normal
														appearance-none relative overflow-hidden'
												/>
												{selectedContacts.includes(member.id) && (
													<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none'>
														<svg
															width="10"
															height="6"
															viewBox="0 0 8 5"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
															className="text-white"
														>
															<path
																d="M0.5 2L3 4.5L7.5 0.5"
																stroke="white"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* 선택된 멤버 태그 영역 */}
				{selectedMembers.length > 0 && (
					<div className='bg-white border border-[#f0f0f6] px-[12px] py-[10px] h-[82px] flex flex-col gap-[6px] shrink-0 shadow-drop-neutral-3 overflow-hidden'>
						<div className='flex flex-wrap gap-[6px] overflow-y-auto notification-scrollbar'>
							{selectedMembers.map(member => (
								<div
									key={member.id}
									className='bg-[#dadae8] rounded-100 pl-[2px] pr-[4px] py-[2px] flex items-center gap-[6px]'
								>
									{/* 프로필 이미지 (작은 사이즈) */}
									<div className='w-6 h-6 shrink-0'>
										{member.profileImage ? (
											<img
												src={member.profileImage}
												alt={member.name}
												className='w-6 h-6 rounded-full object-cover'
											/>
										) : (
											<div className='w-6 h-6 rounded-full bg-neutral-200' />
										)}
									</div>
									{/* 이름 */}
									<div className='text-neutral-700 body-2 font-medium leading-[1.4]'>
										{member.name}
									</div>
									{/* 닫기 버튼 */}
									<button
										onClick={(e) => {
											e.stopPropagation()
											handleRemoveSelected(member.id)
										}}
										className='w-4 h-4 flex items-center justify-center shrink-0'
									>
										<MemberDeleteIcon className='w-4 h-4 text-neutral-700' />
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{/* 하단 버튼 */}
				<div className='bg-white px-[41px] pt-3.5 pb-[19px] flex gap-2 items-center shrink-0'>
					<button
						onClick={onClose}
						className='w-[140px] h-9 px-2.5 flex items-center justify-center bg-neutral-50 border-[1.5px] border-neutral-200 rounded-md text-neutral-900 button-1 font-semibold leading-[1.4]'
					>
						취소
					</button>
					<button
						onClick={handleConfirm}
						disabled={selectedContacts.length === 0}
						className={`w-[140px] h-9 px-2.5 flex items-center justify-center rounded-md button-1 font-semibold leading-[1.4] ${
							selectedContacts.length > 0
								? 'bg-primary-400-normal text-neutral-50'
								: 'bg-primary-200-light text-neutral-50'
						}`}
					>
						다음
					</button>
				</div>
			</div>
		</div>
	)
}

export default ChatMemberSelectModal
