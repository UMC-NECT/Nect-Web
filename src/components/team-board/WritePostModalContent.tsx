import { useRef } from 'react'
import PlusIcon from '@/assets/icons/common/plus.svg?react'
import LinkIcon from '@/assets/icons/team-board/link.svg?react'
import XIcon from '@/assets/icons/common/X.svg?react'
import CheckboxIcon from '@/assets/icons/common/checkbox.svg?react'
import MoreIcon from '@/components/mission-modal/MoreIcon.svg?react'
import FigmaIcon from '@/assets/icons/app/figma.svg?react'
import PdfIcon from '@/assets/icons/app/pdf.svg?react'
import WordIcon from '@/assets/icons/app/Word.svg?react'
import ExcelIcon from '@/assets/icons/app/Excel.svg?react'
import PPTIcon from '@/assets/icons/app/PPT.svg?react'
import ZipIcon from '@/assets/icons/app/Zip.svg?react'
import JPEGIcon from '@/assets/icons/app/JPEG.svg?react'
import JPGIcon from '@/assets/icons/app/JPG.svg?react'
import PNGIcon from '@/assets/icons/app/PNG.svg?react'
import MP4Icon from '@/assets/icons/app/MP4.svg?react'
import MOVIcon from '@/assets/icons/app/MOV.svg?react'
import EtcIcon from '@/assets/icons/app/Etc.svg?react'

export interface PostAttachment {
	id: string
	type: 'file' | 'link'
	name: string
	url?: string
	fileName?: string
}

export type WritePostModalContentMode = 'create' | 'view' | 'edit'

interface WritePostModalContentProps {
	mode?: WritePostModalContentMode
	title: string
	content: string
	isNotice: boolean
	files: File[]
	attachments?: PostAttachment[]
	onTitleChange?: (title: string) => void
	onContentChange?: (content: string) => void
	onNoticeChange?: (isNotice: boolean) => void
	onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	onFileRemove?: (index: number) => void
	onAttachmentRemove?: (id: string) => void
	fileInputRef?: React.RefObject<HTMLInputElement | null>
}

