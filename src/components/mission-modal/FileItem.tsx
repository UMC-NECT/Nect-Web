import { cn } from '@/utils/cn'
import type { FileItem as FileItemData } from '@/stores/mission-modal/missionModalStore'

// App icons
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

interface FileItemProps {
    data: FileItemData
    onClick?: () => void
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

const FileItem = ({ data, onClick, className }: FileItemProps) => {
	const { type, name, url, fileName } = data

	// 아이콘 렌더링 함수
	const renderIcon = () => {
		if (type === 'file' && fileName) {
			const Icon = getFileIcon(fileName)
			return <Icon />
		}
		if (type === 'link' && url) {
			const Icon = getLinkIcon(url)
			return <Icon />
		}
		return <EtcIcon />
	}

	// 상세 정보 텍스트
	const detailText = type === 'file' ? `파일명: ${fileName || '알 수 없음'}` : `링크: ${url || '알 수 없음'}`

	return (
		<div
			className={cn(
				'flex gap-2.5 items-center py-1.5 w-full cursor-pointer hover:bg-neutral-100 rounded-md px-1 transition-colors',
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
				<p className='caption-1 font-semibold text-neutral-800 truncate'>{name}</p>
				<p className='text-[9px] leading-[1.4] text-neutral-400 truncate'>{detailText}</p>
			</div>
		</div>
	)
}

export default FileItem
