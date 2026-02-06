import EditPencilIcon from '@/assets/icons/mypage/edit-pencil.svg?react'

interface ContentHeaderProps {
	title: string
	description: string
	buttonText?: string
	onButtonClick?: () => void
	className?: string
}

const ContentHeader = ({
	title,
	description,
	buttonText = '글쓰기',
	onButtonClick,
	className = '',
}: ContentHeaderProps) => {
	return (
		<div className={`flex items-end justify-between w-[1224px] ${className}`}>
			{/* 왼쪽: 제목과 설명 */}
			<div className="flex flex-col gap-2 items-start">
				<h1 className="heading-2 font-bold text-neutral-900">{title}</h1>
				<p className="title-3 font-medium text-[#5f5f5f] whitespace-pre-wrap">{description}</p>
			</div>

			{/* 오른쪽: 글쓰기 버튼 */}
			<button
				onClick={onButtonClick}
				className="bg-neutral-50 border border-neutral-200 rounded-xl pl-3 pr-[14px] py-2.5 flex items-center justify-center gap-1.5 hover:bg-neutral-100 transition-colors"
			>
				<EditPencilIcon className="w-4 h-4 text-neutral-400 shrink-0" />
				<span className="body-1 font-medium text-neutral-400">{buttonText}</span>
			</button>
		</div>
	)
}

export default ContentHeader
