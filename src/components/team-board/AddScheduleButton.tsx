import PlusIcon from '@/assets/icons/common/plus.svg?react'

interface AddScheduleButtonProps {
	onClick?: () => void
	className?: string
}

const AddScheduleButton = ({ onClick, className = '' }: AddScheduleButtonProps) => {
	return (
		<button
			onClick={onClick}
			className={`self-stretch w-[392px] h-[54px] bg-neutral-50 rounded-xl outline-1 -outline-offset-1 outline-neutral-200 hover:bg-neutral-100 inline-flex justify-start items-center overflow-hidden ${className}`}
		>
			<div className="flex-1 p-3 inline-flex flex-col justify-start items-start">
				<div className="self-stretch flex flex-col justify-start items-start">
					<div className="self-stretch inline-flex justify-center items-center gap-1.5">
						{/* 플러스 아이콘 */}
						<PlusIcon className="w-4 h-4 text-neutral-400" />
						<div className="justify-start text-neutral-400 body-1 font-regular line-clamp-1">새 일정 추가하기</div>
					</div>
				</div>
			</div>
		</button>
	)
}

export default AddScheduleButton
