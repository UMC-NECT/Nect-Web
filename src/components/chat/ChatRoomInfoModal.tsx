import { useState } from 'react'
import ChatSidebar from './ChatSidebar'
import ChatActionButtons from './ChatActionButtons'

interface ChatRoomInfoModalProps {
	onClose: () => void
	onConfirm: (roomName: string, selectedAvatar: number) => void
}

const ChatRoomInfoModal = ({ onClose, onConfirm }: ChatRoomInfoModalProps) => {
	const [roomName, setRoomName] = useState('')
	const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null)

	const avatars = [
		{ id: 1, image: 'https://placehold.co/48x48' },
		{ id: 2, image: 'https://placehold.co/48x48' },
		{ id: 3, image: 'https://placehold.co/48x48' },
		{ id: 4, image: 'https://placehold.co/48x48' },
	]

	const handleConfirm = () => {
		if (roomName.trim()) {
			// 아바타가 선택되지 않았으면 기본값 1 사용
			onConfirm(roomName.trim(), selectedAvatar || 1)
		}
	}

	return (
		<div className='flex items-start h-full'>
			{/* 사이드바 */}
			<ChatSidebar
				unreadCount={0}
				selectedView="message"
				onMessageClick={() => {}}
				onCloudClick={() => {}}
				onSettingsClick={() => {}}
			/>
			{/* 메인 컨텐츠 */}
			<div className='w-[380px] h-full bg-[#f7f7fa] rounded-2xl rounded-l-none border-l-0 border border-neutral-200 z-50 overflow-hidden relative flex flex-col'>
				{/* 헤더 */}
				<div className='bg-white border-b border-[#f0f0f6] h-[50px] px-[22px] py-[11px] flex items-center justify-center shrink-0'>
					<div className='flex items-center justify-center h-[30px] w-full'>
						<div className='max-w-[172px] text-neutral-900 title-3 font-semibold leading-[1.4] truncate'>
							메세지방 정보 설정
						</div>
					</div>
				</div>

				{/* 메인 컨텐츠 영역 */}
				<div className='flex-1 flex flex-col items-start overflow-y-auto notification-scrollbar'>
					<div className='flex flex-col gap-[30px] items-center px-[28px] py-[82px] w-full flex-1 justify-center'>
						{/* 아바타 선택 영역 */}
						<div className='flex items-center justify-center p-[2.273px] w-[100px] h-[100px] relative'>
							<div className='relative w-[100px] h-[100px]'>
								{/* 아바타 1 (좌상) */}
								<div
									className={`absolute w-[50px] h-[50px] rounded-full border-2 border-white overflow-hidden cursor-pointer bg-neutral-300 ${
										selectedAvatar === 1 ? 'ring-2 ring-primary-400-normal' : ''
									}`}
									style={{ left: '0.45px', top: '0.45px' }}
									onClick={() => setSelectedAvatar(1)}
								>
									{avatars[0] && (
										<img
											src={avatars[0].image}
											alt='Avatar 1'
											className='w-full h-full object-cover'
										/>
									)}
								</div>
								{/* 아바타 2 (우상) */}
								<div
									className={`absolute w-[50px] h-[50px] rounded-full border-2 border-white overflow-hidden cursor-pointer bg-neutral-300 ${
										selectedAvatar === 2 ? 'ring-2 ring-primary-400-normal' : ''
									}`}
									style={{ left: '48.89px', top: '0' }}
									onClick={() => setSelectedAvatar(2)}
								>
									{avatars[1] && (
										<img
											src={avatars[1].image}
											alt='Avatar 2'
											className='w-full h-full object-cover'
										/>
									)}
								</div>
								{/* 아바타 3 (좌하) */}
								<div
									className={`absolute w-[50px] h-[50px] rounded-full border-2 border-white overflow-hidden cursor-pointer bg-neutral-300 ${
										selectedAvatar === 3 ? 'ring-2 ring-primary-400-normal' : ''
									}`}
									style={{ left: '0', top: '48.89px' }}
									onClick={() => setSelectedAvatar(3)}
								>
									{avatars[2] && (
										<img
											src={avatars[2].image}
											alt='Avatar 3'
											className='w-full h-full object-cover'
										/>
									)}
								</div>
								{/* 아바타 4 (우하) */}
								<div
									className={`absolute w-[50px] h-[50px] rounded-full border-2 border-white overflow-hidden cursor-pointer bg-neutral-300 ${
										selectedAvatar === 4 ? 'ring-2 ring-primary-400-normal' : ''
									}`}
									style={{ left: '48.89px', top: '48.89px' }}
									onClick={() => setSelectedAvatar(4)}
								>
									{avatars[3] && (
										<img
											src={avatars[3].image}
											alt='Avatar 4'
											className='w-full h-full object-cover'
										/>
									)}
								</div>
							</div>
						</div>

						{/* 입력 필드 영역 */}
						<div className='flex flex-col items-end w-full'>
							<div className='bg-white border border-neutral-100 rounded-md p-2 w-full flex items-center justify-center'>
								<input
									type='text'
									value={roomName}
									onChange={(e) => setRoomName(e.target.value)}
									placeholder='닉네임, 닉네임, 닉네임, 닉네임'
									maxLength={30}
									className='flex-1 text-neutral-900 button-1 font-medium leading-[1.4] text-center outline-none placeholder:text-neutral-300'
								/>
							</div>
							<div className='flex items-center justify-center px-[10px] py-1'>
								<div className='text-neutral-400 caption-1 font-medium leading-[1.4] tracking-[-0.26px]'>
									{roomName.length}/30
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 하단 버튼 */}
				<ChatActionButtons
					onCancel={onClose}
					onConfirm={handleConfirm}
					confirmText='완료'
					isConfirmDisabled={roomName.trim() === ''}
					containerClassName='pt-3.5 pb-[19px]'
				/>
			</div>
		</div>
	)
}

export default ChatRoomInfoModal
