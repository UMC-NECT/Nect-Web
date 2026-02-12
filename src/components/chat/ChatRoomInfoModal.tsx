import { useState } from 'react'
import ChatSidebar from './ChatSidebar'
import ChatActionButtons from './ChatActionButtons'

interface ChatRoomInfoModalProps {
	selectedMembers?: Array<{ id: number; name: string; profileImage?: string }>
	onClose: () => void
	onConfirm: (roomName: string, selectedAvatar: number) => void
}

const ChatRoomInfoModal = ({ selectedMembers = [], onClose, onConfirm }: ChatRoomInfoModalProps) => {
	const [roomName, setRoomName] = useState('')

	// 선택된 멤버의 프로필 이미지를 사용 (최대 4개)
	const displayMembers = selectedMembers.slice(0, 4)
	const memberCount = selectedMembers.length

	const handleConfirm = () => {
		if (roomName.trim()) {
			// 아바타 선택 기능은 현재 사용하지 않으므로 기본값 1 사용
			onConfirm(roomName.trim(), 1)
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
						{/* 프로필 이미지 레이아웃 */}
						<div className='flex items-center justify-center p-[2.273px] w-[100px] h-[100px] relative'>
							<div className='relative w-[100px] h-[100px]'>
								{memberCount >= 4 ? (
									// 4명 이상: 2x2 그리드
									displayMembers.map((member, index) => {
										const positions = [
											{ left: '0.45px', top: '0.45px' }, // 좌상
											{ left: '48.89px', top: '0' }, // 우상
											{ left: '0', top: '48.89px' }, // 좌하
											{ left: '48.89px', top: '48.89px' }, // 우하
										]
										const pos = positions[index]
										return (
											<div
												key={member.id}
												className={`absolute w-[50px] h-[50px] rounded-full border-2 border-white overflow-hidden bg-neutral-300`}
												style={{ left: pos.left, top: pos.top }}
											>
												{member.profileImage ? (
													<img
														src={member.profileImage}
														alt={member.name}
														className='w-full h-full object-cover'
													/>
												) : (
													<div className='w-full h-full bg-neutral-300' />
												)}
											</div>
										)
									})
								) : memberCount === 3 ? (
									// 3명: 삼각형 배치
									displayMembers.map((member, index) => {
										const positions = [
											{ left: '48.89px', top: '19.51px' }, // 오른쪽 아래
											{ left: '10.8px', top: '0' }, // 중앙 위
											{ left: '0', top: '19.51px' }, // 왼쪽 아래
										]
										const pos = positions[index]
										return (
											<div
												key={member.id}
												className={`absolute w-[50px] h-[50px] rounded-full border-2 border-white overflow-hidden bg-neutral-300`}
												style={{ left: pos.left, top: pos.top }}
											>
												{member.profileImage ? (
													<img
														src={member.profileImage}
														alt={member.name}
														className='w-full h-full object-cover'
													/>
												) : (
													<div className='w-full h-full bg-neutral-300' />
												)}
											</div>
										)
									})
								) : memberCount === 2 ? (
									// 2명: 대각선 배치
									displayMembers.map((member, index) => {
										const positions = [
											{ left: '0', top: '0', zIndex: 0 }, // 첫 번째: 왼쪽 위
											{ left: '32px', top: '32px', zIndex: 10 }, // 두 번째: 오른쪽 아래
										]
										const pos = positions[index]
										return (
											<div
												key={member.id}
												className={`absolute w-[50px] h-[50px] rounded-full border-2 border-white overflow-hidden bg-neutral-300`}
												style={{ left: pos.left, top: pos.top, zIndex: pos.zIndex }}
											>
												{member.profileImage ? (
													<img
														src={member.profileImage}
														alt={member.name}
														className='w-full h-full object-cover'
													/>
												) : (
													<div className='w-full h-full bg-neutral-300' />
												)}
											</div>
										)
									})
								) : memberCount === 1 ? (
									// 1명: 단일 이미지
									<div className='absolute w-[50px] h-[50px] rounded-full border-2 border-white overflow-hidden bg-neutral-300 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
										{displayMembers[0]?.profileImage ? (
											<img
												src={displayMembers[0].profileImage}
												alt={displayMembers[0].name}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='w-full h-full bg-neutral-300' />
										)}
									</div>
								) : null}
							</div>
						</div>

						{/* 입력 필드 영역 */}
						<div className='flex flex-col items-end w-full'>
							<div className='bg-white border border-neutral-100 rounded-md p-2 w-full flex items-center justify-center'>
								<input
									type='text'
									value={roomName}
									onChange={(e) => setRoomName(e.target.value)}
									placeholder={selectedMembers.length > 0 ? selectedMembers.map(m => m.name).join(', ') : '방 이름을 입력하세요'}
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
