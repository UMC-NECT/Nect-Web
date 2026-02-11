import type {
	ChatFileDetailDto,
	ChatMessageSearchResponseDto,
	ChatNoticeResponseDto,
	ChatNoticeUpdateRequestDto,
	ChatRoomAlbumDetailDto,
	ChatRoomInviteRequestDto,
	ChatRoomInviteResponseDto,
	ChatRoomLeaveResponseDto,
	ChatRoomMessagesResponseDto,
	ChatRoomResponseDto,
	CommonResponse,
	GroupChatRoomCreateRequestDto,
	ResponseGetChatRoomsDto,
	ResponseGetDMRoomsDto,
	ResponseGetProjectAlbumsDto,
	ResponseGetProjectMembersDto,
	ResponseGetProjectUsersDto,
	SharedDocumentCreateByChatRequestDto,
	SharedDocumentCreateResDto,
} from "@/types/api/chat"
import { api } from "@/utils/AxiosInstance"
import { toQueryString } from "@/utils/queryString"

// ========== 채팅방 관리 (ChatMessageController) ==========

/** 특정 프로젝트의 모든 채팅방 목록 조회 */
export const getChatRooms = async (projectId: number): Promise<ResponseGetChatRoomsDto> => {
	const { data } = await api.get(`/api/v1/chats/projects/${projectId}/rooms`)
	return data
}

/** DM 채팅방 목록 조회 */
export const getDMRooms = async (options?: {
	cursor?: number | null
	size?: number
}): Promise<ResponseGetDMRoomsDto> => {
	const query = toQueryString({
		cursor: options?.cursor?.toString(),
		size: options?.size?.toString(),
	})
	const { data } = await api.get(`/api/v1/dms/rooms${query}`)
	return data
}

/** 채팅방의 메시지 목록 조회 (페이징) */
export const getChatRoomMessages = async (
	roomId: number,
	options?: {
		lastMessageId?: number
		size?: number
	}
): Promise<ChatRoomMessagesResponseDto> => {
	const query = toQueryString({
		lastMessage_id: options?.lastMessageId?.toString(),
		size: options?.size?.toString(),
	})
	const { data } = await api.get(`/api/v1/chats/rooms/${roomId}/messages${query}`)
	return data
}

/** 채팅방에서 나가기 */
export const leaveChatRoom = async (roomId: number): Promise<ChatRoomLeaveResponseDto> => {
	const { data } = await api.delete(`/api/v1/chats/${roomId}/leave`)
	return data
}

/** 특정 메시지를 공지로 설정하거나 해제 */
export const updateChatNotice = async (
	messageId: number,
	body: ChatNoticeUpdateRequestDto
): Promise<ChatNoticeResponseDto> => {
	const { data } = await api.patch(`/api/v1/chats/message/${messageId}/notice`, body)
	return data
}

/** 채팅방 생성 시 초대할 멤버 조회 */
export const getProjectMembers = async (
	projectId: number,
	keyword?: string
): Promise<ResponseGetProjectMembersDto> => {
	const query = toQueryString({ keyword })
	const { data } = await api.get(`/api/v1/chats/projects/${projectId}/members${query}`)
	return data
}

/** 채팅방 내 메시지 검색 */
export const searchChatMessages = async (
	roomId: number,
	keyword: string,
	options?: {
		page?: number
		size?: number
	}
): Promise<ChatMessageSearchResponseDto> => {
	const query = toQueryString({
		keyword,
		page: options?.page?.toString(),
		size: options?.size?.toString(),
	})
	const { data } = await api.get(`/api/v1/chats/rooms/${roomId}/messages/search${query}`)
	return data
}

// ========== 채팅방 생성/초대 (TeamChatController) ==========

/** 새로운 그룹 채팅방 생성 */
export const createGroupChatRoom = async (
	body: GroupChatRoomCreateRequestDto
): Promise<ChatRoomResponseDto> => {
	// API 스펙에 맞게 snake_case로 변환
	const requestBody = {
		project_id: body.projectId,
		room_name: body.roomName,
		target_user_ids: body.memberIds,
	}
	const { data } = await api.post("/api/v1/chats/rooms/group", requestBody)
	return data
}

/** 기존 채팅방에 멤버 초대 */
export const inviteChatRoomMembers = async (
  roomId: number,
  body: ChatRoomInviteRequestDto
): Promise<ChatRoomInviteResponseDto> => {
  // 백엔드 스펙에 맞게 camelCase(targetUserIds)로 전송
  const targetUserIds = body.targetUserIds ?? body.memberIds ?? body.target_user_ids
  if (!targetUserIds || targetUserIds.length === 0) {
    throw new Error('초대할 대상 유저가 없습니다. targetUserIds를 확인해주세요.')
  }
  const requestBody = { targetUserIds }
  const { data } = await api.post(`/api/v1/chats/rooms/${roomId}/invite`, requestBody)
  return data
}
/** 프로젝트의 전체 멤버 조회 */
export const getProjectUsers = async (projectId: number): Promise<ResponseGetProjectUsersDto> => {
	const { data } = await api.get(`/api/v1/chats/rooms/${projectId}/users`)
	return data
}

// ========== 파일 관리 (ChatFileController) ==========

/** 채팅방에 파일 업로드 및 전송 */
export const uploadChatFile = async (
	roomId: number,
	file: File
): Promise<CommonResponse> => {
	const formData = new FormData()
	formData.append("file", file)
	const { data } = await api.post(`/api/v1/chats/${roomId}/files`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
	return data
}

/** 업로드된 파일 삭제 */
export const deleteChatFile = async (fileId: number): Promise<void> => {
	await api.delete(`/api/v1/chats/files/${fileId}`)
}

/** 프로젝트 내 모든 채팅방의 이미지 앨범 조회 */
export const getProjectAlbums = async (
	projectId: number,
	limit?: number
): Promise<ResponseGetProjectAlbumsDto> => {
	const query = toQueryString({ limit: limit?.toString() })
	const { data } = await api.get(`/api/v1/chats/projects/${projectId}/albums${query}`)
	return data
}

/** 특정 채팅방의 모든 이미지 조회 (페이징) */
export const getChatRoomAlbum = async (
	roomId: number,
	options?: {
		page?: number
		size?: number
	}
): Promise<ChatRoomAlbumDetailDto> => {
	const query = toQueryString({
		page: options?.page?.toString(),
		size: options?.size?.toString(),
	})
	const { data } = await api.get(`/api/v1/chats/rooms/${roomId}/album${query}`)
	return data
}

/** 파일의 상세 정보 조회 */
export const getChatFileDetail = async (fileId: number): Promise<ChatFileDetailDto> => {
	const { data } = await api.get(`/api/v1/chats/files/${fileId}`)
	return data
}

/** 파일 다운로드 (리다이렉트) */
export const downloadChatFile = async (fileId: number): Promise<void> => {
	const { data } = await api.get(`/api/v1/chats/files/${fileId}/download`, {
		responseType: "blob",
	})
	// 실제로는 서버에서 리다이렉트하므로, 필요시 처리 로직 추가
	return data
}

/** 채팅방의 파일을 공유 문서로 변환 */
export const createSharedDocumentFromChat = async (
	roomId: number,
	projectId: number,
	body: SharedDocumentCreateByChatRequestDto
): Promise<SharedDocumentCreateResDto> => {
	const query = toQueryString({ projectId: projectId.toString() })
	const chatFileId = body.chat_file_id ?? body.chatFileId
	if (!chatFileId) {
		throw new Error("chat_file_id가 없습니다. 공유 문서함 등록에 실패했습니다.")
	}
	const requestBody = { chat_file_id: chatFileId }
	const { data } = await api.post(
		`/api/v1/chats/rooms/${roomId}/shared-documents${query}`,
		requestBody
	)
	return data
}
