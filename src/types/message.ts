export interface ChatMessage {
	id: number
	senderName: string
	content: string
	time: string
	isRead: boolean
	profileImage?: string
	participants?: string[]
	memberCount?: number
	unreadCount?: number
	role?: string // 개인 채팅의 경우 역할 (Design, Frontend, Part 등)
	isGroup?: boolean // 그룹 채팅 여부
}

export interface ChatRoom {
	id: number
	name: string
	participants: string[]
	lastMessage?: ChatMessage
}
