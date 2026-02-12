export type WritePostModalHeaderMode = 'create' | 'edit' | 'view'

interface WritePostModalHeaderProps {
	mode?: WritePostModalHeaderMode
	onSave?: () => void
	onDelete?: () => void
	buttonText?: string
}

const WritePostModalHeader = ({
	mode = 'create',
	onSave,
	onDelete,
	buttonText = '등록',
}: WritePostModalHeaderProps) => {
	const isViewMode = mode === 'view'
	const isEditMode = mode === 'edit'

	return (
		<div className="flex h-[34px] items-start justify-between mb-2.5">
			<div className="flex items-center justify-center py-0.5">
				<span className="body-2 font-bold text-neutral-400 whitespace-nowrap">게시판 글쓰기</span>
			</div>
			{!isViewMode && (
				<div className="flex gap-2.5 items-center justify-end">
					{isEditMode && onDelete && (
						<button
							onClick={onDelete}
							className="bg-neutral-50 border-[1.5px] border-neutral-100 flex h-8 items-center px-2.5 py-3 rounded-md w-[60px] hover:bg-neutral-100 transition-colors"
						>
							<span className="flex-1 body-2 font-semibold text-neutral-900 text-center whitespace-pre-wrap">
								삭제
							</span>
						</button>
					)}
					{onSave && (
						<button
							onClick={onSave}
							className={`flex h-8 items-center px-2.5 py-3 rounded-md w-[60px] transition-colors ${
								isEditMode
									? 'bg-primary-150-light hover:bg-primary-200-light'
									: 'bg-primary-400-normal hover:bg-primary-500-normal'
							}`}
						>
							<span
								className={`flex-1 button-1 font-semibold text-center whitespace-pre-wrap ${
									isEditMode ? 'text-primary-500-normal' : 'text-neutral-50'
								}`}
							>
								{isEditMode ? '저장' : buttonText}
							</span>
						</button>
					)}
				</div>
			)}
		</div>
	)
}

export default WritePostModalHeader
