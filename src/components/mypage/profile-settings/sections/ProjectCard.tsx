import { useState, useRef, useCallback } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'

interface IProjectCard {
	img?: string
	title: string
	description: string
	date: string
	onSave?: (data: { title: string; description: string; date: string }) => void
	onCancel?: () => void
	isEditable?: boolean
}

const ProjectCard = ({ img, title, description, date, onSave, onCancel, isEditable = false }: IProjectCard) => {
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

	return (
		<div className='flex gap-4'>
			{/* 카드 컨테이너*/}
			<div ref={containerRef} className='w-full rounded-12 border border-neutral-200 overflow-hidden shadow-drop-neutral-1'>
				{/* 썸네일 */}
				<div className='flex justify-center p-0.5'>
					{img ? (
						<img src={img} alt={`${title}의 썸네일 이미지`} />
					) : (
						<div className='w-full h-55.25 bg-neutral-200 rounded-12' />
					)}
				</div>

				{/* 프로젝트 정보 */}
				<div
					className='flex flex-col gap-1.5 px-5 pt-3.5 pb-4 cursor-pointer'
					onClick={() => !isEditing && setIsEditing(true)}
				>
					{isEditing ? (
						<>
							<input
								type='text'
								className='title-3 font-semibold text-neutral-900 bg-transparent focus:outline-none placeholder:text-neutral-300'
								placeholder='프로젝트 이름'
								value={localTitle}
								onChange={e => setLocalTitle(e.target.value)}
							/>
							<textarea
								className='body-2 text-neutral-600 bg-transparent focus:outline-none placeholder:text-neutral-300 resize-none'
								placeholder='프로젝트 설명 (2줄까지 보여짐)'
								value={localDescription}
								onChange={e => setLocalDescription(e.target.value)}
								rows={2}
							/>
							<input
								type='text'
								className='body-2 text-neutral-400 bg-transparent focus:outline-none placeholder:text-neutral-300'
								placeholder='0000.00~0000.00'
								value={localDate}
								onChange={e => setLocalDate(e.target.value)}
							/>
						</>
					) : (
						<>
							<h3 className={`title-3 font-semibold ${localTitle ? 'text-neutral-900' : 'text-neutral-300'}`}>
								{localTitle || '프로젝트 이름'}
							</h3>
							<p className={`body-2 line-clamp-2 ${localDescription ? 'text-neutral-600' : 'text-neutral-300'}`}>
								{localDescription || '프로젝트 설명 (2줄까지 보여짐)'}
							</p>
							<span className={`body-2 ${localDate ? 'text-neutral-400' : 'text-neutral-300'}`}>
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
