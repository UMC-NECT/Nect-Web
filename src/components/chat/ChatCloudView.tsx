import { useState } from 'react'
import ChatSidebar from './ChatSidebar'
import ChatHeader from './ChatHeader'
import CloudImageViewer from './CloudImageViewer'
import { getProjectAlbums, downloadChatFile, deleteChatFile } from '@/api/chat'
import { useQuery, useQueryClient } from '@tanstack/react-query'

interface CloudRoom {
	id: number
	name: string
	files: Array<{
		file_id: number
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
	const [selectedFile, setSelectedFile] = useState<{ roomId: number; file: CloudRoom['files'][0] } | null>(null)
	const queryClient = useQueryClient()

	// 프로젝트 앨범 조회 (채팅방별 파일 목록)
	const { data: albumsData, isLoading } = useQuery({
		queryKey: ['projectAlbums', projectId],
		queryFn: () => getProjectAlbums(projectId, 6), // limit: 채팅방별 파일 조회 개수
		enabled: !!projectId,
	})

	// API 응답을 CloudRoom 형식으로 변환
	const cloudRooms: CloudRoom[] = (albumsData?.body || [])
		.filter((room) => room.files && room.files.length > 0)
		.map((room) => ({
			id: room.room_id,
			name: room.room_name,
			files: room.files,
		}))

	const renderGrid = (files: CloudRoom['files'], roomId: number) => {
		// 이미지 파일만 표시 (API에서 limit만큼 받아오므로 그대로 사용)
		const displayFiles = files.filter((file) => {
			const ext = file.file_name.split('.').pop()?.toLowerCase()
			return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext || '')
		})

		return (
			<div className="grid grid-cols-3 gap-[2px] w-[340px]">
				{displayFiles.map((file, index) => (
					<button
						key={`${file.file_url}-${index}`}
						onClick={() => setSelectedFile({ roomId, file })}
						className="w-[112px] h-[112px] rounded-md cursor-pointer hover:opacity-80 transition-opacity overflow-hidden relative"
					>
						<img
							src={file.file_url}
							alt={file.file_name}
							className="w-full h-full object-cover"
							onError={(e) => {
								const target = e.target as HTMLImageElement
								target.src = 'https://placehold.co/112x112'
							}}
						/>
					</button>
				))}
			</div>
		)
	}

	return (
		<div className="flex items-start h-full relative">
			{/* 사이드바 */}
			<ChatSidebar
				unreadCount={0}
				selectedView="cloud"
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
					showActions={false}
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
										{renderGrid(room.files, room.id)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* 이미지 뷰어 (별도 패널) */}
			{selectedFile && (
				<div className="absolute w-[436px] h-[336px] top-[15%] left-[430px] flex items-center justify-center">
					<CloudImageViewer
						imageUrl={selectedFile.file.file_url}
						onClose={() => setSelectedFile(null)}
						onDownload={async () => {
							if (!selectedFile.file.file_id) {
								console.error('파일 ID가 없습니다.')
								return
							}

							try {
								await downloadChatFile(selectedFile.file.file_id, selectedFile.file.file_name)
							} catch (error) {
								console.error('파일 다운로드 실패:', error)
								alert('파일 다운로드에 실패했습니다.')
							}
						}}
						onForward={() => {
							// TODO: 전달 로직 구현
						}}
						onDelete={async () => {
							if (!selectedFile.file.file_id) {
								console.error('파일 ID가 없습니다.')
								return
							}

							if (!confirm('정말 이 파일을 삭제하시겠습니까?')) {
								return
							}

							try {
								await deleteChatFile(selectedFile.file.file_id)
								// 앨범 목록 새로고침
								queryClient.invalidateQueries({ queryKey: ['projectAlbums', projectId] })
								setSelectedFile(null)
							} catch (error) {
								console.error('파일 삭제 실패:', error)
								alert('파일 삭제에 실패했습니다.')
							}
						}}
					/>
				</div>
			)}
		</div>
	)
}

export default ChatCloudView
