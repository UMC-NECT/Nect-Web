import { useState, useRef } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import WritePostModalHeader from './WritePostModalHeader'
import WritePostModalContent, { type PostAttachment, type WritePostModalContentMode } from './WritePostModalContent'

interface WritePostModalProps {
	isOpen: boolean
	onClose: () => void
	mode?: WritePostModalContentMode
	initialTitle?: string
	initialContent?: string
	initialIsNotice?: boolean
	initialAttachments?: PostAttachment[]
	onSave?: (title: string, content: string, isNotice: boolean, files: File[]) => void
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
}: WritePostModalProps) => {
	const [title, setTitle] = useState(initialTitle)
	const [content, setContent] = useState(initialContent)
	const [isNotice, setIsNotice] = useState(initialIsNotice)
	const [files, setFiles] = useState<File[]>([])
	const [attachments, setAttachments] = useState<PostAttachment[]>(initialAttachments)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const modalRef = useRef<HTMLDivElement>(null)
	const isViewMode = mode === 'view'
	const isCreateMode = mode === 'create'

	useClickOutside(modalRef, () => {
		if (isOpen) {
			handleClose()
		}
	}, isOpen)

	const handleClose = () => {
		if (isCreateMode) {
			setTitle('')
			setContent('')
			setIsNotice(false)
			setFiles([])
		}
		setAttachments([])
		onClose()
	}

	const handleSave = () => {
		if (!title.trim() || !onSave) {
			return
		}
		onSave(title, content, isNotice, files)
		handleClose()
	}

	const handleFileAdd = () => {
		fileInputRef.current?.click()
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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div
				ref={modalRef}
				className="bg-neutral-000 rounded-xl flex flex-col px-[58px] py-[34px] w-[1040px] max-h-[90vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				{/* 헤더 */}
				<WritePostModalHeader
					mode={isViewMode ? 'view' : 'create'}
					onSave={isViewMode ? undefined : handleSave}
				/>

				{/* 메인 콘텐츠 */}
				<WritePostModalContent
					mode={mode}
					title={title}
					content={content}
					isNotice={isNotice}
					files={files}
					attachments={attachments}
					onTitleChange={setTitle}
					onContentChange={setContent}
					onNoticeChange={setIsNotice}
					onFileAdd={handleFileAdd}
					onFileChange={handleFileInputChange}
					onFileRemove={handleFileRemove}
					onAttachmentRemove={handleAttachmentRemove}
					fileInputRef={fileInputRef}
				/>
			</div>
		</div>
	)
}

export default WritePostModal
