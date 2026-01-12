export interface ChatMessage {
	id: number
	senderName: string
	content: string
	time: string
	isRead: boolean
	profileImage?: string
}

export interface ChatRoom {
	id: number
	name: string
	participants: string[]
	lastMessage?: ChatMessage
}
