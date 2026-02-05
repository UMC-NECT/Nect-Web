import { useState } from 'react'
import { useTeamStore } from '@/stores/teamStore'
import { useMissionModalStore, type RoleTask } from '@/stores/mission-modal/missionModalStore'
import RoleTagChip from './RoleTagChip'
import TaskItem from './TaskItem'

interface RoleTaskItemWrapperProps {
	task: RoleTask
	onToggle: () => void
	onContentChange: (content: string) => void
}

const RoleTaskItemWrapper = ({ task, onToggle, onContentChange }: RoleTaskItemWrapperProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [editContent, setEditContent] = useState(task.content)

	return (
		<TaskItem
			content={isEditing ? editContent : task.content}
			isComplete={task.isComplete}
			isEditing={isEditing}
			autoFocus={isEditing}
			onClick={onToggle}
			onContentClick={() => {
				setEditContent(task.content)
				setIsEditing(true)
			}}
			onChange={setEditContent}
			onSubmit={content => {
				if (content.trim()) {
					onContentChange(content.trim())
				}
				setIsEditing(false)
			}}
		/>
	)
}

interface RoleTaskSectionProps {
	roleId: number
	roleName: string
	tasks: RoleTask[]
	onToggleTask: (taskId: number) => void
	onUpdateTask: (taskId: number, content: string) => void
	onAddTask: (roleId: number, content: string) => void
}

const RoleTaskSection = ({ roleId, roleName, tasks, onToggleTask, onUpdateTask, onAddTask }: RoleTaskSectionProps) => {
	const [isAddingTask, setIsAddingTask] = useState(false)
	const [newTaskContent, setNewTaskContent] = useState('')

	return (
		<div className='flex flex-col gap-2'>
			{/* 역할 태그 */}
			<RoleTagChip roleId={roleId} roleName={roleName} state='default' className='hover:cursor-default' />

			{/* 태스크 목록 */}
			<div className='flex flex-col pl-1'>
				{tasks.map(task => (
					<RoleTaskItemWrapper
						key={task.id}
						task={task}
						onToggle={() => onToggleTask(task.id)}
						onContentChange={content => onUpdateTask(task.id, content)}
					/>
				))}

				{/* 새 태스크 추가 */}
				{isAddingTask ? (
					<TaskItem
						content={newTaskContent}
						isEditing
						autoFocus
						onChange={setNewTaskContent}
						onSubmit={content => {
							if (content.trim()) {
								onAddTask(roleId, content.trim())
								setNewTaskContent('')
							}
							setIsAddingTask(false)
						}}
					/>
				) : (
					<div onClick={() => setIsAddingTask(true)} className='cursor-pointer'>
						<TaskItem
							content='할 업무를 입력하세요'
							isPlaceholder
						/>
					</div>
				)}
			</div>
		</div>
	)
}

const RoleTaskPanel = () => {
	const { roles } = useTeamStore()
	const { roleTasks, toggleRoleTask, updateRoleTask, addRoleTask } = useMissionModalStore()

	const handleAddTask = (roleId: number, content: string) => {
		addRoleTask({
			id: Date.now(),
			roleId,
			content,
			isComplete: false,
		})
	}

	// 역할별로 태스크 그룹화
	const tasksByRole = roles.map(role => ({
		role,
		tasks: roleTasks.filter(task => task.roleId === role.id),
	}))

	return (
		<div className='flex flex-col gap-4 w-full bg-neutral-50 border border-neutral-100 rounded-12 p-5 overflow-y-auto max-h-[370px]'>
			{tasksByRole.map(({ role, tasks }) => (
				<RoleTaskSection
					key={role.id}
					roleId={role.id}
					roleName={role.name}
					tasks={tasks}
					onToggleTask={toggleRoleTask}
					onUpdateTask={(taskId, content) => updateRoleTask(taskId, { content })}
					onAddTask={handleAddTask}
				/>
			))}
		</div>
	)
}

export default RoleTaskPanel
