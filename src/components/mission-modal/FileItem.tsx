import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/utils/cn'
import type { FileItem as FileItemData } from '@/stores/mission-modal/missionModalStore'
import EtcIcon from '@/assets/icons/app/Etc.svg?react'
import ExcelIcon from '@/assets/icons/app/Excel.svg?react'
import FigmaIcon from '@/assets/icons/app/figma.svg?react'
import JpegIcon from '@/assets/icons/app/JPEG.svg?react'
import JpgIcon from '@/assets/icons/app/JPG.svg?react'
import MovIcon from '@/assets/icons/app/MOV.svg?react'
import Mp4Icon from '@/assets/icons/app/MP4.svg?react'
import PdfIcon from '@/assets/icons/app/pdf.svg?react'
import PngIcon from '@/assets/icons/app/PNG.svg?react'
import PptIcon from '@/assets/icons/app/PPT.svg?react'
import WordIcon from '@/assets/icons/app/Word.svg?react'
import ZipIcon from '@/assets/icons/app/Zip.svg?react'
import LinkIcon from './LinkIcon.svg?react'
import MoreIcon from '@/components/mission-modal/MoreIcon.svg?react'

interface FileItemProps {
	data?: FileItemData
	isEditing?: boolean
	onSave?: (data: Omit<FileItemData, 'id'>) => void
	onCancel?: () => void
	onClick?: () => void
	onDelete?: () => void
	onDownload?: () => void
	className?: string
}

// 파일 확장자에 따른 아이콘 매핑
const getFileIcon = (fileName: string) => {
	const extension = fileName.split('.').pop()?.toLowerCase()

	switch (extension) {
		case 'xlsx':
		case 'xls':
		case 'csv':
			return ExcelIcon
		case 'jpeg':
			return JpegIcon
		case 'jpg':
			return JpgIcon
		case 'png':
			return PngIcon
		case 'mov':
			return MovIcon
		case 'mp4':
			return Mp4Icon
		case 'pdf':
			return PdfIcon
		case 'pptx':
		case 'ppt':
			return PptIcon
		case 'docx':
		case 'doc':
			return WordIcon
		case 'zip':
		case 'rar':
		case '7z':
			return ZipIcon
		default:
			return EtcIcon
	}
}

// 링크 URL에 따른 아이콘 매핑
const getLinkIcon = (url: string) => {
	const lowerUrl = url.toLowerCase()

	if (lowerUrl.includes('figma.com') || lowerUrl.includes('figma')) {
		return FigmaIcon
	}
	if (lowerUrl.includes('docs.google.com/spreadsheets') || lowerUrl.includes('sheets.google.com')) {
		return ExcelIcon
	}
	if (lowerUrl.includes('docs.google.com/presentation') || lowerUrl.includes('slides.google.com')) {
		return PptIcon
	}
	if (lowerUrl.includes('docs.google.com/document') || lowerUrl.includes('docs.google.com')) {
		return WordIcon
	}

	return EtcIcon
}

