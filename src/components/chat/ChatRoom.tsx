import { useState, useEffect, useRef, useCallback } from 'react'
import { ChatRoomMessage } from './ChatRoomMessage'
import ChatHeader from './ChatHeader'
import ChatMenu from './ChatMenu'
import ChatSidebar from './ChatSidebar'
import ChatInput from './ChatInput'
import { ChatDateLine } from './ChatDateLine'
import { ChatReadLine } from './ChatReadLine'
import ChatMemberSelectModal from './ChatMemberSelectModal'
import { chatWebSocketClient } from '@/utils/chatWebSocket'
import {
	getChatRoomMessages,
	searchChatMessages,
	leaveChatRoom,
	inviteChatRoomMembers,
	uploadChatFile,
} from '@/api/chat'
import type { ChatMessageDto } from '@/types/api/chat'
import { useGetProfileQuery } from '@/hooks/auth/useUsersApi'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface ChatRoomProps {
	roomId: number
	roomName: string
	memberCount?: number
	role?: string
	unreadCount?: number
	projectId?: number
	onClose: () => void
}

type DisplayMessage = {
	id: string | number
	type?: 'date' | 'read-line'
	date?: string
	senderName?: string
	content?: string
	time: string
	isMine?: boolean
	readCount?: number
	role?: string
	profileImage?: string
	fileAttachment?: {
		fileName: string
		fileSize: string
		fileType: 'PDF' | 'Figma' | 'Word' | 'Excel' | 'PPT' | 'Zip' | 'JPG' | 'PNG' | 'JPEG' | 'MOV' | 'MP4' | 'Etc'
	}
}

