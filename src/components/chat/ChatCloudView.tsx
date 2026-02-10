import { useState, useEffect } from 'react'
import ChatSidebar from './ChatSidebar'
import ChatHeader from './ChatHeader'
import CloudImageViewer from './CloudImageViewer'
import { getChatRooms, getChatRoomAlbum } from '@/api/chat'
import type { ChatRoomAlbumDetailDto, ChatRoomListDto } from '@/types/api/chat'
import { useQuery } from '@tanstack/react-query'

interface CloudRoom {
	id: number
	name: string
	files: Array<{
		file_name: string
		file_url: string
		created_at: string
	}>
}

interface ChatCloudViewProps {
	onBack?: () => void
	projectId?: number
}

const ChatCloudView = ({ onBack, projectId = 1 }: ChatCloudViewProps) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const [cloudRooms, setCloudRooms] = useState<CloudRoom[]>([])
	const [isLoading, setIsLoading] = useState(false)

	// 채팅방 목록 조회
	const { data: chatRoomsData } = useQuery({
		queryKey: ['chatRooms', projectId],
		queryFn: () => getChatRooms(projectId),
		enabled: !!projectId,
	})

	// 각 채팅방의 앨범 데이터 가져오기
	useEffect(() => {
		const loadAlbums = async () => {
			if (!chatRoomsData?.body) return

			setIsLoading(true)
			try {
				const rooms = chatRoomsData.body
				const albumPromises = rooms.map(async (room) => {
					const roomId = (room as any).room_id || room.roomId
					if (!roomId) return null

					try {
						const albumResponse = await getChatRoomAlbum(roomId, { page: 0, size: 6 })
						if (albumResponse.body && albumResponse.body.files.length > 0) {
							return {
								id: roomId,
								name: albumResponse.body.room_name || (room as any).room_name || room.roomName || '',
								files: albumResponse.body.files,
							}
						}
					} catch (error) {
						console.error(`채팅방 ${roomId} 앨범 로드 실패:`, error)
					}
					return null
				})

				const albums = await Promise.all(albumPromises)
				const validAlbums = albums.filter((album): album is CloudRoom => album !== null)
				setCloudRooms(validAlbums)
			} catch (error) {
				console.error('앨범 로드 실패:', error)
			} finally {
				setIsLoading(false)
			}
		}

		loadAlbums()
	}, [chatRoomsData])

	const renderGrid = (files: CloudRoom['files']) => {
		// 최대 6개까지만 표시 (2x3 그리드)
		const displayFiles = files.slice(0, 6)
		const emptySlots = 6 - displayFiles.length

		return (
			<div className="grid grid-cols-3 gap-[2px] w-[340px]">
				{displayFiles.map((file, index) => (
					<button
						key={`${file.file_url}-${index}`}
						onClick={() => setSelectedImage(file.file_url)}
						className="w-[112px] h-[112px] rounded-md cursor-pointer hover:opacity-80 transition-opacity overflow-hidden relative"
					>
						<img
							src={file.file_url}
							alt={file.file_name}
							className="w-full h-full object-cover"
							onError={(e) => {
								// 이미지 로드 실패 시 플레이스홀더 표시
								const target = e.target as HTMLImageElement
								target.src = 'https://placehold.co/112x112'
							}}
						/>
					</button>
				))}
				{/* 빈 슬롯 채우기 */}
				{Array.from({ length: emptySlots }).map((_, index) => (
					<div
						key={`empty-${index}`}
						className="w-[112px] h-[112px] bg-neutral-200 rounded-md"
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
						{isLoading ? (
							<div className="flex justify-center items-center py-8">
								<span className="text-neutral-500">앨범을 불러오는 중...</span>
							</div>
						) : cloudRooms.length === 0 ? (
							<div className="flex justify-center items-center py-8">
								<span className="text-neutral-500">앨범이 없습니다.</span>
							</div>
						) : (
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
										{renderGrid(room.files)}
									</div>
								))}
							</div>
						)}
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
