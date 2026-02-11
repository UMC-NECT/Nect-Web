import { useState, useEffect, useRef, useCallback } from 'react'
import { ChatRoomMessage } from './ChatRoomMessage'
import ChatHeader from './ChatHeader'
import ChatMenu from './ChatMenu'
import ChatInput from './ChatInput'
import { ChatDateLine } from './ChatDateLine'
import { ChatReadLine } from './ChatReadLine'
import { chatWebSocketClient } from '@/utils/chatWebSocket'
import { useGetProfileQuery } from '@/hooks/auth/useUsersApi'
import { getDMMessages } from '@/api/chat'
import type { DMMessageDto } from '@/types/api/chat'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface NectChatRoomProps {
	roomName?: string
	memberCount?: number
	onClose?: () => void
	targetUserId: number // DM 대상 유저 ID
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
}

const NectChatRoom = ({ roomName = 'Nect 전체', memberCount = 20, onClose, targetUserId }: NectChatRoomProps) => {
	const [isSearchMode, setIsSearchMode] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [messages, setMessages] = useState<DisplayMessage[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [hasNext, setHasNext] = useState(true)
	const [lastMessageId, setLastMessageId] = useState<number | undefined>()
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

	// DM 메시지를 DisplayMessage 형식으로 변환
	const convertToDisplayMessages = useCallback(
		(messages: DMMessageDto[], currentUserId?: number): DisplayMessage[] => {
			if (!messages || messages.length === 0) return []

			const displayMessages: DisplayMessage[] = []
			let lastDate = ''

			messages.forEach((msg) => {
				const messageDate = formatDate(msg.created_at)
				const isMine = msg.sender_id === currentUserId

				// 날짜가 변경되면 날짜 구분선 추가
				if (messageDate !== lastDate) {
					if (lastDate !== '') {
						// 이전 날짜의 마지막에 읽음 표시선 추가
						displayMessages.push({
							id: `read-line-${msg.message_id}`,
							type: 'read-line',
							time: '',
						})
					}
					displayMessages.push({
						id: `date-${msg.message_id}`,
						type: 'date',
						date: messageDate,
						time: '',
					})
					lastDate = messageDate
				}

				// 메시지 추가
				const baseMessage: DisplayMessage = {
					id: msg.message_id,
					senderName: msg.sender_name,
					content: msg.content || '',
					time: formatTime(msg.created_at),
					isMine,
					profileImage: msg.sender_profile_image || undefined,
					readCount: msg.is_read ? 1 : 0,
				}

				displayMessages.push(baseMessage)
			})

			return displayMessages
		},
		[]
	)

	// 메시지 목록 로드
	const loadMessages = useCallback(
		async (lastId?: number) => {
			if (isLoading || (!hasNext && lastId)) return

			setIsLoading(true)
			try {
				const response = await getDMMessages(targetUserId, {
					cursor: lastId || null,
					size: 20,
				})

				if (response.body) {
					const newMessages = convertToDisplayMessages(response.body.messages, currentUserId)
					setHasNext(response.body.next_cursor !== null)

					if (lastId) {
						// 이전 메시지 추가 (무한 스크롤)
						setMessages((prev) => [...newMessages, ...prev])
					} else {
						// 초기 로드
						setMessages(newMessages)
					}

					if (response.body.messages.length > 0) {
						setLastMessageId(response.body.next_cursor || undefined)
					}
				}
			} catch (error) {
				console.error('DM 메시지 로드 실패:', error)
			} finally {
				setIsLoading(false)
			}
		},
		[targetUserId, currentUserId, convertToDisplayMessages]
	)

	// 초기 메시지 로드 및 WebSocket 연결
	useEffect(() => {
		if (!currentUserId || !targetUserId) {
			return
		}

		loadMessages()

		// WebSocket 연결 (DM 전용 토픽 사용: /topic/dm/{minUserId_maxUserId})
		chatWebSocketClient
			.connect(targetUserId, currentUserId, {
				onMessage: (message: any) => {
					// DM 메시지 수신 처리
					const dmMessage: DMMessageDto = {
						message_id: message.message_id || Date.now(),
						sender_id: message.sender_id || message.user_id,
						sender_name: message.sender_name || message.user_name,
						sender_profile_image: message.sender_profile_image || message.profile_image,
						content: message.content,
						is_pinned: false,
						created_at: message.created_at || new Date().toISOString(),
						is_read: false,
					}
					
					// WebSocket으로 받은 메시지는 날짜 구분선 없이 직접 변환
					const isMine = dmMessage.sender_id === currentUserId
					const newMessage: DisplayMessage = {
						id: dmMessage.message_id,
						senderName: dmMessage.sender_name,
						content: dmMessage.content || '',
						time: formatTime(dmMessage.created_at),
						isMine,
						profileImage: dmMessage.sender_profile_image || undefined,
						readCount: dmMessage.is_read ? 1 : 0,
					}
					
					// 이전 메시지와 날짜가 다르면 날짜 구분선 추가
					setMessages((prev) => {
						const messageDate = formatDate(dmMessage.created_at)
						
						// 마지막 날짜 구분선 찾기
						let lastDateLine: DisplayMessage | undefined
						for (let i = prev.length - 1; i >= 0; i--) {
							if (prev[i].type === 'date') {
								lastDateLine = prev[i]
								break
							}
						}
						
						// 날짜가 변경되었거나 첫 메시지인 경우 날짜 구분선 추가
						const needsDateLine = !lastDateLine || lastDateLine.date !== messageDate
						
						const newMessages: DisplayMessage[] = []
						if (needsDateLine) {
							newMessages.push({
								id: `date-${dmMessage.message_id}`,
								type: 'date',
								date: messageDate,
								time: '',
							})
						}
						newMessages.push(newMessage)
						
						return [...prev, ...newMessages]
					})
					
					// 스크롤을 맨 아래로
					setTimeout(() => {
						messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
					}, 100)
				},
				onError: () => {
					console.error('DM WebSocket 오류 발생')
				},
				onConnect: () => {
					// WebSocket 연결 완료
				},
			}, true) // isDM: true - DM 전용 토픽(/topic/dm/{minUserId_maxUserId}) 구독
			.catch(() => {
				console.error('DM WebSocket 연결 실패')
			})

		return () => {
			// cleanup: 연결 해제
			chatWebSocketClient.disconnect()
		}
	}, [targetUserId, currentUserId])

	// 스크롤을 맨 아래로
	useEffect(() => {
		if (messages.length > 0 && !isLoading) {
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
			}, 100)
		}
	}, [messages.length, isLoading])

	// 무한 스크롤
	useEffect(() => {
		const container = messagesContainerRef.current
		if (!container) return

		const handleScroll = () => {
			const scrollTop = container.scrollTop
			if (scrollTop < 100 && hasNext && !isLoading && lastMessageId !== undefined) {
				loadMessages(lastMessageId)
			}
		}

		container.addEventListener('scroll', handleScroll)
		return () => container.removeEventListener('scroll', handleScroll)
	}, [hasNext, isLoading, lastMessageId])

	return (
		<div className='bg-primary-50-light rounded-6 shadow-drop-neutral-1 h-[670px] flex items-start justify-center overflow-hidden relative'>
			{/* 채팅 영역 */}
			<div className='flex flex-col h-[670px] items-start overflow-hidden relative rounded-br-12 rounded-tr-12 shrink-0 w-[380px]'>
				{/* 헤더 */}
				<ChatHeader
					type={isSearchMode ? 'search' : 'room'}
					roomName={roomName}
					memberCount={memberCount}
					onBack={onClose}
					onSearchClick={() => setIsSearchMode(true)}
					onMenu={() => setIsMenuOpen(true)}
					onClose={() => setIsSearchMode(false)}
					onSearch={(query) => {
						console.log('검색:', query)
					}}
				/>

				{/* 메뉴 모달 */}
				{isMenuOpen && (
					<ChatMenu
						type="room"
						onClose={() => setIsMenuOpen(false)}
						onTurnOffNotification={() => {
							console.log('알림 끄기')
							setIsMenuOpen(false)
						}}
						onInviteContact={() => {
							console.log('대화상대 추가')
							setIsMenuOpen(false)
						}}
						onLeaveRoom={() => {
							console.log('채팅방 나가기')
							setIsMenuOpen(false)
						}}
					/>
				)}

				{/* 메시지 영역 */}
				<div
					ref={messagesContainerRef}
					className='flex flex-col gap-[6px] h-[512px] items-center overflow-y-auto overflow-x-hidden pb-3 px-3 relative shrink-0 w-full notification-scroll'
				>
					{isLoading && messages.length === 0 && (
						<div className='flex justify-center items-center py-8'>
							<span className='text-neutral-500'>메시지를 불러오는 중...</span>
						</div>
					)}
					{messages.length === 0 && !isLoading && (
						<div className='flex justify-center items-center py-8'>
							<span className='text-neutral-500'>메시지가 없습니다.</span>
						</div>
					)}
					{messages.map((message, index) => {
						if (message.type === 'date') {
							return <ChatDateLine key={message.id} date={message.date || ''} className='pt-2.5' />
						}
						if (message.type === 'read-line') {
							return <ChatReadLine key={message.id} />
						}
						// 첫 번째 실제 메시지 아이템에 pt-[10px] 추가
						const isFirstMessage = index > 0 && messages[index - 1]?.type === 'date'
						return (
							<div key={message.id} className={isFirstMessage ? 'pt-2.5 w-full' : 'w-full'}>
								<ChatRoomMessage
									senderName={message.senderName || ''}
									content={message.content || ''}
									time={message.time}
									isMine={message.isMine ?? false}
									readCount={message.readCount}
									role={message.role}
									profileImage={message.profileImage}
								/>
							</div>
						)
					})}
					<div ref={messagesEndRef} />
				</div>

				{/* 입력 필드 */}
				<div className='border-t border-neutral-200 shrink-0 w-full'>
					<ChatInput
						onSend={message => {
							if (!message.trim()) return
							if (!targetUserId) {
								console.error('DM 대상 유저 ID가 없습니다.')
								return
							}

							try {
								// 기존 채팅 WebSocket 연결이 있을 때만 DM 전송 시도
								if (!chatWebSocketClient.isConnected()) {
									console.warn('DM WebSocket이 연결되지 않아 전송을 건너뜁니다.')
									return
								}
								chatWebSocketClient.sendDM(targetUserId, message)
							} catch (error) {
								console.error('DM 메시지 전송 실패:', error)
								alert('메시지 전송에 실패했습니다.')
							}
						}}
						onAttach={() => {
							console.log('파일 첨부')
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default NectChatRoom
