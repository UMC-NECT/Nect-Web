import type { ChatMessageReceiveDto, ChatMessageSendRequestDto } from "@/types/api/chat"
import { LOCAL_STORAGE_KEY } from "@/constants/key"
import { useLocalStorage } from "@/hooks/useLocalStorage"

/**
 * STOMP를 사용한 WebSocket 클라이언트
 * @stomp/stompjs 패키지가 필요합니다: npm install @stomp/stompjs
 */

type ChatWebSocketCallbacks = {
	onMessage?: (message: ChatMessageReceiveDto) => void
	onError?: (error: Error) => void
	onConnect?: () => void
	onDisconnect?: () => void
}

class ChatWebSocketClient {
	private client: any = null
	private roomId: number | null = null
	private userId: number | null = null
	private callbacks: ChatWebSocketCallbacks = {}
	private reconnectAttempts = 0
	private maxReconnectAttempts = 5
	private reconnectDelay = 1000
	private subscription: { unsubscribe: () => void } | null = null
	private isConnecting = false // 연결 중인지 추적

	/**
	 * WebSocket 연결 초기화
	 */
	async connect(roomId: number, userId: number, callbacks: ChatWebSocketCallbacks = {}) {
		console.log('chatWebSocketClient.connect 호출됨:', { roomId, userId })
		
		// 이미 같은 roomId와 userId로 연결되어 있으면 기존 연결 재사용
		if (this.client && this.client.connected && this.roomId === roomId && this.userId === userId) {
			console.log('이미 연결되어 있음. 기존 연결 재사용')
			// 콜백만 업데이트
			this.callbacks = { ...this.callbacks, ...callbacks }
			// 기존 구독이 있으면 콜백만 업데이트
			if (this.subscription) {
				this.callbacks.onConnect?.()
			}
			return
		}

		// 이미 연결 중이면 대기
		if (this.isConnecting) {
			console.log('이미 연결 중입니다. 대기...')
			return
		}

		// 기존 연결이 있으면 먼저 해제
		if (this.client) {
			console.log('기존 연결 해제 중...')
			this.disconnect()
		}
		
		this.isConnecting = true
		this.roomId = roomId
		this.userId = userId
		this.callbacks = callbacks

		try {
			console.log('STOMP 패키지 로드 시도...')
			// @stomp/stompjs 패키지가 설치되어 있는지 확인
			let StompJs
			try {
				StompJs = await import("@stomp/stompjs")
				console.log('STOMP 패키지 로드 성공:', StompJs)
			} catch (error) {
				console.error('STOMP 패키지 로드 실패:', error)
				throw new Error(
					`@stomp/stompjs 패키지를 로드할 수 없습니다. 패키지가 설치되어 있는지 확인해주세요. 오류: ${error}`
				)
			}

			if (!StompJs) {
				throw new Error(
					"@stomp/stompjs 패키지가 설치되지 않았습니다. 'npm install @stomp/stompjs'를 실행해주세요."
				)
			}

			// SockJS 클라이언트 로드
			let SockJSModule
			try {
				// @ts-ignore - sockjs-client 타입 정의 없음
				SockJSModule = await import("sockjs-client")
				console.log('SockJS 패키지 로드 성공:', SockJSModule)
			} catch (error) {
				console.error('SockJS 패키지 로드 실패:', error)
				throw new Error(
					`sockjs-client 패키지를 로드할 수 없습니다. 패키지가 설치되어 있는지 확인해주세요. 오류: ${error}`
				)
			}
			
			if (!SockJSModule) {
				throw new Error(
					"sockjs-client 패키지가 설치되지 않았습니다. 'npm install sockjs-client'를 실행해주세요."
				)
			}
			const SockJS = (SockJSModule as any).default || SockJSModule

			const { Client } = StompJs
			const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
			const accessToken = getItem()

			if (!accessToken) {
				throw new Error("액세스 토큰이 없습니다.")
			}

			// WebSocket URL 구성 (SockJS는 HTTP/HTTPS URL 사용)
			const apiUrl = import.meta.env.VITE_API_URL || ""
			let wsUrl = import.meta.env.VITE_WS_URL
			
			if (!wsUrl) {
				// API URL 사용 (SockJS는 ws:// 대신 http:// 사용)
				if (apiUrl) {
					wsUrl = apiUrl
				} else {
					throw new Error("WebSocket URL이 설정되지 않았습니다.")
				}
			}
			
			// URL 정규화 (중복 슬래시 제거)
			wsUrl = wsUrl.replace(/\/+$/, "") // 끝의 슬래시 제거
			const wsPath = "/ws-chat"
			// SockJS는 토큰을 쿼리 파라미터로 전달해야 함
			const brokerURL = `${wsUrl}${wsPath}?token=${encodeURIComponent(accessToken)}`.replace(/([^:]\/)\/+/g, "$1") // 중복 슬래시 제거
			
			console.log("SockJS 연결 시도:", brokerURL)
			console.log("API URL:", apiUrl)
			console.log("WebSocket URL:", wsUrl)

			// STOMP 클라이언트 생성 (SockJS 사용)
			this.client = new Client({
				webSocketFactory: () => {
					const sock = new (SockJS as any)(brokerURL, null, {
						transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
					})
					console.log('SockJS 인스턴스 생성:', brokerURL)
					
					// WebSocket 실패 오류를 조용히 처리 (SockJS가 자동으로 폴백함)
					// 이 오류는 정상적인 폴백 과정이므로 콘솔에 표시하지 않음
					const originalOnError = sock.onerror
					sock.onerror = (error: any) => {
						// SockJS가 자동으로 폴백하므로 WebSocket 실패는 정상적인 동작
						// 실제 연결 오류만 처리 (readyState가 OPEN이 아닐 때만)
						if (sock.readyState !== 1) { // 1 = OPEN
							// 연결이 열리지 않은 상태에서의 오류는 폴백 과정이므로 무시
							return
						}
						// 연결이 열린 후의 오류만 처리
						if (originalOnError) {
							originalOnError.call(sock, error)
						}
					}
					
					return sock
				},
				// SockJS 사용 시 connectHeaders는 무시될 수 있으므로 토큰은 URL 쿼리 파라미터로 전달
				connectHeaders: {},
				reconnectDelay: 0, // 자동 재연결 비활성화 (수동으로 관리)
				heartbeatIncoming: 4000,
				heartbeatOutgoing: 4000,
				debug: (str: string) => {
					console.log('STOMP Debug:', str)
				},
				onConnect: (frame: any) => {
					console.log('STOMP onConnect 콜백 실행:', frame)
					this.reconnectAttempts = 0
					this.isConnecting = false // 연결 완료

					// 채팅방 구독 (실제 API: /topic/chatroom/{roomid})
					// SockJS 사용 시 약간의 지연이 필요할 수 있음
					const subscribeToRoom = () => {
						if (!this.client) {
							console.warn('구독 실패: 클라이언트가 없음')
							return
						}

						// connected 상태 확인
						if (!this.client.connected) {
							console.warn('구독 실패: 클라이언트가 연결되지 않음', {
								connected: this.client.connected,
								roomId: this.roomId,
							})
							return
						}

						if (!this.roomId) {
							console.warn('구독 실패: roomId가 없음')
							return
						}

						try {
							console.log('채팅방 구독 시도:', `/topic/chatroom/${this.roomId}`)
							this.subscription = this.client.subscribe(`/topic/chatroom/${this.roomId}`, (message: any) => {
								try {
									const chatMessage: ChatMessageReceiveDto = JSON.parse(message.body)
									this.callbacks.onMessage?.(chatMessage)
								} catch (error) {
									console.error("메시지 파싱 오류:", error)
									this.callbacks.onError?.(error as Error)
								}
							})
							console.log('채팅방 구독 성공')
							// 구독 성공 후에 onConnect 콜백 호출
							this.callbacks.onConnect?.()
						} catch (error) {
							console.error('채팅방 구독 실패:', error)
							// 재시도
							setTimeout(subscribeToRoom, 200)
						}
					}

					// 약간의 지연 후 구독 시도
					setTimeout(subscribeToRoom, 200)
				},
				onStompError: (frame: any) => {
					console.error("STOMP 오류:", frame)
					console.error("STOMP 오류 상세:", JSON.stringify(frame, null, 2))
					this.callbacks.onError?.(new Error(frame.headers?.["message"] || "STOMP 연결 오류"))
					this.handleReconnect()
				},
				onWebSocketError: (event: any) => {
					console.error("WebSocket 오류:", event)
					console.error("WebSocket 오류 타입:", event.type)
					console.error("WebSocket 오류 타겟:", event.target)
					if (event.target) {
						console.error("WebSocket 상태:", event.target.readyState)
						console.error("WebSocket URL:", event.target.url)
					}
					this.callbacks.onError?.(new Error("WebSocket 연결 오류"))
					// 재연결 시도는 잠시 후에 (너무 빠른 재연결 방지)
					setTimeout(() => {
						this.handleReconnect()
					}, 2000)
				},
			})

			// 연결 시작
			console.log('STOMP 클라이언트 activate() 호출 전')
			this.client.activate()
			console.log('STOMP 클라이언트 activate() 호출 완료')
		} catch (error) {
			console.error("WebSocket 연결 실패:", error)
			this.callbacks.onError?.(error as Error)
			throw error
		}
	}

