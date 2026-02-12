import { cn } from '@/utils/cn'
import type { MatchingStatus as ApiMatchingStatus } from '@/types/api/matching'

type MatchingStatus = 'default' | 'auto-rejected' | 'accepted'
type RequestType = 'received' | 'sent'

interface MatchingTimerCardProps {
	/** 요청 타입 (받은 요청 / 보낸 요청) */
	requestType: RequestType
	/** 매칭 상태 */
	status?: MatchingStatus
	/** 원본 API 매칭 상태 (서버에서 오는 값: pending | accepted | rejected | canceled | expired) */
	apiStatus?: ApiMatchingStatus
	/** 타이머 값 (초 단위) */
	timerSeconds?: number
	/** 타이머 표시 텍스트 (HH:MM:SS 형식, 예: "09:58:29") */
	timerText?: string
	/** 수락 버튼 클릭 핸들러 (받은 요청일 때만) */
	onAccept?: () => void
	/** 거절 버튼 클릭 핸들러 (받은 요청일 때만) */
	onReject?: () => void
	/** 매칭 취소 버튼 클릭 핸들러 (보낸 요청일 때만) */
	onCancel?: () => void
	/** 추가 클래스명 */
	className?: string
}

/**
 * 타이머를 HH:MM:SS 형식으로 포맷팅
 */
const formatTimer = (seconds: number): string => {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const secs = seconds % 60
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const MatchingTimerCard = ({
	requestType,
	status = 'default',
	apiStatus,
	timerSeconds,
	timerText,
	onAccept,
	onReject,
	onCancel,
	className,
}: MatchingTimerCardProps) => {
	const isAutoRejected = status === 'auto-rejected'
	const isAccepted = status === 'accepted'
	const isReceived = requestType === 'received'
	const isSent = requestType === 'sent'

	// 타이머 텍스트 결정 - timerSeconds가 있으면 사용, 없으면 timerText 사용
	const displayTimer = timerText || (timerSeconds !== undefined && timerSeconds >= 0 ? formatTimer(timerSeconds) : '00:00:00')

	// API status에 따른 텍스트 결정
	const getStatusText = (): string => {
		if (!apiStatus) {
			return status === 'default' ? '대기 만료까지' : '자동 거절 되었습니다.'
		}
		switch (apiStatus) {
			case 'PENDING':
				return '대기 만료까지'
			case 'ACCEPTED':
				return '매칭 수락 되었습니다.'
			case 'REJECTED':
				return '매칭 거절 되었습니다.'
			case 'CANCELED':
				return '매칭 취소 되었습니다.'
			case 'EXPIRED':
				return '자동 거절 되었습니다.'
			default:
				return '대기 만료까지'
		}
	}

	const statusText = getStatusText()
	const statusTextColor = isAutoRejected
		? 'text-danger-700'
		: isAccepted
			? 'text-primary-500-normal'
			: 'text-neutral-500'
	const timerColor = isAutoRejected || isAccepted ? 'text-neutral-200' : 'text-primary-500-normal'

	return (
		<div
			className={cn(
				'bg-neutral-000 border-[1.5px] border-neutral-200 rounded-12 flex flex-col h-[124px] items-start p-[14px] w-[302px]',
				className
			)}
		>
			<div className={cn('flex flex-col items-end relative shrink-0 w-full', status === 'default' && 'gap-[23px]')}>
				{/* 타이머 영역 */}
				<div className="flex items-center justify-between leading-[0] not-italic px-2 py-1 relative shrink-0 w-full">
					<p className={cn('body-2 font-medium whitespace-nowrap', statusTextColor)}>{statusText}</p>
					<p className={cn('heading-3 font-bold text-right w-[110px]', timerColor)}>{displayTimer}</p>
				</div>

				{/* 버튼 영역 */}
				{status === 'default' && (
					<div className={cn('flex items-center relative shrink-0', isReceived && 'gap-0.5')}>
						{/* 받은 요청: 거절/수락 버튼 */}
						{isReceived && (
							<>
								<button
									type="button"
									onClick={onReject}
									className="flex flex-col items-start px-0.5 relative shrink-0 w-[94px]"
								>
									<div className="bg-neutral-50 border-[1.5px] border-neutral-200 border-solid flex h-9 items-center px-2.5 py-3 relative rounded-[6px] shrink-0 w-full">
										<p className="flex flex-1 flex-col font-semibold justify-center min-h-px min-w-px not-italic relative button-1 text-neutral-900 text-center leading-[1.4]">
											거절
										</p>
									</div>
								</button>
								<button
									type="button"
									onClick={onAccept}
									className="flex flex-col items-start px-0.5 relative shrink-0 w-[94px]"
								>
									<div className="bg-primary-400-normal flex h-9 items-center px-2.5 py-3 relative rounded-[6px] shrink-0 w-full">
										<p className="flex flex-1 flex-col font-semibold justify-center min-h-px min-w-px not-italic relative button-1 text-neutral-50 text-center leading-[1.4]">
											수락
										</p>
									</div>
								</button>
							</>
						)}

						{/* 보낸 요청: 매칭 취소 버튼 */}
						{isSent && (
							<button
								type="button"
								onClick={onCancel}
								className="flex flex-col items-start px-0.5 relative shrink-0 w-[94px]"
							>
								<div className="bg-primary-400-normal flex h-9 items-center px-2.5 py-3 relative rounded-[6px] shrink-0 w-full">
									<p className="flex flex-1 flex-col font-semibold justify-center min-h-px min-w-px not-italic relative button-1 text-neutral-50 text-center leading-[1.4]">
										매칭 취소
									</p>
								</div>
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default MatchingTimerCard
