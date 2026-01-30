import { useState, useRef } from 'react'
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
import FileContextMenu from './FileContextMenu'

interface FileMessageProps {
	senderName?: string
	role?: string
	profileImage?: string
	time: string
	readCount?: number
	isMine: boolean
	fileName: string
	fileSize: string
	fileType: 'PDF' | 'Figma' | 'Word' | 'Excel' | 'PPT' | 'Zip' | 'JPG' | 'PNG' | 'JPEG' | 'MOV' | 'MP4' | 'Etc'
	onRegisterToSharedDocs?: () => void
	onDelete?: () => void
}

const getFileIcon = (fileType: string) => {
	switch (fileType) {
		case 'Figma':
			return <FigmaIcon className="w-7 h-7" />
		case 'PDF':
			return <PDFIcon className="w-7 h-7" />
		case 'Word':
			return <WordIcon className="w-7 h-7" />
		case 'Excel':
			return <ExcelIcon className="w-7 h-7" />
		case 'PPT':
			return <PPTIcon className="w-7 h-7" />
		case 'Zip':
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

export const FileMessage = ({
	senderName,
	role,
	profileImage,
	time,
	readCount,
	isMine,
	fileName,
	fileSize,
	fileType,
	onRegisterToSharedDocs,
	onDelete,
}: FileMessageProps) => {
	const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
	const fileMessageRef = useRef<HTMLDivElement>(null)

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault()
		setContextMenu({
			x: e.clientX,
			y: e.clientY,
		})
	}

	return (
		<div
			ref={fileMessageRef}
			className={`relative flex gap-1.5 ${isMine ? 'items-end justify-end' : 'items-start justify-start'} pt-2.5`}
			onContextMenu={handleContextMenu}
		>
			{/* 내 메시지: 시간 표시만 */}
			{isMine && (
				<div className="flex flex-col h-[30px] items-end justify-end py-0.5">
					{readCount !== undefined && (
						<div className="h-3.5 text-primary-400-normal caption-2 font-medium">
							{readCount}
						</div>
					)}
					<div className="h-3.5 text-neutral-500 caption-3 font-regular">
						{time}
					</div>
				</div>
			)}

			{/* 프로필 이미지 (상대방 메시지일 때만) */}
			{!isMine && (
				<div className="relative w-[30px] h-[30px] shrink-0">
					{profileImage ? (
						<img
							src={profileImage}
							alt={senderName}
							className="w-[30px] h-[30px] rounded-full object-cover"
						/>
					) : (
						<div className="w-[30px] h-[30px] rounded-full bg-neutral-200" />
					)}
				</div>
			)}

			{/* 파일 메시지 컨텐츠 */}
			<div className={`flex flex-col gap-1 items-start ${isMine ? 'max-w-[248px]' : 'w-[305px]'}`}>
				{/* 상대방 메시지: 이름과 역할 */}
				{!isMine && senderName && (
					<div className="flex gap-[3px] items-center">
						<div className="text-neutral-900 caption-1 font-semibold leading-normal">
							{senderName}
						</div>
						{role && (
							<div className="text-neutral-500 caption-3 font-medium leading-normal">
								{role}
							</div>
						)}
					</div>
				)}

				{/* 파일 첨부 메시지 */}
				<div className="flex gap-1.5 items-end w-full">
					<div className={`rounded-md flex flex-col items-start pl-2 pr-2.5 py-2 bg-white`}>
						<div className="flex gap-2 items-start w-full">
							{/* 파일 아이콘 */}
							<div className="relative w-7 h-7 shrink-0">
								<div className="absolute inset-0 rounded-[6.222px] bg-neutral-50 shadow-inner-neutral-1" />
								<div className="absolute inset-0 flex items-center justify-center">
									{getFileIcon(fileType)}
								</div>
							</div>
							{/* 파일 정보 */}
							<div className="flex flex-col items-start justify-center max-w-[170px] min-w-0">
								<div className="text-neutral-900 caption-1 font-medium tracking-[-0.24px] leading-[1.2] truncate w-full">
									{fileName}
								</div>
								<div className="text-neutral-400 caption-3 font-regular leading-[1.4]">
									용량: {fileSize}
								</div>
							</div>
						</div>
					</div>

					{/* 상대방 메시지: 시간 및 읽음 수 */}
					{!isMine && (
						<div className="flex flex-col h-[30px] items-start justify-end py-0.5">
							{readCount !== undefined && (
								<div className="h-3.5 text-primary-400-normal caption-2 font-medium">
									{readCount}
								</div>
							)}
							<div className="h-3.5 text-neutral-500 caption-3 font-regular">
								{time}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* 컨텍스트 메뉴 */}
			{contextMenu && (
				<FileContextMenu
					x={contextMenu.x}
					y={contextMenu.y}
					onClose={() => setContextMenu(null)}
					onRegisterToSharedDocs={onRegisterToSharedDocs}
					onDelete={onDelete}
				/>
			)}
		</div>
	)
}
