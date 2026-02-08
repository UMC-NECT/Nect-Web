import { useNavigate } from 'react-router'
import ChevronRightIcon from '@/assets/icons/common/chevron-right.svg?react'
import PdfIcon from '@/assets/icons/app/pdf.svg?react'
import FigmaIcon from '@/assets/icons/app/figma.svg?react'
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

interface ContentListItem {
	title: string
	date: string
	tag?: string // 게시판용: [필독], [공지] 등
	fileType?: 'PDF' | 'Figma' // 공유 문서함용 (deprecated, fileExt 사용 권장)
	fileExt?: string // 공유 문서함용: 파일 확장자 (예: "PDF", "PNG", "DOCX" 등)
}

/**
 * 파일 확장자에 따른 아이콘 반환
 */
const getFileIcon = (fileExt?: string) => {
	if (!fileExt) return null
	
	const upperExt = fileExt.toUpperCase()
	
	switch (upperExt) {
		case 'FIGMA':
			return <FigmaIcon className="w-5 h-5" />
		case 'PDF':
			return <PdfIcon className="w-5 h-5" />
		case 'DOC':
		case 'DOCX':
			return <WordIcon className="w-5 h-5" />
		case 'XLS':
		case 'XLSX':
		case 'CSV':
			return <ExcelIcon className="w-5 h-5" />
		case 'PPT':
		case 'PPTX':
			return <PPTIcon className="w-5 h-5" />
		case 'ZIP':
		case 'RAR':
		case '7Z':
			return <ZipIcon className="w-5 h-5" />
		case 'JPEG':
			return <JPEGIcon className="w-5 h-5" />
		case 'JPG':
			return <JPGIcon className="w-5 h-5" />
		case 'PNG':
			return <PNGIcon className="w-5 h-5" />
		case 'MP4':
			return <MP4Icon className="w-5 h-5" />
		case 'MOV':
			return <MOVIcon className="w-5 h-5" />
		default:
			return <EtcIcon className="w-5 h-5" />
	}
}

interface ContentListCardProps {
	type: '게시판' | '공유 문서함'
	items: ContentListItem[]
	className?: string
}

const ContentListCard = ({ type, items, className = '' }: ContentListCardProps) => {
	const navigate = useNavigate()

	const handleHeaderClick = () => {
		if (type === '게시판') {
			navigate('/board')
		} else if (type === '공유 문서함') {
			navigate('/shared-documents')
		}
	}

	return (
		<div className={`w-[392px] h-[216px] p-5 bg-neutral-000 rounded-xl outline-1 -outline-offset-1 outline-neutral-100 inline-flex flex-col justify-start items-start gap-2.5 ${className}`}>
            <div className={`self-stretch ${type === '게시판' ? 'h-44' : ''} flex flex-col justify-start items-start gap-4`}>
				{/* 헤더 */}
				<div 
					className="self-stretch inline-flex justify-start items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
					onClick={handleHeaderClick}
				>
					<div className="justify-start text-neutral-900 title-2 font-bold">{type}</div>
					<div className="w-4 h-4 flex justify-center items-center gap-2.5">
						<ChevronRightIcon className="w-4 h-4 text-neutral-700" /> 
					</div>
				</div>

				{/* 아이템 리스트 */}
				<div className="self-stretch flex flex-col justify-start items-start gap-3">
					{items.map((item, index) => (
						<div key={index} className="self-stretch inline-flex justify-between items-center">
							{type === '게시판' ? (
								<div className="w-[270px] justify-start flex items-center gap-1">
									{item.tag && (
										<span className="text-primary-600-normal body-1 font-semibold whitespace-nowrap shrink-0">
											{item.tag}
										</span>
									)}
									<span className="text-neutral-900 body-1 font-medium truncate">
										{' '}
										{item.title}
									</span>
								</div>
							) : (
								<div className="flex justify-start items-center gap-1.5">
									<div className="w-5 h-5 shrink-0 flex items-center justify-center">
										{item.fileExt ? getFileIcon(item.fileExt) : item.fileType === 'PDF' ? <PdfIcon className="w-5 h-5" /> : item.fileType === 'Figma' ? <FigmaIcon className="w-5 h-5" /> : <EtcIcon className="w-5 h-5" />}
									</div>
									<div className="w-64 justify-center text-neutral-900 body-1 font-medium line-clamp-1">
										{item.title}
									</div>
								</div>
							)}
							{type === '게시판' && (
								<div className="w-20 text-right justify-center text-neutral-400 body-2 font-medium">
									{item.date}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default ContentListCard
