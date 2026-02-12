import { cn } from '@/utils/cn'
import type { NoticeItem } from '@/constants/matchingNotice'

interface MatchingNoticeProps {
	/** 유의사항 항목 목록 */
	items: NoticeItem[]
	/** 추가 클래스명 */
	className?: string
}

const MatchingNotice = ({ items, className }: MatchingNoticeProps) => {
	return (
		<div
			className={cn(
				'bg-neutral-50 flex flex-col gap-4 items-start px-[22px] py-5 relative rounded-12 w-[784px]',
				className
			)}
		>
			{items.map((item, index) => (
				<div
					key={index}
					className={cn(
						'flex flex-col items-start relative shrink-0 w-full',
						item.subText && 'gap-3'
					)}
				>
					{/* 규칙 메인 텍스트 */}
					<p className="title-3 font-semibold text-primary-600-normal h-6 justify-center leading-[1.4] w-full">
						<span className="text-neutral-900">{item.number}. </span>
						{/* 텍스트 내부의 "/" 처리 */}
						{item.text.split(/(\/)/).map((part, partIndex) => {
							if (part === '/') {
								return <span key={partIndex} className="body-1 font-medium">{part}</span>
							}
							return <span key={partIndex}>{part}</span>
						})}
					</p>

					{/* 규칙 하위 설명 텍스트 */}
					{item.subText && (
						<div className="flex flex-col body-1 font-medium text-neutral-700 tracking-[-0.08px] w-full whitespace-pre-wrap">
							{item.subText.split('\n').map((line, lineIndex) => (
								<p key={lineIndex} className={lineIndex === 0 ? 'mb-0 leading-[1.5]' : 'leading-[1.5]'}>
									{line.split(/(\*\*.*?\*\*)/).map((segment, segIndex) => {
										if (segment.startsWith('**') && segment.endsWith('**')) {
											return (
												<span key={segIndex} className="font-bold">
													{segment.slice(2, -2)}
												</span>
											)
										}
										return <span key={segIndex}>{segment}</span>
									})}
								</p>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	)
}

export default MatchingNotice