const FileItem = ({ data, isEditing = false, onSave, onCancel, onClick, onDelete, onDownload, className }: FileItemProps) => {
	const [editName, setEditName] = useState('')
	const [editUrl, setEditUrl] = useState('')
	const [droppedFile, setDroppedFile] = useState<File | null>(null)
	const [showMenu, setShowMenu] = useState(false)
	const dropZoneRef = useRef<HTMLDivElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)

	// 메뉴 외부 클릭 감지
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setShowMenu(false)
			}
		}

		if (showMenu) {
			document.addEventListener('mousedown', handleClickOutside)
		}
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [showMenu])

	// 아이콘 렌더링 함수
	const renderIcon = () => {
		if (data?.type === 'file' && data?.fileName) {
			const Icon = getFileIcon(data.fileName)
			return <Icon />
		}
		if (data?.type === 'link' && data?.url) {
			const Icon = getLinkIcon(data.url)
			return <Icon />
		}
		// 편집 모드에서 드롭된 파일이 있는 경우
		if (droppedFile) {
			const Icon = getFileIcon(droppedFile.name)
			return <Icon />
		}
		// 편집(추가) 모드 기본 아이콘
		if (isEditing) {
			return <LinkIcon />
		}
		return <EtcIcon />
	}

	// 드래그 앤 드롭 핸들러
	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
	}, [])

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			e.stopPropagation()

			const files = e.dataTransfer.files
			if (files.length > 0) {
				const file = files[0]
				setDroppedFile(file)
				setEditUrl('')
				if (!editName) {
					// 파일명에서 확장자 제거하여 제목으로 설정
					const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
					setEditName(nameWithoutExt)
				}
			}
		},
		[editName]
	)

	// URL 붙여넣기 핸들러
	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditUrl(e.target.value)
		setDroppedFile(null)
	}

	// 저장 핸들러
	const handleSave = () => {
		if (!editName.trim()) return

		if (droppedFile) {
			// 파일을 Blob URL로 변환하여 저장 (다운로드를 위해)
			const blobUrl = URL.createObjectURL(droppedFile)
			onSave?.({
				type: 'file',
				name: editName.trim(),
				fileName: droppedFile.name,
				url: blobUrl,
			})
		} else if (editUrl.trim()) {
			onSave?.({
				type: 'link',
				name: editName.trim(),
				url: editUrl.trim(),
			})
		}
	}

	// Enter 키 핸들러
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && editName.trim() && (droppedFile || editUrl.trim())) {
			handleSave()
		}
		if (e.key === 'Escape') {
			onCancel?.()
		}
	}

	// 편집 모드 렌더링
	if (isEditing) {
		return (
			<div
				ref={dropZoneRef}
				className={cn(
					'flex gap-2.5 items-center bg-neutral-100 py-2 px-3.5 w-full rounded-md transition-colors',
					className
				)}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				{/* 아이콘 */}
				<div className='relative shrink-0 w-7 h-7'>
					<div className='absolute inset-0 bg-neutral-50 rounded-[6px] shadow-inner-neutral-1' />
					<div className='absolute inset-0 flex items-center justify-center'>{renderIcon()}</div>
				</div>

				{/* 입력 필드 */}
				<div className='flex flex-col flex-1 min-w-0 gap-0.5'>
					<input
						type='text'
						className='caption-1 text-[13px]! font-semibold text-neutral-800 bg-transparent outline-none placeholder:text-neutral-400 w-full'
						placeholder='제목'
						value={editName}
						onChange={e => setEditName(e.target.value)}
						onKeyDown={handleKeyDown}
						autoFocus
					/>
					<div className='text-[9px] leading-[1.4] text-neutral-400 flex items-center gap-1'>
						{droppedFile ? (
							<span className='text-neutral-600 truncate'>{droppedFile.name}</span>
						) : (
							<>
								<input
									type='text'
									className='bg-transparent outline-none placeholder:text-neutral-400 flex-1 min-w-0'
									placeholder='링크 붙여넣기 및 파일 드래그'
									value={editUrl}
									onChange={handleUrlChange}
									onKeyDown={handleKeyDown}
								/>
							</>
						)}
					</div>
				</div>
			</div>
		)
	}

	// 데이터가 없으면 렌더링하지 않음
	if (!data) return null

	// 상세 정보 텍스트
	const detailText = data.type === 'file' ? `파일명: ${data.fileName || '알 수 없음'}` : `${data.url || '알 수 없음'}`

	return (
		<div
			className={cn(
				'group/item flex gap-2.5 items-center py-2 px-3.5 w-full cursor-pointer rounded-md transition-colors hover:bg-neutral-100 has-[.more-icon:hover]:bg-transparent',
				className
			)}
			onClick={onClick}
		>
			{/* 아이콘 */}
			<div className='relative shrink-0 w-7 h-7'>
				<div className='absolute inset-0 bg-neutral-50 rounded-[6px] shadow-inner-neutral-1' />
				<div className='absolute inset-0 flex items-center justify-center'>{renderIcon()}</div>
			</div>

			{/* 텍스트 정보 */}
			<div className='flex flex-col flex-1 min-w-0'>
				<p className='caption-1 text-[13px]! font-semibold text-neutral-800 truncate'>{data.name}</p>
				<p className={cn('text-[9px] leading-[1.4] text-neutral-400 truncate', data.type === 'link' && ' underline')}>
					{detailText}
				</p>
			</div>

			<div className='more-icon relative' ref={menuRef}>
				<div
					className='flex items-center justify-center hover:bg-neutral-200 rounded-md p-1 -mr-1 transition-colors'
					onClick={e => {
						e.stopPropagation()
						setShowMenu(!showMenu)
					}}
				>
					<MoreIcon />
				</div>

				{/* 드롭다운 메뉴 */}
				{showMenu && (
					<div className='absolute right-0 top-full mt-1 bg-white rounded-lg shadow-drop-neutral-1 py-2 z-50 min-w-[90px]'>
						{data.type === 'file' && (
							<button
								className='w-full px-4 py-1.5 text-left caption-1 text-neutral-800 hover:bg-neutral-50 transition-colors'
								onClick={e => {
									e.stopPropagation()
									onDownload?.()
									setShowMenu(false)
								}}
							>
								다운로드
							</button>
						)}
						<button
							className='w-full px-4 py-1.5 text-left caption-1 text-semantic-700 hover:bg-neutral-50 transition-colors'
							onClick={e => {
								e.stopPropagation()
								onDelete?.()
								setShowMenu(false)
							}}
						>
							{data.type === 'file' ? '파일 삭제' : '링크 삭제'}
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default FileItem