	/**
	 * 메시지 전송
	 */
	sendMessage(content: string) {
		if (!this.client || !this.client.connected || !this.roomId || !this.userId) {
			throw new Error("WebSocket이 연결되지 않았습니다.")
		}

		const message: ChatMessageSendRequestDto = {
			userId: this.userId,
			content,
		}

		this.client.publish({
			destination: `/app/chat-send/${this.roomId}`,
			body: JSON.stringify(message),
		})
	}

	/**
	 * 연결 해제
	 */
	disconnect() {
		this.isConnecting = false
		if (this.subscription) {
			this.subscription.unsubscribe()
			this.subscription = null
		}
		if (this.client) {
			this.client.deactivate()
			this.client = null
		}
		this.roomId = null
		this.userId = null
		this.callbacks = {}
		this.reconnectAttempts = 0
	}

	/**
	 * 재연결 처리
	 */
	private handleReconnect() {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			console.error("최대 재연결 시도 횟수에 도달했습니다.")
			return
		}

		this.reconnectAttempts++
		setTimeout(() => {
			if (this.roomId && this.userId) {
				this.connect(this.roomId, this.userId, this.callbacks).catch((error) => {
					console.error("재연결 실패:", error)
				})
			}
		}, this.reconnectDelay * this.reconnectAttempts)
	}

	/**
	 * 연결 상태 확인
	 */
	isConnected(): boolean {
		return this.client?.connected ?? false
	}
}

// 싱글톤 인스턴스
export const chatWebSocketClient = new ChatWebSocketClient()
