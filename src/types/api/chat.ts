import type { CommonResponse } from "./commonResponse"
export type { CommonResponse } from "./commonResponse"

// ========== 채팅방 관리 (ChatMessageController) ==========

// 1-1. 프로젝트 채팅방 목록 조회
export type ChatRoomListDto = {
	room_id?: number
	room_name?: string
	last_message?: string | null
	last_message_time?: string | null
	unread_count?: number
	// camelCase도 지원 (하위 호환성)
	roomId?: number
	roomName?: string
	lastMessage?: string | null
	lastMessageTime?: string | null
	unreadCount?: number
}

export type ResponseGetChatRoomsDto = CommonResponse<ChatRoomListDto[]>

// 1-2. 채팅방 메시지 조회
export type ChatMessageDto = {
	message_id: number
	user_id: number
	room_id: number
	user_name: string
	profile_image: string | null
	content: string | null
	message_type: "TEXT" | "FILE" | "IMAGE"
	is_pinned: boolean
	created_at: string
	read_count: number | null
	file_info: {
		file_id: number
		file_name: string
		file_url: string
		file_size: number
	} | null
}

export type ChatRoomMessagesResponseDto = CommonResponse<{
	room_id: number
	room_name: string
	member_count: number
	messages: ChatMessageDto[]
	has_next: boolean
}>

// 1-3. 채팅방 나가기
export type ChatRoomLeaveResponseDto = CommonResponse<{
	roomId: number
	leftAt: string
	message: string
}>

// 1-4. 메시지 공지 설정/해제
export type ChatNoticeUpdateRequestDto = {
	isPinned: boolean
}

export type ChatNoticeResponseDto = CommonResponse<{
	messageId: number
	isPinned: boolean
	pinnedAt: string | null
}>

// 1-5. 프로젝트 멤버 조회 (채팅방 생성용)
export type ProjectMemberDto = {
	user_id: number
	name: string
	profile_image_url: string | null
	role: string
}

export type ResponseGetProjectMembersDto = CommonResponse<ProjectMemberDto[]>

// 1-6. 채팅방 메시지 검색
export type ChatMessageSearchResponseDto = CommonResponse<{
	messages: ChatMessageDto[]
	totalCount: number
	currentPage: number
	totalPages: number
}>

// ========== 채팅방 생성/초대 (TeamChatController) ==========

// 2-1. 그룹 채팅방 생성
export type GroupChatRoomCreateRequestDto = {
	projectId: number
	roomName: string
	memberIds: number[]
}

export type ChatRoomResponseDto = CommonResponse<{
	roomId: number
	roomName: string
	createdAt: string
	memberCount: number
}>

// 2-2. 채팅방에 멤버 초대
export type ChatRoomInviteRequestDto = {
	/**
	 * 백엔드 요청 스펙 (camelCase)
	 * 예: { "targetUserIds": [5, 6] }
	 */
	targetUserIds?: number[]
	/**
	 * 기존 snake_case 호환용 (필요시에만)
	 */
	target_user_ids?: number[]
	/**
	 * 기존 memberIds 호환용
	 */
	memberIds?: number[]
}

export type ChatRoomInviteResponseDto = CommonResponse<{
	roomId: number
	invitedMembers: {
		userId: number
		name: string
	}[]
	invitedAt: string
}>

// 2-3. 프로젝트 멤버 목록 조회
export type ProjectMemberResponseDto = {
	userId: number
	name: string
	email: string
	role: string
}

export type ResponseGetProjectUsersDto = CommonResponse<ProjectMemberResponseDto[]>

// ========== 파일 관리 (ChatFileController) ==========

// 3-1. 파일 업로드 (응답은 ChatMessageDto와 동일)

// 3-2. 파일 삭제 (204 No Content)

// 3-3. 프로젝트 앨범 조회
export type ChatRoomImageDto = {
	fileId: number
	fileUrl: string
	uploadedAt: string
}

export type ChatRoomAlbumResponseDto = {
	roomId: number
	roomName: string
	images: ChatRoomImageDto[]
}

export type ResponseGetProjectAlbumsDto = CommonResponse<ChatRoomAlbumResponseDto[]>

// 3-4. 채팅방 앨범 상세 조회 (GET /api/v1/chats/rooms/{roomId}/album) 응답 스펙
export type ChatRoomAlbumFileDto = {
	file_name: string
	file_url: string
	created_at: string
}

export type ChatRoomAlbumDetailDto = CommonResponse<{
	room_id: number
	room_name: string
	files: ChatRoomAlbumFileDto[]
	total_count: number
	current_page: number
	total_pages: number
	has_next: boolean
}>

// 3-5. 파일 상세 정보 조회
export type ChatFileDetailDto = CommonResponse<{
	fileId: number
	fileName: string
	fileUrl: string
	fileSize: number
	uploadedBy: string
	uploadedAt: string
	messageId: number
}>

// 3-6. 파일 다운로드 (리다이렉트)

// 3-7. 채팅 파일로 공유 문서 생성
export type SharedDocumentCreateByChatRequestDto = {
	/**
	 * 백엔드 요청 스펙 (snake_case)
	 * 예: { "chat_file_id": 100 }
	 */
	chat_file_id?: number
	/**
	 * 프론트 내부 호환용 (camelCase)
	 */
	chatFileId?: number
}

export type SharedDocumentCreateResDto = CommonResponse<{
	documentId: number
	title: string
	createdAt: string
}>

// ========== WebSocket 실시간 메시지 ==========

export type ChatMessageSendRequestDto = {
	userId: number
	content: string
}

export type ChatMessageReceiveDto = ChatMessageDto
