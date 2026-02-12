import { useState, useRef, useCallback } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import CloudIcon from '@/assets/icons/mypage/cloud.svg?react'
import { postFileUpload } from '@/api/file'

interface IProjectCard {
	img?: string
	imageFileName?: string | null
	title: string
	description: string
	date: string
	onSave?: (data: {
		title: string
		description: string
		date: string
		imageUrl?: string | null
		imageFileName?: string | null
	}) => void
	onCancel?: () => void
	onContextMenu?: (e: React.MouseEvent) => void
	isEditable?: boolean
}

/** 숫자만 남기고 yyyy.m 형식으로 포맷 (연 4자리, 월 1~12) */
const formatYyyyMm = (raw: string): string => {
	const digits = raw.replace(/\D/g, '').slice(0, 6)
	if (digits.length <= 4) return digits
	const year = digits.slice(0, 4)
	const monthNum = parseInt(digits.slice(4), 10) || 0
	const month = monthNum < 1 ? '1' : monthNum > 12 ? '12' : String(monthNum)
	return `${year}.${month}`
}

const ProjectCard = ({
	img,
	imageFileName: initialImageFileName,
	title,
	description,
	date,
	onSave,
	onCancel,
	onContextMenu,
	isEditable = false,
}: IProjectCard) => {
	const parseDate = (d: string) => {
		const [s, e] = (d ?? '').split('~').map(part => part?.trim() ?? '')
		return { start: s, end: e }
	}
	const { start: initialStart, end: initialEnd } = parseDate(date)

	const [localTitle, setLocalTitle] = useState(title)
	const [localDescription, setLocalDescription] = useState(description)
	const [localStartDate, setLocalStartDate] = useState(initialStart)
	const [localEndDate, setLocalEndDate] = useState(initialEnd)
	const [localImageUrl, setLocalImageUrl] = useState<string | null>(img ?? null)
	const [localImageFileName, setLocalImageFileName] = useState<string | null>(initialImageFileName ?? null)
	const [isEditing, setIsEditing] = useState(isEditable)
	const [isUploading, setIsUploading] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	// 편집 종료 시, 작성한 값을 폼에 저장
	const combinedDate = [localStartDate, localEndDate].filter(Boolean).join('~')

	const saveAndExitEditing = useCallback(() => {
		const hasContent = localTitle || localDescription || combinedDate || localImageUrl || localImageFileName
		if (hasContent) {
			onSave?.({
				title: localTitle,
				description: localDescription,
				date: combinedDate,
				imageUrl: localImageUrl,
				imageFileName: localImageFileName,
			})
		} else {
			onCancel?.()
		}
		setIsEditing(false)
	}, [onSave, onCancel, localTitle, localDescription, combinedDate, localImageUrl, localImageFileName])

	// 카드 외부 클릭 시, 편집 모드 종료
	useClickOutside(containerRef, saveAndExitEditing, isEditing)

	// 썸네일 이미지 업로드: file API 호출 후 fileUrl 반영
	const handleThumbnail = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (!file || !file.type.startsWith('image/')) return
			setIsUploading(true)
			try {
				const res = await postFileUpload(file)
				if (res?.body) {
					const fileUrl = res.body.fileUrl
					const fileName = res.body.fileName
					setLocalImageUrl(fileUrl)
					setLocalImageFileName(fileName ?? null)
					// 업로드 직후 폼에 반영 (카드 밖 클릭 없이 저장해도 projectImage 전달되도록)
					onSave?.({
						title: localTitle,
						description: localDescription,
						date: [localStartDate, localEndDate].filter(Boolean).join('~'),
						imageUrl: fileUrl,
						imageFileName: fileName ?? null,
					})
				}
			} finally {
				setIsUploading(false)
				e.target.value = ''
			}
		},
		[localTitle, localDescription, localStartDate, localEndDate, onSave]
	)

	const displayImageUrl = localImageUrl ?? img

	return (
		<div className='w-96 h-85.5 flex gap-4'>
			<input
				ref={fileInputRef}
				type='file'
				accept='image/*'
				className='hidden'
				onChange={handleFileChange}
			/>
			<div
				ref={containerRef}
				className='relative w-full rounded-12 border border-neutral-200 overflow-hidden shadow-drop-neutral-1'
				onContextMenu={onContextMenu}
			>
				<div className='flex justify-center p-0.5'>
					{displayImageUrl ? (
						<div className='w-full h-55.25 relative group'>
							<img src={displayImageUrl} alt={`${localTitle || title}의 썸네일`} className='w-full h-55.25 object-cover rounded-12' />
							{!isUploading && (
								<div
									className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300 rounded-12 bg-neutral-900/40 cursor-pointer'
									onClick={handleThumbnail}
								>
									<span className='body-1 text-white flex justify-center items-center gap-1.75'>
										<CloudIcon className='w-5.5 h-4' /> 사진 변경
									</span>
								</div>
							)}
							{isUploading && (
								<div className='absolute inset-0 flex items-center justify-center rounded-12 bg-neutral-900/50'>
									<span className='body-1 text-white'>업로드 중...</span>
								</div>
							)}
						</div>
					) : (
						<div className='w-full h-55.25 relative group cursor-pointer' onClick={handleThumbnail}>
							<div className='w-full h-55.25 rounded-12 bg-neutral-400' />
							{isUploading ? (
								<div className='absolute inset-0 flex items-center justify-center rounded-12 bg-neutral-900/50'>
									<span className='body-1 text-white'>업로드 중...</span>
								</div>
							) : (
								<div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300 rounded-12'>
									<span className='body-1 text-white flex justify-center items-center gap-1.75'>
										<CloudIcon className='w-5.5 h-4' /> 클릭 후 사진 업로드
									</span>
								</div>
							)}
						</div>
					)}
				</div>

				{/* 프로젝트 정보 - input 기준 고정 높이 (24+6+36+6+20+14+16=122) */}
				<div
					className='flex flex-col gap-1.5 px-5 pt-3.5 pb-4 cursor-pointer h-[122px]'
					onClick={() => !isEditing && setIsEditing(true)}
				>
					{isEditing ? (
						<>
							<input
								type='text'
								className='w-full h-6 title-3 font-semibold text-neutral-900 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-neutral-300 p-0 m-0'
								placeholder='프로젝트 이름'
								value={localTitle}
								onChange={e => setLocalTitle(e.target.value)}
								onClick={e => e.stopPropagation()}
							/>
							<textarea
								className='w-full h-9 body-2 text-neutral-600 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-neutral-300 resize-none overflow-hidden p-0 m-0'
								placeholder='프로젝트 설명 (2줄까지 보여짐)'
								value={localDescription}
								onChange={e => setLocalDescription(e.target.value)}
								rows={2}
								onClick={e => e.stopPropagation()}
							/>
							<div className='flex items-center gap-1 h-5' onClick={e => e.stopPropagation()}>
								<input
									type='text'
									inputMode='numeric'
									className='w-[55px] h-5 body-2 text-neutral-400 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-neutral-300 p-0 m-0'
									placeholder='0000.00'
									value={localStartDate}
									onChange={e => setLocalStartDate(formatYyyyMm(e.target.value))}
								/>
								<span className='body-2 text-neutral-400'>~</span>
								<input
									type='text'
									inputMode='numeric'
									className='w-[72px] h-5 body-2 text-neutral-400 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-neutral-300 p-0 m-0'
									placeholder='0000.00'
									value={localEndDate}
									onChange={e => setLocalEndDate(formatYyyyMm(e.target.value))}
								/>
							</div>
						</>
					) : (
						<>
							<h3 className={`h-6 title-3 font-semibold leading-6 ${localTitle ? 'text-neutral-900' : 'text-neutral-300'}`}>
								{localTitle || '프로젝트 이름'}
							</h3>
							<p className={`h-9 body-2 line-clamp-2 leading-[18px] ${localDescription ? 'text-neutral-600' : 'text-neutral-300'}`}>
								{localDescription || '프로젝트 설명 (2줄까지 보여짐)'}
							</p>
							<span className={`h-5 body-2 leading-5 ${combinedDate ? 'text-neutral-400' : 'text-neutral-300'}`}>
								{combinedDate ? [localStartDate, localEndDate].join(' ~ ') : 'yyyy.m ~ yyyy.m'}
							</span>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProjectCard
