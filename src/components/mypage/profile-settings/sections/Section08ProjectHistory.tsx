import { useState } from 'react'
import Button from '../../../common/Button'
import ProjectCard from './ProjectCard'

interface ProjectItem {
	id: number
	title: string
	description: string
	date: string
}

const Section08ProjectHistory = () => {
	const [projects, setProjects] = useState<ProjectItem[]>([
		{
			id: 1,
			title: '트리플 UX.UI 개선 및 리브랜딩',
			description:
				'사용 체류 시간을 늘리고 기업 비전에 맞ㄱ게 전략 및 BI 제안 / 여행의 전반에 활용 될 수 있는 UX Flow 개선 / GUI 제작',
			date: '2025.10~2025.12',
		},
	])
	const [nextId, setNextId] = useState(2)

	const addProject = () => {
		setProjects([...projects, { id: nextId, title: '', description: '', date: '' }])
		setNextId(nextId + 1)
	}

	const updateProject = (id: number, field: 'title' | 'description' | 'date', value: string) => {
		setProjects(projects.map(p => (p.id === id ? { ...p, [field]: value } : p)))
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
				{projects.map(project => (
					<ProjectCard
						key={project.id}
						title={project.title}
						description={project.description}
						date={project.date}
						isEditable={!project.title || !project.description || !project.date}
						onUpdate={(field, value) => updateProject(project.id, field, value)}
					/>
				))}
			</div>
		</section>
	)
}

export default Section08ProjectHistory
