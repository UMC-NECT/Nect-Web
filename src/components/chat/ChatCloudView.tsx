import { useState } from 'react'
import ChatSidebar from './ChatSidebar'
import ChatHeader from './ChatHeader'
import CloudImageViewer from './CloudImageViewer'

interface CloudRoom {
	id: string
	name: string
	items: number // 그리드 아이템 개수 (6개면 2x3, 3개면 1x3)
}

interface ChatCloudViewProps {
	onBack?: () => void
}

const ChatCloudView = ({ onBack }: ChatCloudViewProps) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null)

	// 예시 데이터
	const cloudRooms: CloudRoom[] = [
		{ id: '1', name: '넥트 전체방', items: 6 }, // 2x3 그리드
		{ id: '2', name: '디자인팀', items: 3 }, // 1x3 그리드
		{ id: '3', name: '디자인팀', items: 3 }, // 1x3 그리드
		{ id: '4', name: '디자인팀', items: 3 }, // 1x3 그리드
	]

	const renderGrid = (items: number) => {
		return (
			<div className="grid grid-cols-3 gap-[2px] w-[340px]">
				{Array.from({ length: items }).map((_, index) => (
					<button
						key={index}
						onClick={() => setSelectedImage('https://placehold.co/432x300')}
						className="w-[112px] h-[112px] bg-neutral-200 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
					/>
				))}
			</div>
		)
	}

	return (
		<div className="flex items-start h-full relative">
			{/* 사이드바 */}
			<ChatSidebar
				unreadCount={0}
				onMessageClick={onBack}
				onCloudClick={() => {}}
				onSettingsClick={() => {}}
			/>
			{/* 클라우드 뷰 */}
			<div className="w-[380px] h-full bg-[#f7f7fa] rounded-2xl rounded-l-none border-l-0 border border-neutral-200 z-50 overflow-hidden relative flex flex-col">
				{/* 헤더 */}
				<ChatHeader
					type="list"
					title="클라우드"
				/>

				{/* 메인 컨텐츠 영역 */}
				<div className="flex-1 overflow-y-auto overflow-x-hidden notification-scrollbar relative">
					{/* 컨텐츠 */}
					<div className="absolute p-5 w-full">
						<div className="flex flex-col gap-[24px]">
							{cloudRooms.map((room) => (
								<div key={room.id} className="flex flex-col gap-[8px]">
									{/* 섹션 헤더 */}
									<div className="flex items-center justify-between px-[6px]">
										<div className="text-neutral-900 body-1 font-semibold leading-normal w-[73px]">
											{room.name}
										</div>
										<button className="h-[17px] w-[31px] text-neutral-500 caption-1 font-medium leading-[1.4] tracking-[-0.24px]">
											더보기
										</button>
									</div>
									{/* 그리드 */}
									{renderGrid(room.items)}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* 이미지 뷰어 (별도 패널) */}
			{selectedImage && (
				<div className="absolute w-[436px] h-[336px] top-[15%] left-[430px] flex items-center justify-center">
					<CloudImageViewer
						imageUrl={selectedImage}
						onClose={() => setSelectedImage(null)}
						onDownload={() => {
							console.log('다운로드:', selectedImage)
							// TODO: 다운로드 로직 구현
						}}
						onForward={() => {
							console.log('전달:', selectedImage)
							// TODO: 전달 로직 구현
						}}
						onDelete={() => {
							console.log('삭제:', selectedImage)
							// TODO: 삭제 로직 구현
							setSelectedImage(null)
						}}
					/>
				</div>
			)}
		</div>
	)
}

export default ChatCloudView
