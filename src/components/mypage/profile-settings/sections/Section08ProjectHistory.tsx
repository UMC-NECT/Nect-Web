import { useState, useRef } from 'react'
import { useFieldArray, type Control } from 'react-hook-form'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useProjectHistoryModal } from '@/stores/useProjectHistoryModal'
import Button from '../../../common/Button'
import ProjectCard from './ProjectCard'
import ProjectHistoryModal from '../ProjectHistoryModal'
import PlusIcon from '@/assets/icons/common/plus.svg?react'
import type { ProfileFormDataType } from '@/utils/schemas/profileSchema'

interface ISection08ProjectHistory {
	control: Control<ProfileFormDataType>
}

const Section08ProjectHistory = ({ control }: ISection08ProjectHistory) => {
	const {
		fields: projects,
		append: appendProject,
		update,
	} = useFieldArray({
		control,
		name: 'projectHistory',
	})

	// 새로운 프로젝트 히스토리를 추가 중인지 여부
	const [isAddingNew, setIsAddingNew] = useState(false)

	// 우클릭시 모달 관련
	const { isOpen, position, open, close } = useProjectHistoryModal()
	const sectionRef = useRef<HTMLElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)

	// 메뉴 외부 클릭 시 닫기
	useClickOutside(menuRef, close, isOpen)

	// (버튼 핸들러) 프로젝트 추가
	const addProject = () => {
		setIsAddingNew(true)
	}

	// 프로젝트 저장 (기존 폼 데이터를 저장할 때)
	const saveProject = (
		index: number,
		data: {
			title: string
			description: string
			date: string
			imageUrl?: string | null
			imageFileName?: string | null
		}
	) => {
		update(index, {
			...projects[index],
			title: data.title,
			description: data.description,
			date: data.date,
			imageUrl: data.imageUrl ?? null,
		})
	}

	// 새 프로젝트 저장 (폼에 없는 새로운 카드를 저장할 때)
	const saveNewProject = (data: {
		title: string
		description: string
		date: string
		imageUrl?: string | null
	}) => {
		const hasContent = data.title || data.description || data.date || data.imageUrl
		if (hasContent) {
			appendProject({
				title: data.title,
				description: data.description,
				date: data.date,
				imageUrl: data.imageUrl ?? null,
			})
		}
		setIsAddingNew(false)
	}

	// 새 프로젝트 취소
	const cancelNewProject = () => {
		setIsAddingNew(false)
	}

	// 카드 우클릭 핸들러
	const handleContextMenu = (e: React.MouseEvent, index: number) => {
		e.preventDefault()
		const rect = sectionRef.current?.getBoundingClientRect()
		if (rect) {
			open({ x: e.clientX - rect.left, y: e.clientY - rect.top }, index)
		}
	}

	return (
		<section ref={sectionRef} className='relative ml-5'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='title-2 font-bold text-neutral-900'>프로젝트 히스토리</h2>

				<Button
					color='text'
					size='sm'
					onClick={addProject}
					disabled={isAddingNew}
					className='group flex gap-1 justify-center items-center'
				>
					<PlusIcon className='w-4 h-4 text-neutral-400 group-hover:text-neutral-500' />
					프로젝트 추가
				</Button>
			</div>

			{/* 프로젝트 카드 */}
			<div className='grid grid-cols-2 gap-4'>
				{projects.map((project, index) => (
					<ProjectCard
						key={project.id}
						img={project.imageUrl ?? undefined}
						title={project.title}
						description={project.description}
						date={project.date}
						isEditable={!project.title && !project.description && !project.date}
						onSave={data => saveProject(index, data)}
						onContextMenu={e => handleContextMenu(e, index)}
					/>
				))}

				{/* (작성 전의 임시로 뜨는) 새 카드 */}
				{isAddingNew && (
					<ProjectCard
						key='new-project'
						title=''
						description=''
						date=''
						isEditable={true}
						onSave={saveNewProject}
						onCancel={cancelNewProject}
					/>
				)}
			</div>

			{/* 우클릭 모달 */}
			{isOpen && position && (
				<div ref={menuRef} className='absolute z-10' style={{ left: position.x, top: position.y }}>
					<ProjectHistoryModal />
				</div>
			)}
		</section>
	)
}

export default Section08ProjectHistory
