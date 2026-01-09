import { useState } from 'react'

interface SideNewChatModalProps {
	onClose: () => void
	onSelectContact: () => void
}

const SideNewChatModal = ({ onClose, onSelectContact }: SideNewChatModalProps) => {
	const [selectedChatType, setSelectedChatType] = useState<'general' | 'team' | null>(null)

	return (
		<div className='w-[360px] bg-white rounded-2xl border border-neutral-200 z-50 overflow-hidden shadow-drop-neutral-1 flex flex-col h-[500px]'>
			{/* 헤더 */}
			<div className='h-12 border-b border-neutral-200 flex items-center justify-between px-4 shrink-0'>
				<button onClick={onClose}>X</button>
				<span>새로운 채팅</span>
				<div className='w-4' />
			</div>

			{/* 채팅 타입 선택 */}
			<div className='p-4 flex gap-3'>
				<button
					onClick={() => setSelectedChatType('general')}
					className={`flex-1 h-20 border rounded-lg flex flex-col items-center justify-center gap-2 ${
						selectedChatType === 'general' ? 'border-primary-500-normal bg-primary-50-light' : 'border-neutral-200'
					}`}
				>
					<span>💬</span>
					<span className='text-sm'>일반채팅</span>
				</button>
				<button
					onClick={() => setSelectedChatType('team')}
					className={`flex-1 h-20 border rounded-lg flex flex-col items-center justify-center gap-2 ${
						selectedChatType === 'team' ? 'border-primary-500-normal bg-primary-50-light' : 'border-neutral-200'
					}`}
				>
					<span>🚩</span>
					<span className='text-sm'>팀채팅</span>
				</button>
			</div>

			{/* 다음 버튼 */}
			{selectedChatType && (
				<div className='px-4 pb-4'>
					<button
						onClick={onSelectContact}
						className='w-full h-10 bg-primary-500-normal text-white rounded-lg'
					>
						다음
					</button>
				</div>
			)}
		</div>
	)
}

export default SideNewChatModal

