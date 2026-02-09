import { useState, useRef, useEffect, useMemo } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import WritePostModalHeader from './WritePostModalHeader'
import WritePostModalContent, { type PostAttachment, type WritePostModalContentMode } from './WritePostModalContent'
import CTAModal from '@/components/common/CTAModal'

interface WritePostModalProps {
	isOpen: boolean
	onClose: () => void
	mode?: WritePostModalContentMode
	initialTitle?: string
	initialContent?: string
	initialIsNotice?: boolean
	initialAttachments?: PostAttachment[]
	onSave?: (title: string, content: string, isNotice: boolean, files: File[]) => void
	onUpdate?: (title: string, content: string, isNotice: boolean, files: File[]) => void
	onDelete?: () => void
	isOwner?: boolean
}

const WritePostModal = ({
	isOpen,
	onClose,
	mode = 'create',
	initialTitle = '',
	initialContent = '',
	initialIsNotice = false,
	initialAttachments = [],
	onSave,
	onUpdate,
	onDelete,
	isOwner = false,
}: WritePostModalProps) => {
	const [title, setTitle] = useState(initialTitle)
	const [content, setContent] = useState(initialContent)
	const [isNotice, setIsNotice] = useState(initialIsNotice)
	const [files, setFiles] = useState<File[]>([])
	const [attachments, setAttachments] = useState<PostAttachment[]>(initialAttachments)
	const [currentMode, setCurrentMode] = useState<WritePostModalContentMode>(mode)
	const [ctaModalType, setCtaModalType] = useState<'unsavedChanges' | 'delete' | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const modalRef = useRef<HTMLDivElement>(null)
	const isViewMode = currentMode === 'view'
	const isEditMode = currentMode === 'edit'
	const isCreateMode = currentMode === 'create'

	// 변경사항 추적
	const initialAttachmentsString = useMemo(() => JSON.stringify(initialAttachments), [initialAttachments])
	const attachmentsString = useMemo(() => JSON.stringify(attachments), [attachments])
	
	const isDirty = useMemo(() => {
		if (isViewMode) return false
		if (isCreateMode) {
			return title.trim() !== '' || content.trim() !== '' || isNotice || files.length > 0
		}
		if (isEditMode) {
			return (
				title !== initialTitle ||
				content !== initialContent ||
				isNotice !== initialIsNotice ||
				files.length > 0 ||
				attachmentsString !== initialAttachmentsString
			)
		}
		return false
	}, [title, content, isNotice, files, attachmentsString, initialTitle, initialContent, initialIsNotice, initialAttachmentsString, isViewMode, isCreateMode, isEditMode])

	// 모드가 변경되면 currentMode 업데이트
	// view 모드이고 본인 게시물이면 바로 edit 모드로
	useEffect(() => {
		if (mode === 'view' && isOwner && isOpen) {
			setCurrentMode('edit')
		} else {
			setCurrentMode(mode)
		}
	}, [mode, isOpen, isOwner])

	// 초기값이 변경되면 상태 업데이트
	useEffect(() => {
		if (isOpen) {
			setTitle(initialTitle)
			setContent(initialContent)
			setIsNotice(initialIsNotice)
			setFiles([]) // 모달 열릴 때 새로 추가된 파일은 초기화
			setAttachments(initialAttachments)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen])

	useClickOutside(modalRef, () => {
		if (isOpen && !ctaModalType) {
			handleCloseRequest()
		}
	}, isOpen && !ctaModalType)

	const handleCloseRequest = () => {
		if (isDirty) {
			setCtaModalType('unsavedChanges')
		} else {
			handleClose()
		}
	}

	const handleClose = () => {
		// 모달 닫을 때 상태 초기화 (create 모드일 때만)
		if (isCreateMode) {
			setTitle('')
			setContent('')
			setIsNotice(false)
			setFiles([])
			setAttachments([])
		} else if (isEditMode) {
			// edit 모드에서 닫을 때는 원래 값으로 복원
			setTitle(initialTitle)
			setContent(initialContent)
			setIsNotice(initialIsNotice)
			setFiles([])
			setAttachments(initialAttachments)
			setCurrentMode('view')
		}
		setCtaModalType(null)
		onClose()
	}

	const handleSave = (shouldClose = true) => {
		if (!title.trim()) {
			return false
		}
		if (isCreateMode && onSave) {
			onSave(title, content, isNotice, files)
		} else if (isEditMode && onUpdate) {
			onUpdate(title, content, isNotice, files)
		}
		if (shouldClose) {
			handleClose()
		}
		return true
	}

	const handleDeleteClick = () => {
		setCtaModalType('delete')
	}

	const handleDeleteConfirm = () => {
		if (onDelete) {
			onDelete()
			handleClose()
		}
	}

	const handleCancelDelete = () => {
		setCtaModalType(null)
	}

	const handleLeaveWithoutSaving = () => {
		setCtaModalType(null)
		// 모달은 닫지 않고 CTA 모달만 닫기
	}

	const handleSaveAndLeave = () => {
		const success = handleSave(false) // 저장만 하고 닫지는 않음
		if (success) {
			setCtaModalType(null)
			handleClose() // 저장 성공 후 닫기
		}
	}

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || [])
		setFiles([...files, ...selectedFiles])
	}

	const handleFileRemove = (index: number) => {
		setFiles(files.filter((_, i) => i !== index))
	}

	const handleAttachmentRemove = (id: string) => {
		setAttachments(attachments.filter((att) => att.id !== id))
	}

	if (!isOpen) return null

	return (
		<>
			{/* 글쓰기 모달 */}
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
				<div
					ref={modalRef}
					className="bg-neutral-000 rounded-xl flex flex-col px-[58px] py-[34px] w-[1040px] max-h-[90vh] overflow-y-auto"
					onClick={(e) => e.stopPropagation()}
				>
					{/* 헤더 */}
					<WritePostModalHeader
						mode={isViewMode ? 'view' : isEditMode ? 'edit' : 'create'}
						onSave={isViewMode ? undefined : handleSave}
						onDelete={isEditMode ? handleDeleteClick : undefined}
					/>

					{/* 메인 콘텐츠 */}
					<WritePostModalContent
						mode={currentMode}
						title={title}
						content={content}
						isNotice={isNotice}
						files={files}
						attachments={attachments}
						onTitleChange={setTitle}
						onContentChange={setContent}
						onNoticeChange={setIsNotice}
						onFileChange={handleFileInputChange}
						onFileRemove={handleFileRemove}
						onAttachmentRemove={handleAttachmentRemove}
						fileInputRef={fileInputRef}
					/>
				</div>
			</div>

			{/* 저장하지 않고 나가기 확인 모달 */}
			{ctaModalType === 'unsavedChanges' && (
				<CTAModal
					message={`저장되지 않았습니다${'\n'}저장 후 페이지를 나가시겠습니까?`}
					leftButtonMsg="돌아가기"
					rightButtonMsg="저장 후 나가기"
					onLeftClick={handleLeaveWithoutSaving}
					onRightClick={handleSaveAndLeave}
				/>
			)}

			{/* 삭제 확인 모달 */}
			{ctaModalType === 'delete' && (
				<CTAModal
					message="{삭제} 하시겠습니까?"
					leftButtonMsg="돌아가기"
					rightButtonMsg="삭제"
					onLeftClick={handleCancelDelete}
					onRightClick={handleDeleteConfirm}
				/>
			)}
		</>
	)
}

export default WritePostModal