const WritePostModalContent = ({
	mode = 'create',
	title,
	content,
	isNotice,
	files,
	attachments = [],
	onTitleChange,
	onContentChange,
	onNoticeChange,
	onFileChange,
	onFileRemove,
	onAttachmentRemove,
	fileInputRef: externalFileInputRef,
}: WritePostModalContentProps) => {
	const internalFileInputRef = useRef<HTMLInputElement | null>(null)
	const fileInputRef = (externalFileInputRef || internalFileInputRef) as React.RefObject<HTMLInputElement | null>
	const isViewMode = mode === 'view'
	const isCreateMode = mode === 'create'
	const isEditMode = mode === 'edit'
	const isEditable = isCreateMode || isEditMode

	const handleFileAdd = () => {
		fileInputRef.current?.click()
	}

	// 파일 추가는 부모 컴포넌트에서 처리

	/**
	 * 파일 확장자에 따른 아이콘 반환
	 */
	const getFileIconByExtension = (fileName?: string) => {
		if (!fileName) return null

		const extension = fileName.split('.').pop()?.toUpperCase()
		if (!extension) return null

		switch (extension) {
			case 'FIGMA':
				return <FigmaIcon className="w-7 h-7" />
			case 'PDF':
				return <PdfIcon className="w-7 h-7" />
			case 'DOC':
			case 'DOCX':
				return <WordIcon className="w-7 h-7" />
			case 'XLS':
			case 'XLSX':
			case 'CSV':
				return <ExcelIcon className="w-7 h-7" />
			case 'PPT':
			case 'PPTX':
				return <PPTIcon className="w-7 h-7" />
			case 'ZIP':
			case 'RAR':
			case '7Z':
				return <ZipIcon className="w-7 h-7" />
			case 'JPEG':
				return <JPEGIcon className="w-7 h-7" />
			case 'JPG':
				return <JPGIcon className="w-7 h-7" />
			case 'PNG':
				return <PNGIcon className="w-7 h-7" />
			case 'MP4':
				return <MP4Icon className="w-7 h-7" />
			case 'MOV':
				return <MOVIcon className="w-7 h-7" />
			default:
				return <EtcIcon className="w-7 h-7" />
		}
	}

	const getAttachmentIcon = (attachment: PostAttachment) => {
		if (attachment.type === 'link') {
			if (attachment.url?.includes('figma.com')) {
				return <FigmaIcon className="w-7 h-7" />
			}
			return <LinkIcon className="w-[18px] h-[18px] text-neutral-400" />
		}
		// 파일 타입인 경우 확장자에 따라 아이콘 반환
		if (attachment.fileName) {
			const icon = getFileIconByExtension(attachment.fileName)
			if (icon) return icon
		}
		return <EtcIcon className="w-7 h-7" />
	}

	return (
		<div className="flex gap-4 items-end">
			{/* 왼쪽: 제목, 내용, 공지 체크박스 */}
			<div className="flex flex-col h-[514px] items-start justify-between pb-[18px] w-[678px] relative">
				{/* 제목 */}
				{isViewMode ? (
					<div className="heading-2 font-bold leading-[1.3] w-[572px] overflow-hidden text-ellipsis whitespace-nowrap">
						{isNotice && <span className="text-primary-600-normal">[공지]</span>}
						<span className="text-neutral-900">{isNotice ? ` ${title}` : title}</span>
					</div>
				) : (
					<input
						type="text"
						value={title}
						onChange={(e) => {
							const newValue = e.target.value
							if (newValue.length <= 20) {
								onTitleChange?.(newValue)
							}
						}}
						maxLength={20}
						className={`heading-2 font-bold leading-[1.3] bg-transparent border-none outline-none w-[572px] overflow-hidden text-ellipsis whitespace-nowrap ${
							title ? 'text-neutral-900' : 'text-neutral-300'
						} placeholder:text-neutral-300`}
						placeholder="제목을 작성해주세요제목을 작성해주세요제목을작성"
					/>
				)}

				{/* 공지 체크박스 - create/edit 모드에서 표시, absolute로 제목 아래 18px에 배치 */}
				{isEditable && (
					<div className="absolute top-[18px] right-0 flex gap-1.5 h-[30px] items-center pr-1.5">
						<button
							onClick={() => onNoticeChange?.(!isNotice)}
							className="flex items-center justify-center cursor-pointer transition-colors relative"
						>
							<div className={!isNotice ? '[&>path]:opacity-0' : ''}>
								<CheckboxIcon
									className={`w-4 h-4 ${isNotice ? 'text-primary-400-normal' : 'text-neutral-300'}`}
								/>
							</div>
						</button>
						<span
							className={`body-1 font-medium leading-[1.8] tracking-[-0.08px] whitespace-nowrap ${
								isNotice ? 'text-primary-500-normal' : 'text-neutral-300'
							}`}
						>
							공지
						</span>
					</div>
				)}

				{/* 내용 입력 영역 */}
				<div className={`flex flex-col ${isEditable ? 'gap-3' : ''} items-end mb-[-18px] w-full`}>
					{/* 내용 */}
					{isViewMode ? (
						<div className="bg-neutral-000 border border-neutral-100 rounded-md flex flex-col h-[454px] items-start px-4 py-3 w-[678px]">
							<div className="body-2 font-regular text-neutral-900 leading-normal whitespace-pre-wrap">
								{content}
							</div>
						</div>
					) : (
						<textarea
							value={content}
							onChange={(e) => {
								const newValue = e.target.value
								if (newValue.length <= 1000) {
									onContentChange?.(newValue)
								}
							}}
							maxLength={1000}
							className={`${isEditMode ? '' : 'bg-neutral-50'} border border-neutral-100 rounded-md flex flex-col h-[454px] items-start px-4 py-3 w-[678px] resize-none outline-none body-2 font-regular placeholder:text-neutral-300`}
							placeholder="내용을 작성하세요."
						/>
					)}
				</div>
			</div>

			{/* 오른쪽: 첨부 파일 */}
			<div className="flex flex-col gap-3 h-[490px] items-start w-[230px]">
				{/* 첨부 파일 헤더 */}
				<div className="flex flex-col items-start pl-1 w-full">
					<div className="flex h-6 items-center justify-between w-full">
						<span className="body-1 font-semibold text-neutral-900 tracking-[-0.32px]">첨부 파일</span>
						{isEditable && (
							<button
								onClick={handleFileAdd}
								className="bg-[rgba(250,250,250,0.2)] border border-neutral-200 rounded-md flex gap-0.5 items-center justify-center pl-1.5 pr-2.5 py-0.5 hover:bg-neutral-100 transition-colors shadow-inner-neutral-2"
							>
								<PlusIcon className="w-4 h-4 text-neutral-400" />
								<span className="body-3 font-medium text-neutral-400 tracking-[-0.26px] whitespace-nowrap">
									추가
								</span>
							</button>
						)}
						<input
							ref={fileInputRef}
							type="file"
							multiple
							className="hidden"
							onChange={onFileChange}
						/>
					</div>
				</div>

				{/* 파일 목록 영역 */}
				<div
					className={`border border-neutral-100 rounded-md flex flex-1 flex-col items-start py-2 w-full min-h-0 ${
						isViewMode
							? ''
							: isEditMode
								? ''
								: attachments.length > 0 || files.length > 0
									? ''
									: 'bg-neutral-50'
					}`}
				>
					{attachments.length === 0 && files.length === 0 ? (
						isEditable ? (
							<div className="flex flex-col items-start px-3.5 py-2 w-full">
									<div className="flex items-center">
										<div className="relative shrink-0 w-7 h-7">
											<div className="absolute bg-neutral-50 inset-0 rounded-[6.222px] flex items-center justify-center shadow-inner-neutral-2">
												<LinkIcon className="w-[18px] h-[18px] text-neutral-300" />
											</div>
										</div>
									<div className="flex flex-col items-start leading-0 text-neutral-300 ml-2.5 w-[164px]">
										<div className="flex flex-col font-semibold caption-1 justify-center overflow-hidden relative shrink-0 text-xs w-full whitespace-nowrap">
											<span className="leading-normal overflow-hidden">제목</span>
										</div>
										<div className="flex flex-col font-regular justify-center overflow-hidden relative shrink-0 text-[9px] w-full">
											<span className="leading-[1.4] whitespace-pre-wrap">링크 붙여넣기 및 파일 드래그</span>
										</div>
									</div>
								</div>
							</div>
						) : null
					) : (
						<div className="flex flex-col gap-0 w-full">
							{/* 기존 첨부 파일 */}
							{attachments.map((attachment) => (
								<div key={attachment.id} className="flex gap-2.5 items-center px-3.5 py-2 w-full relative group">
									{/* 아이콘 */}
									<div className="relative shrink-0 w-7 h-7">
										<div
											className={`absolute inset-0 rounded-[6.222px] ${
												attachment.type === 'link' && attachment.url?.includes('figma.com')
													? 'bg-[#141515]'
													: 'bg-neutral-50'
											} shadow-inner-neutral-1`}
										/>
										<div className="absolute inset-0 flex items-center justify-center overflow-hidden">
											{getAttachmentIcon(attachment)}
										</div>
									</div>

									{/* 파일 정보 */}
									<div className="flex-1 min-w-0 flex items-center">
										<div className="flex flex-col flex-1 min-w-0">
											<div className="caption-1 font-semibold text-neutral-800 truncate">
												{attachment.name}
											</div>
											<div className="text-[9px] leading-[1.4] text-neutral-400 truncate">
												{attachment.type === 'link'
													? attachment.url
													: `파일명: ${attachment.fileName || '알 수 없음'}`}
											</div>
										</div>

										{/* 더보기 메뉴 - view 모드에서는 표시하지 않음 */}
										{isEditable && onAttachmentRemove && (
											<div className="relative shrink-0">
												<button
													onClick={(e) => {
														e.stopPropagation()
														onAttachmentRemove(attachment.id)
													}}
													className="w-4 h-4 flex items-center justify-center hover:bg-neutral-200 rounded-md transition-colors"
												>
													<MoreIcon className="w-4 h-4" />
												</button>
											</div>
										)}
									</div>
								</div>
							))}

							{/* 새로 추가된 파일 */}
							{files.map((file, index) => {
								const fileIcon = getFileIconByExtension(file.name)
								return (
									<div key={`file-${index}`} className="flex gap-2.5 items-center px-3.5 py-2 w-full">
										{/* 아이콘 */}
										<div className="relative shrink-0 w-7 h-7">
											<div className="absolute inset-0 rounded-[6.222px] bg-neutral-50 shadow-inner-neutral-1" />
											<div className="absolute inset-0 flex items-center justify-center overflow-hidden">
												{fileIcon || <EtcIcon className="w-7 h-7" />}
											</div>
										</div>
										<div className="flex-1 min-w-0">
											<div className="caption-1 font-semibold text-neutral-900 truncate">{file.name}</div>
										</div>
										{isEditable && onFileRemove && (
											<button
												onClick={() => onFileRemove(index)}
												className="w-4 h-4 flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
											>
												<XIcon className="w-4 h-4 text-neutral-400" />
											</button>
										)}
									</div>
								)
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default WritePostModalContent
