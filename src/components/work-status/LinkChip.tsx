import FigmaIcon from '@/assets/icons/app/figma.svg?react'
import PDFIcon from '@/assets/icons/app/pdf.svg?react'
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

interface LinkChipProps {
	app: string
}

const LinkChip = ({ app }: LinkChipProps) => {
	// app 이름에 따라 아이콘 선택 (대소문자 무시)
	const getAppIcon = (appName: string) => {
		const normalizedApp = appName.toLowerCase().trim()

		// Figma 아이콘
		if (normalizedApp.includes('figma')) {
			return <FigmaIcon className='block max-w-none size-full' />
		}
		// PDF 아이콘
		if (normalizedApp.includes('pdf')) {
			return <PDFIcon className='block max-w-none size-full' />
		}
		// Word 아이콘
		if (normalizedApp.includes('word') || normalizedApp.includes('doc')) {
			return <WordIcon className='block max-w-none size-full' />
		}
		// Excel 아이콘
		if (normalizedApp.includes('excel') || normalizedApp.includes('xls')) {
			return <ExcelIcon className='block max-w-none size-full' />
		}
		// PPT 아이콘
		if (normalizedApp.includes('ppt') || normalizedApp.includes('powerpoint')) {
			return <PPTIcon className='block max-w-none size-full' />
		}
		// Zip 아이콘
		if (normalizedApp.includes('zip') || normalizedApp.includes('rar') || normalizedApp.includes('7z')) {
			return <ZipIcon className='block max-w-none size-full' />
		}
		// JPEG 아이콘
		if (normalizedApp.includes('jpeg')) {
			return <JPEGIcon className='block max-w-none size-full' />
		}
		// JPG 아이콘
		if (normalizedApp.includes('jpg')) {
			return <JPGIcon className='block max-w-none size-full' />
		}
		// PNG 아이콘
		if (normalizedApp.includes('png')) {
			return <PNGIcon className='block max-w-none size-full' />
		}
		// MP4 아이콘
		if (normalizedApp.includes('mp4')) {
			return <MP4Icon className='block max-w-none size-full' />
		}
		// MOV 아이콘
		if (normalizedApp.includes('mov')) {
			return <MOVIcon className='block max-w-none size-full' />
		}
		// 기타 아이콘 (기본값)
		return <EtcIcon className='block max-w-none size-full' />
	}

	return (
		<div className='w-6 h-6'>
			{getAppIcon(app)}
		</div>
	)
}

export default LinkChip