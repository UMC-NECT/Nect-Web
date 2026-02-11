import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTeamStore, getRoleDisplayName } from '@/stores/teamStore'
import { useMissionModalStore, type RoleTask } from '@/stores/mission-modal/missionModalStore'
import RoleTagChip from './RoleTagChip'
import TaskItem from './TaskItem'

interface RoleTaskItemWrapperProps {
	task: RoleTask
	readOnly?: boolean
	onToggle: () => void
	onContentChange: (content: string) => void
	isDragging?: boolean
	dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

const RoleTaskItemWrapper = ({ task, readOnly = false, onToggle, onContentChange, isDragging, dragHandleProps }: RoleTaskItemWrapperProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [editContent, setEditContent] = useState(task.content)

	return (
		<TaskItem
			content={isEditing ? editContent : task.content}
			isComplete={task.isComplete}
			isEditing={readOnly ? false : isEditing}
			autoFocus={isEditing}
			isDragging={isDragging}
			dragHandleProps={readOnly ? undefined : dragHandleProps}
			onClick={readOnly ? undefined : onToggle}
			onContentClick={
				readOnly
					? undefined
					: () => {
							setEditContent(task.content)
							setIsEditing(true)
						}
			}
			onChange={readOnly ? undefined : setEditContent}
			onSubmit={
				readOnly
					? undefined
					: content => {
							if (content.trim()) {
								onContentChange(content.trim())
							}
							setIsEditing(false)
						}
			}
		/>
	)
}

const SortableRoleTaskItem = ({
	task,
	readOnly,
	onToggle,
	onContentChange,
}: {
	task: RoleTask
	readOnly: boolean
	onToggle: () => void
	onContentChange: (content: string) => void
}) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, disabled: readOnly })
	const style = { transform: CSS.Transform.toString(transform), transition }
	return (
		<div ref={setNodeRef} style={style}>
			<RoleTaskItemWrapper
				task={task}
				readOnly={readOnly}
				onToggle={onToggle}
				onContentChange={onContentChange}
				isDragging={isDragging}
				dragHandleProps={readOnly ? undefined : { ...attributes, ...listeners }}
			/>
		</div>
	)
}

interface RoleTaskSectionProps {
	roleId: number
	roleName: string
	tasks: RoleTask[]
	readOnly?: boolean
	onToggleTask: (taskId: number) => void
	onUpdateTask: (taskId: number, content: string) => void
	onAddTask: (roleId: number, content: string) => void
	onReorderTask?: (roleId: number, orderedTaskItemIds: number[]) => void
}

const RoleTaskSection = ({
	roleId,
	roleName,
	tasks,
	readOnly = false,
	onToggleTask,
	onUpdateTask,
	onAddTask,
	onReorderTask,
}: RoleTaskSectionProps) => {
	const [isAddingTask, setIsAddingTask] = useState(false)
	const [newTaskContent, setNewTaskContent] = useState('')
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (over == null || active.id === over.id || !onReorderTask || tasks.length === 0) return
		const ids = tasks.map(t => t.id)
		const oldIndex = ids.indexOf(active.id as number)
		const newIndex = ids.indexOf(over.id as number)
		if (oldIndex === -1 || newIndex === -1) return
		const reordered = ids.slice()
		reordered.splice(oldIndex, 1)
		reordered.splice(newIndex, 0, active.id as number)
		onReorderTask(roleId, reordered)
	}

	return (
		<div className='flex flex-col gap-2'>
			{/* 역할 태그 */}
			<RoleTagChip roleId={roleId} roleName={roleName} state='default' className='hover:cursor-default' />

			{/* 태스크 목록 - 정렬 가능 시 DndContext + SortableContext */}
			<div className='flex flex-col pl-1'>
				{onReorderTask && tasks.length > 0 ? (
					<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
						<SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
							{tasks.map(task => (
								<SortableRoleTaskItem
									key={task.id}
									task={task}
									readOnly={readOnly}
									onToggle={() => onToggleTask(task.id)}
									onContentChange={content => onUpdateTask(task.id, content)}
								/>
							))}
						</SortableContext>
					</DndContext>
				) : (
					tasks.map(task => (
						<RoleTaskItemWrapper
							key={task.id}
							task={task}
							readOnly={readOnly}
							onToggle={() => onToggleTask(task.id)}
							onContentChange={content => onUpdateTask(task.id, content)}
						/>
					))
				)}

				{/* 새 태스크 추가 - readOnly일 때 숨김 */}
				{!readOnly && isAddingTask ? (
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
				) : !readOnly ? (
					<div onClick={() => setIsAddingTask(true)} className='cursor-pointer'>
						<TaskItem
							content='할 업무를 입력하세요'
							isPlaceholder
						/>
					</div>
				) : null}
			</div>
		</div>
	)
}

export interface RoleTaskPanelProps {
	/** true면 업무 수정/추가/삭제 불가 (p 태그로만 표시) */
	readOnly?: boolean
	/** 편집 모드에서 API 연동 시 사용 (제공 시 스토어 대신 호출) */
	onAddTask?: (roleId: number, content: string) => void
	onToggleTask?: (taskId: number) => void
	onUpdateTask?: (taskId: number, content: string) => void
	/** 위크미션 TASK 업무 리스트 정렬 순서 변경 시 (roleId, orderedTaskItemIds) */
	onReorderTask?: (roleId: number, orderedTaskItemIds: number[]) => void
}

const RoleTaskPanel = ({ readOnly = false, onAddTask, onToggleTask, onUpdateTask, onReorderTask }: RoleTaskPanelProps = {}) => {
	const { roles } = useTeamStore()
	const { roleTasks, toggleRoleTask, updateRoleTask, addRoleTask } = useMissionModalStore()

	const handleAddTask = (roleId: number, content: string) => {
		if (onAddTask) {
			onAddTask(roleId, content)
		} else {
			addRoleTask({
				id: Date.now(),
				roleId,
				content,
				isComplete: false,
			})
		}
	}

	const handleToggleTask = (taskId: number) => {
		if (onToggleTask) {
			onToggleTask(taskId)
		} else {
			toggleRoleTask(taskId)
		}
	}

	const handleUpdateTask = (taskId: number, content: string) => {
		if (onUpdateTask) {
			onUpdateTask(taskId, content)
		} else {
			updateRoleTask(taskId, { content })
		}
	}

	// 역할별로 태스크 그룹화
	const tasksByRole = roles.map(role => ({
		role,
		tasks: roleTasks.filter(task => task.roleId === role.part_id),
	}))

	return (
		<div className='flex flex-col gap-4 w-full bg-neutral-50 border border-neutral-100 rounded-12 p-5 overflow-y-auto max-h-[370px]'>
			{tasksByRole.map(({ role, tasks }) => (
				<RoleTaskSection
					key={role.part_id}
					roleId={role.part_id}
					roleName={getRoleDisplayName(role)}
					tasks={tasks}
					readOnly={readOnly}
					onToggleTask={handleToggleTask}
					onUpdateTask={handleUpdateTask}
					onAddTask={handleAddTask}
					onReorderTask={onReorderTask}
				/>
			))}
		</div>
	)
}

export default RoleTaskPanel
