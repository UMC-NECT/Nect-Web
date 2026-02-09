import { useState, useRef, useEffect } from 'react'
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
import LinkIcon from '@/assets/icons/team-board/link.svg?react'
import MoreIcon from '@/components/mission-modal/MoreIcon.svg?react'

interface SharedDocumentItemProps {
	data: FileItemData
	isSelected?: boolean
	onClick?: () => void
	onDownload?: () => void
	onRename?: () => void
	onDelete?: () => void
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

	return LinkIcon
}

const SharedDocumentItem = ({
	data,
	isSelected = false,
	onClick,
	onDownload,
	onRename,
	onDelete,
}: SharedDocumentItemProps) => {
	const [showMenu, setShowMenu] = useState(false)
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

	// 아이콘 렌더링
	const renderIcon = () => {
		if (data.type === 'file' && data.fileName) {
			const Icon = getFileIcon(data.fileName)
			return <Icon className="w-7 h-7" />
		}
		if (data.type === 'link' && data.url) {
			const Icon = getLinkIcon(data.url)
			// Figma인 경우 배경색이 다름
			if (data.url.toLowerCase().includes('figma.com') || data.url.toLowerCase().includes('figma')) {
				return (
					<div className="relative w-7 h-7">
						<div className="absolute bg-[#141515] inset-0 rounded-[6.222px]" />
						<div className="absolute inset-0 flex items-center justify-center">
							<Icon className="w-7 h-7" />
						</div>
					</div>
				)
			}
			return <Icon className="w-7 h-7" />
		}
		return <LinkIcon className="w-7 h-7" />
	}

	// 상세 정보 텍스트
	const detailText = data.type === 'file' ? `파일명: ${data.fileName || '알 수 없음'}` : `${data.url || '알 수 없음'}`

	return (
		<div className="relative">
			<div
				className={`bg-bg-gray border rounded-md flex gap-2.5 h-[46px] items-center pl-2 pr-2.5 py-1.5 w-[284px] cursor-pointer transition-colors hover:border-status-info-cool-gray-light ${
					isSelected ? 'border-status-info-cool-gray-light' : 'border-neutral-100'
				}`}
				onClick={onClick}
			>
				{/* 아이콘 */}
				<div className="relative shrink-0 w-7 h-7">
					{data.type === 'file' && data.fileName ? (
						<>
							<div className="absolute bg-neutral-50 inset-0 rounded-[6.222px] shadow-inner-neutral-1" />
							<div className="absolute inset-0 flex items-center justify-center">{renderIcon()}</div>
						</>
					) : data.type === 'link' && data.url?.toLowerCase().includes('figma') ? (
						renderIcon()
					) : (
						<>
							<div className="absolute bg-neutral-50 inset-0 rounded-[6.222px] shadow-inner-neutral-1" />
							<div className="absolute inset-0 flex items-center justify-center">{renderIcon()}</div>
						</>
					)}
				</div>

				{/* 텍스트 정보 */}
				<div className="flex flex-1 flex-col items-start leading-0 min-w-0">
					<div className="caption-1 font-semibold text-neutral-900 w-full whitespace-nowrap">
						<span className="leading-[1.4] overflow-hidden truncate block">{data.name}</span>
					</div>
					<div className="text-[9px] leading-[1.4] font-regular text-neutral-400 w-full whitespace-nowrap">
						<span className="overflow-hidden truncate block">{detailText}</span>
					</div>
				</div>

				{/* 더보기 메뉴 */}
				<div className="relative shrink-0 w-4 h-4" ref={menuRef}>
					<button
						className="flex items-center justify-center w-full h-full hover:opacity-70 transition-opacity hover:bg-neutral-100 hover:rounded-[4px] hover:shadow-inner-neutral-2"
						onClick={(e) => {
							e.stopPropagation()
							setShowMenu(!showMenu)
						}}
					>
						<MoreIcon className="w-4 h-4" />
					</button>

					{/* 드롭다운 메뉴 */}
					{showMenu && (
						<div className="absolute right-[-10px] top-full mt-1 bg-white rounded-[10px] shadow-drop-neutral-1 py-0.5 z-50 w-[138px]">
							{data.type === 'file' && onDownload && (
								<button
									className="w-full pl-5 pr-3 py-2 text-left caption-1 text-neutral-700 hover:bg-neutral-50 transition-colors"
									onClick={(e) => {
										e.stopPropagation()
										onDownload()
										setShowMenu(false)
									}}
								>
									다운로드
								</button>
							)}
							{onRename && (
								<button
									className="w-full pl-5 pr-3 py-2 text-left caption-1 text-neutral-700 hover:bg-neutral-50 transition-colors"
									onClick={(e) => {
										e.stopPropagation()
										onRename()
										setShowMenu(false)
									}}
								>
									이름 바꾸기
								</button>
							)}
							{onDelete && (
								<button
									className="w-full pl-5 pr-3 py-2 text-left caption-1 text-danger-700 hover:bg-neutral-50 transition-colors"
									onClick={(e) => {
										e.stopPropagation()
										onDelete()
										setShowMenu(false)
									}}
								>
									삭제
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default SharedDocumentItem
