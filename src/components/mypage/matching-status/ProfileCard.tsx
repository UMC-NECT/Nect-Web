import { cn } from '@/utils/cn'
import ChatIcon from '@/assets/icons/mypage/chat.svg?react'

interface ProfileCardProps {
	/** 프로필 이미지 URL */
	imageUrl?: string
	/** 사용자 닉네임 */
	nickname: string
	/** 사용자 파트 (예: Design, Frontend, Backend) */
	part: string
	/** 프로필 소개 텍스트 */
	introduction?: string
	/** 메시지 버튼 클릭 핸들러 */
	onMessageClick?: () => void
	/** 추가 클래스명 */
	className?: string
}

const ProfileCard = ({ imageUrl, nickname, part, introduction, onMessageClick, className }: ProfileCardProps) => {
	return (
		<div
			className={cn(
				'bg-neutral-000 border-[1.5px] border-neutral-200 rounded-12 flex flex-col h-[124px] items-start px-[14px] py-[14px] w-[478px]',
				className
			)}
		>
			<div className="flex gap-3 items-center relative shrink-0 w-full">
				{/* 프로필 이미지 */}
				<div className="flex items-center pl-0.5 py-2 relative shrink-0">
					<div className="relative shrink-0 size-[80px] rounded-full overflow-hidden bg-neutral-200">
						{imageUrl ? (
							<img src={imageUrl} alt={nickname} className="w-full h-full object-cover" />
						) : (
							<div className="w-full h-full bg-neutral-200" />
						)}
					</div>
				</div>

				{/* 텍스트 영역 */}
				<div className="flex h-[74px] items-start relative shrink-0 flex-1 min-w-0">
					<div className="flex flex-1 flex-col gap-1.5 items-start min-h-[54px] min-w-0 relative">
						{/* 닉네임 | Part */}
						<div className="flex items-end justify-between relative shrink-0 w-full">
							<div className="flex gap-1.5 h-[26px] items-center justify-center relative shrink-0">
								<p className="title-3 font-semibold text-neutral-900 whitespace-nowrap leading-[1.4]">{nickname}</p>
								<div className="bg-neutral-300 h-3 rounded-[6px] shrink-0 w-0.5" />
								<p className="title-3 font-medium text-neutral-500 whitespace-nowrap leading-[1.4]">{part}</p>
							</div>
						</div>
						{/* 프로필 소개 */}
						<p className="body-2 font-medium text-neutral-600 h-[42px] overflow-hidden text-ellipsis w-full whitespace-nowrap leading-[1.5]">
							{introduction || '프로필 소개 (첫 문장까지 미리보기됨)'}
						</p>
					</div>
				</div>

				{/* 메시지 아이콘 버튼 */}
				<button
					type="button"
					onClick={onMessageClick}
					className="flex gap-2.5 items-center justify-center relative shrink-0 size-12 bg-neutral-000 rounded-12 shadow-inner-neutral-2 self-start"
					aria-label="메시지 보내기"
				>
					<div className="absolute inset-0 pointer-events-none rounded-[inherit]" />
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-clip p-0.75 size-[30px]">
						<ChatIcon className="relative shrink-0 size-12" />
					</div>
				</button>
			</div>
		</div>
	)
}

export default ProfileCard
