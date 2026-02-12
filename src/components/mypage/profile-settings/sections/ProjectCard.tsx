import { useState, useRef, useCallback } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import CloudIcon from '@/assets/icons/mypage/cloud.svg?react'

interface IProjectCard {
	img?: string
	title: string
	description: string
	date: string
	onSave?: (data: { title: string; description: string; date: string }) => void
	onCancel?: () => void
	onContextMenu?: (e: React.MouseEvent) => void // 우클릭 모달용
	isEditable?: boolean
}

const ProjectCard = ({ img, title, description, date, onSave, onCancel, onContextMenu, isEditable = false }: IProjectCard) => {
	// 로컬에서 작성하던 값 저장하기 위함 (저장 버튼을 눌러야지만 폼에 반영)
	const [localTitle, setLocalTitle] = useState(title)
	const [localDescription, setLocalDescription] = useState(description)
	const [localDate, setLocalDate] = useState(date)
	const [isEditing, setIsEditing] = useState(isEditable)
	const containerRef = useRef<HTMLDivElement>(null)

	// 편집 종료 시, 작성한 값을 폼에 저장
	const saveAndExitEditing = useCallback(() => {
		const hasContent = localTitle || localDescription || localDate
		if (hasContent) {
			onSave?.({ title: localTitle, description: localDescription, date: localDate })
		} else {
			onCancel?.()
		}
		setIsEditing(false)
	}, [onSave, onCancel, localTitle, localDescription, localDate])

	// 카드 외부 클릭 시, 편집 모드 종료
	useClickOutside(containerRef, saveAndExitEditing, isEditing)

	// 썸네일 이미지 업로드
	const handleThumbnail = () => {
		alert('썸네일 이미지 업로드')
	}

	return (
		<div className='w-96 h-85.5 flex gap-4'>
			{/* 카드 컨테이너*/}
			<div
				ref={containerRef}
				className='relative w-full rounded-12 border border-neutral-200 overflow-hidden shadow-drop-neutral-1'
				onContextMenu={onContextMenu}
			>
				{/* 썸네일 */}
				<div className='flex justify-center p-0.5'>
					{img ? (
						<img src={img} alt={`${title}의 썸네일 이미지`} />
					) : (
						<div className='w-full h-55.25 relative group cursor-pointer' onClick={handleThumbnail}>
							<div className='w-full h-55.25 rounded-12 bg-neutral-400' />
							<div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300 rounded-12'>
								<span className='body-1 text-white flex justify-center items-center gap-1.75'>
									<CloudIcon className='w-5.5 h-4' /> 클릭 후 사진 업로드
								</span>
							</div>
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
							<input
								type='text'
								className='w-full h-5 body-2 text-neutral-400 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-neutral-300 p-0 m-0'
								placeholder='0000.00~0000.00'
								value={localDate}
								onChange={e => setLocalDate(e.target.value)}
								onClick={e => e.stopPropagation()}
							/>
						</>
					) : (
						<>
							<h3 className={`h-6 title-3 font-semibold leading-6 ${localTitle ? 'text-neutral-900' : 'text-neutral-300'}`}>
								{localTitle || '프로젝트 이름'}
							</h3>
							<p className={`h-9 body-2 line-clamp-2 leading-[18px] ${localDescription ? 'text-neutral-600' : 'text-neutral-300'}`}>
								{localDescription || '프로젝트 설명 (2줄까지 보여짐)'}
							</p>
							<span className={`h-5 body-2 leading-5 ${localDate ? 'text-neutral-400' : 'text-neutral-300'}`}>
								{localDate || '0000.00~0000.00'}
							</span>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProjectCard
