import { useFieldArray, type Control, type UseFormSetValue } from 'react-hook-form'
import Button from '../../../common/Button'
import ProjectCard from './ProjectCard'
import type { ProfileFormDataType } from '@/utils/schemas/profileSchema'

interface ISection08ProjectHistory {
	control: Control<ProfileFormDataType>
	setValue: UseFormSetValue<ProfileFormDataType>
}

const Section08ProjectHistory = ({ control, setValue }: ISection08ProjectHistory) => {
	const { fields: projects, append: appendProject } = useFieldArray({
		control,
		name: 'projectHistory',
	})

	const addProject = () => {
		appendProject({ id: Date.now(), title: '', description: '', date: '' })
	}

	const updateProject = (index: number, field: 'title' | 'description' | 'date', value: string) => {
		setValue(`projectHistory.${index}.${field}`, value)
	}

	return (
		<section className='ml-5'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='title-2 font-bold text-neutral-900'>프로젝트 히스토리</h2>

				<Button color='text' size='sm' onClick={addProject}>
					+ 프로젝트 추가
				</Button>
			</div>

			{/* 프로젝트 카드 */}
			<div className='grid grid-cols-2 gap-4'>
				{projects.map((project, index) => (
					<ProjectCard
						key={project.id}
						title={project.title}
						description={project.description}
						date={project.date}
						isEditable={!project.title || !project.description || !project.date}
						onUpdate={(field, value) => updateProject(index, field, value)}
					/>
				))}
			</div>
		</section>
	)
}

export default Section08ProjectHistory
