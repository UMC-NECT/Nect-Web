import { cn } from '@/utils/cn'

interface MatchingNoticeProps {
	/** 추가 클래스명 */
	className?: string
}

const MatchingNotice = ({ className }: MatchingNoticeProps) => {
	return (
		<div
			className={cn(
				'bg-neutral-50 flex flex-col gap-4 items-start px-[22px] py-5 relative rounded-12 w-[784px]',
				className
			)}
		>
			{/* 규칙 1 */}
			<div className="flex flex-col items-start relative shrink-0 w-full">
				<p className="title-3 font-semibold text-primary-600-normal h-6 justify-center leading-[1.4] w-full">
					<span className="text-neutral-900">1. </span>
					<span>대기 만료 시, 매칭이 자동 거절 처리</span>
				</p>
			</div>

			{/* 규칙 2 */}
			<div className="flex flex-col items-start relative shrink-0 w-full">
				<p className="title-3 font-semibold text-primary-600-normal h-6 justify-center leading-[1.4] w-full">
					<span className="text-neutral-900">2. </span>
					<span>24시간 동안의 매칭 취소 </span>
					<span className="body-1 font-medium">/</span>
					<span> 거절 </span>
					<span className="body-1 font-medium">/ </span>
					<span>수락은 번복 불가</span>
				</p>
			</div>

			{/* 규칙 3 */}
			<div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
				<p className="title-3 font-semibold text-primary-600-normal h-6 justify-center leading-[1.4] w-full">
					<span className="text-neutral-900">3. </span>
					<span>리더가 직접 보내는 요청은 파트당 최대 3명까지 가능 (24시간 동안)</span>
				</p>
				<div className="flex flex-col body-1 font-medium text-neutral-700 tracking-[-0.08px] w-full whitespace-pre-wrap">
					<p className="mb-0 leading-[1.5]">
						리더는 24시간동안 한 프로젝트의 파트당 최대 3명에게{' '}
						<span className="font-bold">매칭 요청을 직접 보낼 수 있습니다.</span>
					</p>
					<p className="leading-[1.5]">이때, 유저가 보내오는 프로젝트 매칭 요청은 포함되지 않습니다.</p>
				</div>
			</div>
		</div>
	)
}

export default MatchingNotice