const ChatRoom = ({
	roomId,
	roomName,
	memberCount,
	role,
	unreadCount = 0,
	projectId,
	onClose,
}: ChatRoomProps) => {
	const [isSearchMode, setIsSearchMode] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isSelectContactOpen, setIsSelectContactOpen] = useState(false)
	const [messages, setMessages] = useState<DisplayMessage[]>([])
	const [searchResults, setSearchResults] = useState<DisplayMessage[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [hasNext, setHasNext] = useState(true)
	const [lastMessageId, setLastMessageId] = useState<number | undefined>()
	const [searchQuery, setSearchQuery] = useState('')
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const messagesContainerRef = useRef<HTMLDivElement>(null)
	const { data: profileData } = useGetProfileQuery()
	const currentUserId = profileData?.body?.userId

	// 날짜 포맷팅
	const formatTime = (dateString: string): string => {
		try {
			const date = new Date(dateString)
			return format(date, 'HH:mm')
		} catch {
			return '00:00'
		}
	}

	const formatDate = (dateString: string): string => {
		try {
			const date = new Date(dateString)
			return format(date, 'yyyy년 M월 d일 EEEE', { locale: ko })
		} catch {
			return ''
		}
	}

	// 파일 타입 매핑
	type FileType = 'PDF' | 'Figma' | 'Word' | 'Excel' | 'PPT' | 'Zip' | 'JPG' | 'PNG' | 'JPEG' | 'MOV' | 'MP4' | 'Etc'
	const getFileType = (fileName: string): FileType => {
		const ext = fileName.split('.').pop()?.toLowerCase()
		const typeMap: Record<string, FileType> = {
			pdf: 'PDF',
			fig: 'Figma',
			figma: 'Figma',
			doc: 'Word',
			docx: 'Word',
			xls: 'Excel',
			xlsx: 'Excel',
			ppt: 'PPT',
			pptx: 'PPT',
			zip: 'Zip',
			rar: 'Zip',
			jpg: 'JPG',
			jpeg: 'JPEG',
			png: 'PNG',
			mov: 'MOV',
			mp4: 'MP4',
		}
		return typeMap[ext || ''] || 'Etc'
	}

	// 파일 크기 포맷팅
	const formatFileSize = (bytes?: number): string => {
		if (!bytes) return '0.0MB'
		const mb = bytes / (1024 * 1024)
		return `${mb.toFixed(1)}MB`
	}

	// API 메시지를 DisplayMessage로 변환
	const convertToDisplayMessages = (apiMessages: ChatMessageDto[], currentUserId?: number): DisplayMessage[] => {
		const displayMessages: DisplayMessage[] = []
		let lastDate = ''

		apiMessages.forEach((msg, index) => {
			const msgDate = formatDate(msg.created_at)
			const isNewDate = msgDate !== lastDate

			if (isNewDate && index > 0) {
				displayMessages.push({
					id: `date-${msg.message_id}`,
					type: 'date',
					date: msgDate,
					time: '',
					isMine: false,
				})
				lastDate = msgDate
			} else if (isNewDate) {
				lastDate = msgDate
			}

			const isMine = msg.user_id === currentUserId
			const baseMessage: DisplayMessage = {
				id: msg.message_id,
				senderName: msg.user_name,
				time: formatTime(msg.created_at),
				isMine,
				profileImage: msg.profile_image || undefined,
				readCount: msg.read_count || undefined,
			}

			if (msg.message_type === 'FILE' || msg.message_type === 'IMAGE') {
				if (msg.file_info) {
					const fileName = msg.file_info.file_name || '파일'
					baseMessage.fileAttachment = {
						fileName,
						fileSize: formatFileSize(msg.file_info.file_size),
						fileType: getFileType(fileName),
					}
				}
			} else {
				baseMessage.content = msg.content || ''
			}

			displayMessages.push(baseMessage)
		})

		return displayMessages
	}

	// 메시지 목록 로드
	const loadMessages = useCallback(
		async (lastId?: number) => {
			if (isLoading || (!hasNext && lastId)) return

			setIsLoading(true)
			try {
				const response = await getChatRoomMessages(roomId, {
					lastMessageId: lastId,
					size: 20,
				})

				if (response.body) {
					const newMessages = convertToDisplayMessages(response.body.messages, currentUserId)
					setHasNext(response.body.has_next)

					if (lastId) {
						// 이전 메시지 추가 (무한 스크롤)
						setMessages((prev) => [...newMessages, ...prev])
					} else {
						// 초기 로드
						setMessages(newMessages)
					}

					if (response.body.messages.length > 0) {
						setLastMessageId(response.body.messages[response.body.messages.length - 1].message_id)
					}
				}
			} catch (error) {
				console.error('메시지 로드 실패:', error)
			} finally {
				setIsLoading(false)
			}
		},
		[roomId, currentUserId, isLoading, hasNext]
	)

	// 초기 메시지 로드 및 WebSocket 연결
	useEffect(() => {
		console.log('ChatRoom useEffect 실행:', { roomId, currentUserId })
		
		if (!currentUserId) {
			console.warn('currentUserId가 없어서 WebSocket 연결을 건너뜁니다')
			return
		}

		loadMessages()

		// WebSocket 연결
		console.log('WebSocket 연결 시작:', { roomId, currentUserId })
		chatWebSocketClient
			.connect(roomId, currentUserId, {
				onMessage: (message: ChatMessageDto) => {
					const newMessage = convertToDisplayMessages([message], currentUserId)[0]
					setMessages((prev) => [...prev, newMessage])
					// 스크롤을 맨 아래로
					setTimeout(() => {
						messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
					}, 100)
				},
				onError: (error) => {
					console.error('WebSocket 오류:', error)
				},
				onConnect: () => {
					console.log('WebSocket 연결됨')
				},
			})
			.catch((error) => {
				console.error('WebSocket 연결 실패:', error)
			})

		return () => {
			// cleanup: 연결 해제
			console.log('ChatRoom cleanup: WebSocket 연결 해제')
			chatWebSocketClient.disconnect()
		}
	}, [roomId, currentUserId])

	// 메시지 전송
	const handleSendMessage = async (content: string) => {
		if (!content.trim()) return

		try {
			chatWebSocketClient.sendMessage(content)
		} catch (error) {
			console.error('메시지 전송 실패:', error)
			alert('메시지 전송에 실패했습니다.')
		}
	}

	// 파일 업로드
	const handleFileUpload = async (file: File) => {
		try {
			await uploadChatFile(roomId, file)
		} catch (error) {
			console.error('파일 업로드 실패:', error)
			alert('파일 업로드에 실패했습니다.')
		}
	}

	// 검색
	const handleSearch = async (query: string) => {
		if (!query.trim()) {
			setSearchResults([])
			setSearchQuery('')
			return
		}

		setSearchQuery(query)
		try {
			const response = await searchChatMessages(roomId, query, { page: 0, size: 20 })
			if (response.body) {
				const results = convertToDisplayMessages(response.body.messages, currentUserId)
				setSearchResults(results)
			}
		} catch (error) {
			console.error('검색 실패:', error)
		}
	}

	// 채팅방 나가기
	const handleLeaveRoom = async () => {
		if (!confirm('정말 채팅방에서 나가시겠습니까?')) return

		try {
			await leaveChatRoom(roomId)
			onClose()
		} catch (error) {
			console.error('채팅방 나가기 실패:', error)
			alert('채팅방 나가기에 실패했습니다.')
		}
	}

	// 멤버 초대
	const handleInviteMembers = async (memberIds: number[]) => {
		try {
			await inviteChatRoomMembers(roomId, { memberIds })
			setIsSelectContactOpen(false)
			alert('멤버를 초대했습니다.')
		} catch (error) {
			console.error('멤버 초대 실패:', error)
			alert('멤버 초대에 실패했습니다.')
		}
	}

	// 무한 스크롤
	const handleScroll = useCallback(() => {
		const container = messagesContainerRef.current
		if (!container || isLoading || !hasNext) return

		if (container.scrollTop === 0) {
			loadMessages(lastMessageId)
		}
	}, [loadMessages, lastMessageId, isLoading, hasNext])

	// 스크롤 이벤트 리스너
	useEffect(() => {
		const container = messagesContainerRef.current
		if (container) {
			container.addEventListener('scroll', handleScroll)
			return () => container.removeEventListener('scroll', handleScroll)
		}
	}, [handleScroll])

	// 새 메시지가 추가되면 스크롤
	useEffect(() => {
		if (messages.length > 0) {
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
			}, 100)
		}
	}, [messages.length])

	// 대화상대 선택 모달이 열려있으면 모달만 표시
	if (isSelectContactOpen && projectId) {
		return (
			<ChatMemberSelectModal
				projectId={projectId}
				onClose={() => setIsSelectContactOpen(false)}
				onConfirm={(selectedContacts) => {
					const memberIds = selectedContacts.map((contact) => contact.id)
					handleInviteMembers(memberIds)
				}}
				existingMemberIds={[]}
			/>
		)
	}

	const displayMessages = searchQuery ? searchResults : messages

	return (
		<div className='flex items-start h-full'>
			{/* 사이드바 */}
			<ChatSidebar
				unreadCount={unreadCount}
				onMessageClick={onClose}
				onCloudClick={() => {}}
				onSettingsClick={() => {}}
			/>
			{/* 메인 채팅 영역 */}
			<div className='w-[380px] h-full bg-white rounded-2xl rounded-l-none border-l-0 border border-neutral-200 z-50 overflow-hidden relative flex flex-col'>
				{/* 헤더 */}
				<ChatHeader
					type={isSearchMode ? 'search' : 'room'}
					roomName={roomName}
					memberCount={memberCount}
					role={role}
					onBack={onClose}
					onSearchClick={() => setIsSearchMode(true)}
					onMenu={() => setIsMenuOpen(true)}
					onClose={() => setIsSearchMode(false)}
					onSearch={handleSearch}
				/>

				{/* 메뉴 모달 */}
				{isMenuOpen && (
					<ChatMenu
						type="room"
						onClose={() => setIsMenuOpen(false)}
						onTurnOffNotification={() => {
							console.log('알림 끄기')
							// TODO: 알림 끄기 로직 구현
						}}
						onInviteContact={() => {
							setIsSelectContactOpen(true)
						}}
						onLeaveRoom={handleLeaveRoom}
					/>
				)}

				{/* 메시지 영역 */}
				<div
					ref={messagesContainerRef}
					className='flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 bg-neutral-50 min-h-0 notification-scrollbar'
				>
					{isLoading && messages.length === 0 && (
						<div className='flex justify-center items-center py-8'>
							<span className='text-neutral-500'>메시지를 불러오는 중...</span>
						</div>
					)}
					{displayMessages.length === 0 && !isLoading && (
						<div className='flex justify-center items-center py-8'>
							<span className='text-neutral-500'>
								{searchQuery ? '검색 결과가 없습니다.' : '메시지가 없습니다.'}
							</span>
						</div>
					)}
					{displayMessages.map((message) => {
						if (message.type === 'date') {
							return <ChatDateLine key={message.id} date={message.date || ''} />
						}
						if (message.type === 'read-line') {
							return <ChatReadLine key={message.id} />
						}
						return (
							<ChatRoomMessage
								key={message.id}
								senderName={message.senderName}
								content={message.content}
								time={message.time}
								isMine={message.isMine ?? false}
								readCount={message.readCount}
								role={message.role}
								profileImage={message.profileImage}
								fileAttachment={message.fileAttachment}
							/>
						)
					})}
					<div ref={messagesEndRef} />
				</div>

				{/* 입력 필드 */}
				<div className='border-t border-neutral-200 shrink-0'>
					<ChatInput
						onSend={handleSendMessage}
						onAttach={() => {
							const input = document.createElement('input')
							input.type = 'file'
							input.onchange = (e) => {
								const file = (e.target as HTMLInputElement).files?.[0]
								if (file) {
									handleFileUpload(file)
								}
							}
							input.click()
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default ChatRoom

