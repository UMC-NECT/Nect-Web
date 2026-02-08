import { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import 'overlayscrollbars/overlayscrollbars.css'
import { useMissionModalStore } from '@/stores/mission-modal/missionModalStore'
import { useProcessDetailQuery } from '@/hooks/process/useProcessApi'
import { useTeamStore, getRoleDisplayName } from '@/stores/teamStore'
import type { MissionStatus } from '@/types/missionStatus'
import MissionTagChip from './MissionTagChip'
import PartSelector from './PartSelector'
import TagChipList from './TagChipList'
import TaskItem from './TaskItem'
import SortableTaskItem from './SortableTaskItem'
import FeedbackItem from './FeedbackItem'
import FileItem from './FileItem'
import WorkContentInput from './WorkContentInput'
import RoleTaskPanel from './RoleTaskPanel'
import StatusChip from '@/components/common/StatusChip'
import StatusChipList from '@/components/common/StatusChipList'
import Tooltip from '@/components/common/Tooltip'
import PlusIcon from '@/assets/icons/week-mission/plus.svg?react'
import CheckboxIcon from '@/assets/icons/common/checkbox/checkbox-gray.svg?react'
import InfoIcon from '@/assets/icons/common/info.svg?react'

interface MissionModalProps {
	className?: string
	variant?: 'default' | 'leader' // 기본 모달 또는 리더형 모달
}

const formatDateForDisplay = (dateStr: string) => {
	if (!dateStr) return ''
	return dateStr.replace(/-/g, '.')
}

const MissionModal = ({ className, variant = 'default' }: MissionModalProps) => {
	const isLeader = variant === 'leader'
	const { roles } = useTeamStore()
	const {
		editingMissionId,
		projectId,
		missionNumber,
		title,
		selectedParts,
		selectedAssignees,
		startDate,
		deadline,
		missionStatus,
		isCreateMode,
		workContent,
		tasks,
		feedbacks,
		files,
		setMissionNumber,
		setTitle,
		setSelectedParts,
		setSelectedAssignees,
		addSelectedPart,
		removeSelectedPart,
		addSelectedAssignee,
		removeSelectedAssignee,
		setStartDate,
		setDeadline,
		setMissionStatus,
		setWorkContent,
		setTasks,
		setFeedbacks,
		setFiles,
		addTask,
		updateTask,
		removeTask,
		toggleTask,
		reorderTasks,
		addFeedback,
		updateFeedback,
		removeFeedback,
		toggleFeedback,
		addFile,
		removeFile,
	} = useMissionModalStore()

	const isEditMode = editingMissionId != null && projectId != null
	const { data: processDetail } = useProcessDetailQuery(projectId ?? '', String(editingMissionId ?? ''))

	const appliedDetailKeyRef = useRef<string | null>(null)
	useEffect(() => {
		if (!isEditMode || !processDetail?.body) return
		const key = `${projectId}-${editingMissionId}`
		if (appliedDetailKeyRef.current === key) return
		appliedDetailKeyRef.current = key
		const body = processDetail.body
		setTitle(body.process_title ?? '')
		setWorkContent(body.process_content ?? '')
		setStartDate(formatDateForDisplay(body.start_date ?? ''))
		setDeadline(formatDateForDisplay(body.dead_line ?? ''))
		const status = (body.process_status ?? 'planning') as MissionStatus
		setMissionStatus(status)

		const partNames = (body.role_fields ?? []) as string[]
		const matchedParts = partNames
			.map(name => roles.find(r => getRoleDisplayName(r) === name))
			.filter((r): r is NonNullable<typeof r> => r != null)
		setSelectedParts(matchedParts)

		const assignees = (body.assignees ?? []).map(a => ({
			id: a.user_id,
			name: a.nickname,
			roleId: 0,
			image: a.profile_image_url ?? '',
		}))
		setSelectedAssignees(assignees)

		const taskItems = (body.task_items ?? []).map(t => ({
			id: t.task_item_id,
			content: t.content,
			isComplete: t.is_done,
		}))
		setTasks(taskItems)

		const feedbackList = (body.feedbacks ?? []).map(f => ({
			id: f.feedback_id,
			partName: f.created_by?.role_fields?.[0] ?? '',
			authorName: f.created_by?.user_name ?? '',
			content: f.content,
			timestamp: f.created_at,
			state: (f.status === 'complete' ? 'complete' : 'default') as 'default' | 'complete' | 'disabled',
		}))
		setFeedbacks(feedbackList)

		const fileItems = [
			...(body.files ?? []).map(f => ({
				id: f.file_id,
				type: 'file' as const,
				name: f.file_name,
				url: f.file_url,
				fileName: f.file_name,
			})),
			...(body.links ?? []).map(l => ({
				id: l.link_id,
				type: 'link' as const,
				name: l.url,
				url: l.url,
			})),
		]
		setFiles(fileItems)
	}, [
		isEditMode,
		processDetail,
		projectId,
		editingMissionId,
		setTitle,
		setWorkContent,
		setStartDate,
		setDeadline,
		setMissionStatus,
		setSelectedParts,
		setSelectedAssignees,
		setTasks,
		setFeedbacks,
		setFiles,
		roles,
	])

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	)

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (over && active.id !== over.id) {
			reorderTasks(active.id as number, over.id as number)
		}
	}

	const [newTaskContent, setNewTaskContent] = useState('')
	const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
	const [editingTaskContent, setEditingTaskContent] = useState('')

	const [newFeedbackContent, setNewFeedbackContent] = useState('')
	const [editingFeedbackId, setEditingFeedbackId] = useState<number | null>(null)
	const [editingFeedbackContent, setEditingFeedbackContent] = useState('')

	const [isAddingFile, setIsAddingFile] = useState(false)

	const [openDropdown, setOpenDropdown] = useState<'mission' | 'parts' | 'assignees' | 'duration' | 'status' | null>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const missionDropdownRef = useRef<HTMLDivElement>(null)
	const feedbackContentRef = useRef<HTMLDivElement>(null)

	const completedTasks = tasks.filter(t => t.isComplete).length
	const totalTasks = tasks.length

	const toggleDropdown = (dropdown: 'mission' | 'parts' | 'assignees' | 'duration' | 'status') => {
		setOpenDropdown(prev => (prev === dropdown ? null : dropdown))
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node
			const isInsideDropdownRef = dropdownRef.current?.contains(target)
			const isInsideMissionDropdownRef = missionDropdownRef.current?.contains(target)

			if (!isInsideDropdownRef && !isInsideMissionDropdownRef) {
				setOpenDropdown(null)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// createMode일 때 피드백 영역 포커스 불가(입력 차단)
	useEffect(() => {
		const el = feedbackContentRef.current
		if (!el) return
		if (isCreateMode) {
			el.setAttribute('inert', '')
		} else {
			el.removeAttribute('inert')
		}
		return () => el.removeAttribute('inert')
	}, [isCreateMode])

	const formatTimestamp = () => {
		const now = new Date()
		const year = now.getFullYear().toString().slice(-2)
		const month = now.getMonth() + 1
		const day = now.getDate()
		const hours = now.getHours()
		const minutes = now.getMinutes().toString().padStart(2, '0')
		const period = hours >= 12 ? 'PM' : 'AM'
		const displayHours = hours % 12 || 12
		return `${year}/${month}/${day} ${period} ${displayHours}:${minutes}`
	}

	const handleTaskSubmit = () => {
		if (newTaskContent.trim()) {
			addTask({
				id: Date.now(),
				content: newTaskContent.trim(),
				isComplete: false,
			})
			setNewTaskContent('')
		}
	}

	const handleTaskEdit = (taskId: number, content: string) => {
		setEditingTaskId(taskId)
		setEditingTaskContent(content)
	}

	const handleTaskEditSubmit = () => {
		if (editingTaskId !== null && editingTaskContent.trim()) {
			updateTask(editingTaskId, { content: editingTaskContent.trim() })
		}
		setEditingTaskId(null)
		setEditingTaskContent('')
	}

	const handleFeedbackSubmit = () => {
		if (newFeedbackContent.trim()) {
			addFeedback({
				id: Date.now(),
				partName: '파트 소속',
				authorName: '작성자 이름',
				content: newFeedbackContent.trim(),
				timestamp: formatTimestamp(),
				state: 'default',
			})
			setNewFeedbackContent('')
		}
	}

	const handleFeedbackEdit = (feedbackId: number, content: string) => {
		setEditingFeedbackId(feedbackId)
		setEditingFeedbackContent(content)
	}

	const handleFeedbackEditSubmit = () => {
		if (editingFeedbackId !== null && editingFeedbackContent.trim()) {
			updateFeedback(editingFeedbackId, { content: editingFeedbackContent.trim() })
		}
		setEditingFeedbackId(null)
		setEditingFeedbackContent('')
	}

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center-safe bg-white rounded-12  overflow-x-auto px-1.5',
				className
			)}
		>
			<section className='flex items-center justify-between w-full px-[58px] mt-[34px] mb-[26px]'>
				<div ref={missionDropdownRef} className=' relative'>
					<div onClick={() => toggleDropdown('mission')} className='cursor-pointer'>
						<MissionTagChip missionNumber={missionNumber} />
					</div>
					{openDropdown === 'mission' && (
						<div className='absolute top-full left-0  z-10'>
							<TagChipList
								variant='mission'
								onMissionClick={mission => {
									setMissionNumber(mission.missionNumber)
									setOpenDropdown(null)
								}}
							/>
						</div>
					)}
				</div>

				<div className='flex gap-2.5'>
					<button className='button-1 font-semibold px-2.5 py-1.5 rounded-6 bg-neutral-50 border-[1.5px] border-neutral-100 text-neutral-900 min-w-[60px] hover:bg-neutral-200 hover:border-neutral-200 transition-all duration-300 ease-in-out'>삭제</button>
					<button className='button-1 font-semibold px-2.5 py-1.5 rounded-6 bg-primary-150-light text-primary-500-normal min-w-[60px] hover:bg-primary-200-light transition-all duration-300 ease-in-out'>저장</button>
				</div>
			</section>
			<OverlayScrollbarsComponent
				className='max-h-[600px] pb-[34px] px-[58px] mission-modal-scrollbar'
				options={{
					scrollbars: {
						autoHide: 'leave',
						autoHideDelay: 100,
					},
				}}
			>
				<div className={cn('flex flex-col max-h-full', 'w-[924px]')}>
					{/* Mission Tag - 고정 위치 */}

					{/* 스크롤 가능한 콘텐츠 영역 */}
					<div className='flex flex-col gap-9 flex-1 pr-2'>
						{/* Title */}
						<input
							type='text'
							className='text-[28px] font-bold text-neutral-900 leading-[1.3] placeholder:text-neutral-300 outline-none bg-transparent w-full'
							placeholder='새 미션 업무'
							value={title}
							onChange={e => setTitle(e.target.value)}
						/>

						{isLeader ? (
							/* 리더형 모달 레이아웃 */
							<div className='flex gap-8'>
								{/* Left: Form Fields + Files */}
								<div className='flex flex-col gap-6 w-[342px]'>
									<div className='flex flex-col gap-2.5 w-full' ref={dropdownRef}>
										{/* 담당자 */}
										<div className='flex gap-1.5 items-center relative'>
											<span className='body-2 font-medium text-neutral-500 w-[70px]'>담당자</span>
											<PartSelector
												variant='person'
												selectedPersons={selectedAssignees}
												onPersonRemove={removeSelectedAssignee}
												onClick={() => toggleDropdown('assignees')}
											/>
											{openDropdown === 'assignees' && (
												<div className='absolute top-full left-[76px] mt-1 z-10'>
													<TagChipList
														variant='person'
														title='담당자 선택'
														disabledPersonIds={selectedAssignees.map(a => a.id)}
														onPersonSelect={person => {
															addSelectedAssignee(person)
														}}
													/>
												</div>
											)}
										</div>

										{/* 진행 기간 */}
										<div className='flex gap-1.5 items-center relative'>
											<span className='body-2 font-medium text-neutral-500 w-[70px]'>진행 기간</span>
											<input
												type='text'
												value={startDate && deadline ? `${startDate} ~ ${deadline}` : startDate || ''}
												onChange={e => {
													const value = e.target.value.replace(/[^0-9]/g, '')
													let formatted = ''

													for (let i = 0; i < value.length && i < 16; i++) {
														if (i === 4 || i === 6 || i === 12 || i === 14) {
															formatted += '.'
														}
														if (i === 8) {
															formatted += ' ~ '
														}
														formatted += value[i]
													}

													const parts = formatted.split(' ~ ')
													setStartDate(parts[0] || '')
													setDeadline(parts[1] || '')
												}}
												placeholder='입력해주세요'
												className={cn(
													'flex min-h-[28px] py-0.5 rounded-6 w-[266px] items-center',
													'transition-colors',
													!(startDate || deadline) &&
														'bg-neutral-50 hover:bg-neutral-100 shadow-inner-neutral-2 px-2',
													(startDate || deadline) && 'hover:bg-neutral-100',
													'button-1 font-medium text-neutral-700 placeholder:text-neutral-300',
													'outline-none border-none'
												)}
											/>
										</div>

										{/* 작업 상태 */}
										<div className='flex gap-2.5 items-center relative'>
											<span className='body-2 font-medium text-neutral-500 w-[70px]'>작업 상태</span>
											<div onClick={() => toggleDropdown('status')}>
												<StatusChip state={missionStatus} hover={true} />
											</div>
											{openDropdown === 'status' && (
												<div className='absolute top-full left-[76px] mt-1 z-10'>
													<StatusChipList
														onStatusChange={status => {
															setMissionStatus(status)
															setOpenDropdown(null)
														}}
													/>
												</div>
											)}
										</div>
									</div>

									{/* 업로드 파일 & 링크 */}
									<div className='flex flex-col gap-3 h-full'>
										{/* Header */}
										<div className='flex items-center justify-between px-1'>
											<p className='text-[16px] font-semibold text-neutral-900 tracking-[-0.32px]'>
												업로드 파일 & 링크
											</p>
											<button
												className='flex gap-0.5 items-center px-1.5 pr-2.5 py-0.5 bg-neutral-50/20 border border-neutral-200 rounded-6 shadow-inner-neutral-2'
												onClick={() => setIsAddingFile(true)}
											>
												<PlusIcon className='w-4 h-4 stroke-neutral-400' />
												<span className='body-3 font-medium text-neutral-400 tracking-[-0.26px]'>
													추가
												</span>
											</button>
										</div>

										{/* Content */}
										<div className='bg-neutral-50 border py-2 border-neutral-100 rounded-6 min-h-[206px] overflow-y-auto h-full'>
											<div className='flex flex-col'>
												{files.map(file => (
													<FileItem
														key={file.id}
														data={file}
														onClick={() => {
															if (file.url) {
																const url =
																	file.url.startsWith('http://') ||
																	file.url.startsWith('https://')
																		? file.url
																		: `https://${file.url}`
																window.open(url, '_blank')
															}
														}}
														onDelete={() => removeFile(file.id)}
														onDownload={() => {
															if (file.url && file.fileName) {
																const link = document.createElement('a')
																link.href = file.url
																link.download = file.fileName
																document.body.appendChild(link)
																link.click()
																document.body.removeChild(link)
															}
														}}
													/>
												))}
												{isAddingFile && (
													<FileItem
														isEditing
														onSave={fileData => {
															addFile({
																id: Date.now(),
																...fileData,
															})
															setIsAddingFile(false)
														}}
														onCancel={() => setIsAddingFile(false)}
													/>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* Right: Role Task Panel */}
								<RoleTaskPanel />
							</div>
						) : (
							/* 기본 모달 레이아웃 */
							<div className='flex flex-col gap-6'>
								{/* Top Section: Form Fields + Work Content */}
								<div className='flex gap-4'>
									{/* Left: Form Fields */}
									<div className='flex flex-col gap-2.5 w-[342px]' ref={dropdownRef}>
										{/* 담당 파트 */}
										<div className='flex gap-1.5 items-center relative'>
											<span className='body-2 font-medium text-neutral-500 w-[70px]'>담당 파트</span>
											<PartSelector
												selectedRoles={selectedParts}
												onRoleRemove={removeSelectedPart}
												onClick={() => toggleDropdown('parts')}
											/>
											{openDropdown === 'parts' && (
												<div className='absolute top-full left-[76px] mt-1 z-10 w-[95px]'>
													<TagChipList
														variant='role'
														title='파트 선택'
														disabledRoleIds={selectedParts.map(p => p.part_id)}
														onRoleSelect={role => {
															addSelectedPart(role)
														}}
													/>
												</div>
											)}
										</div>

										{/* 담당자 */}
										<div className='flex gap-1.5 items-center relative'>
											<span className='body-2 font-medium text-neutral-500 w-[70px]'>담당자</span>
											<PartSelector
												variant='person'
												selectedPersons={selectedAssignees}
												onPersonRemove={removeSelectedAssignee}
												onClick={() => toggleDropdown('assignees')}
											/>
											{openDropdown === 'assignees' && (
												<div className='absolute top-full left-[76px] mt-1 z-10'>
													<TagChipList
														variant='person'
														title='담당자 선택'
														disabledPersonIds={selectedAssignees.map(a => a.id)}
														onPersonSelect={person => {
															addSelectedAssignee(person)
														}}
													/>
												</div>
											)}
										</div>

										{/* 진행 기간 */}
										<div className='flex gap-1.5 items-center relative'>
											<span className='body-2 font-medium text-neutral-500 w-[70px]'>진행 기간</span>
											<input
												type='text'
												value={startDate && deadline ? `${startDate} ~ ${deadline}` : startDate || ''}
												onChange={e => {
													const value = e.target.value.replace(/[^0-9]/g, '')
													let formatted = ''

													for (let i = 0; i < value.length && i < 16; i++) {
														if (i === 4 || i === 6 || i === 12 || i === 14) {
															formatted += '.'
														}
														if (i === 8) {
															formatted += ' ~ '
														}
														formatted += value[i]
													}

													// startDate와 deadline 분리
													const parts = formatted.split(' ~ ')
													setStartDate(parts[0] || '')
													setDeadline(parts[1] || '')
												}}
												placeholder='입력해주세요'
												className={cn(
													'flex min-h-[28px] py-0.5 rounded-6 w-[266px] items-center',
													'transition-colors',
													!(startDate || deadline) &&
														'bg-neutral-50 hover:bg-neutral-100 shadow-inner-neutral-2 px-2',
													(startDate || deadline) && 'hover:bg-neutral-100',
													'button-1 font-normal text-neutral-700 placeholder:text-neutral-300',
													'outline-none border-none'
												)}
											/>
										</div>

										{/* 작업 상태 */}
										<div className='flex gap-2.5 items-center relative'>
											<span className='body-2 font-medium text-neutral-500 w-[70px]'>작업 상태</span>
											<div onClick={() => toggleDropdown('status')}>
												<StatusChip state={missionStatus} hover={true} />
											</div>
											{openDropdown === 'status' && (
												<div className='absolute top-full left-[76px] mt-1 z-10'>
													<StatusChipList
														onStatusChange={status => {
															setMissionStatus(status)
															setOpenDropdown(null)
														}}
													/>
												</div>
											)}
										</div>
									</div>

									{/* Right: Work Content */}
									<WorkContentInput
										value={workContent}
										onChange={setWorkContent}
										className='w-[566px] h-[182px]'
									/>
								</div>

								{/* Bottom Section: 3 Columns */}
								<div className='flex gap-4 justify-center'>
									{/* 업무 리스트 */}
									<div className='flex flex-col gap-3.5 w-[342px]'>
										{/* Header */}
										<div className='flex items-center justify-between px-1 pr-3'>
											<p className='text-[16px] font-semibold text-neutral-900 tracking-[-0.32px]'>
												업무 리스트
											</p>
											<div className='flex gap-[3px] items-center'>
												<CheckboxIcon className='w-4 h-4' />
												<span className='body-2 font-medium text-neutral-400'>
													{completedTasks}/{totalTasks}
												</span>
											</div>
										</div>

										{/* Content */}
										<div className='bg-neutral-50 border border-neutral-100 rounded-6 min-h-[206px] px-3 py-2'>
											<DndContext
												sensors={sensors}
												collisionDetection={closestCenter}
												onDragEnd={handleDragEnd}
											>
												<SortableContext
													items={tasks.map(t => t.id)}
													strategy={verticalListSortingStrategy}
												>
													<div className='flex flex-col'>
														{tasks.map(task => (
															<SortableTaskItem
																key={task.id}
																id={task.id}
																content={
																	editingTaskId === task.id ? editingTaskContent : task.content
																}
																isComplete={task.isComplete}
																isEditing={editingTaskId === task.id}
																autoFocus={editingTaskId === task.id}
																onClick={() => toggleTask(task.id)}
																onContentClick={() => handleTaskEdit(task.id, task.content)}
																onChange={setEditingTaskContent}
																onSubmit={handleTaskEditSubmit}
																onDelete={() => {
																	removeTask(task.id)
																	setEditingTaskId(prev => (prev === task.id ? null : prev))
																}}
															/>
														))}
														{/* 아래 입력칸 항상 표시 (업무를 다 지워도 추가 가능) */}
														<TaskItem
															content={newTaskContent}
															isEditing
															autoFocus={tasks.length > 0}
															isPlaceholder={tasks.length === 0 && !newTaskContent}
															onChange={setNewTaskContent}
															onSubmit={handleTaskSubmit}
															onDelete={() => setNewTaskContent('')}
														/>
													</div>
												</SortableContext>
											</DndContext>
										</div>
									</div>

									{/* 피드백 사항 */}
									<div className='flex flex-col gap-3.5 w-[320px]'>
										{/* Header */}
										<div className='flex items-center justify-between px-1 pr-3'>
											<p className='text-[16px] font-semibold text-neutral-900 tracking-[-0.32px]'>
												피드백 사항
											</p>
											<div className='relative group'>
												<InfoIcon />
												<div className='absolute right-6 top-1/2 -translate-y-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20'>
													<Tooltip side='left' size='small' contentClassName='whitespace-nowrap'>
														피드백 미완료 시, 작업 현황의 빨간 테두리가 표시 됩니다.
													</Tooltip>
												</div>
											</div>
										</div>

										{/* Content */}
										<div className='relative'>
											{isCreateMode && (
												<div
													className='absolute inset-0 z-10 bg-white/60 rounded-6 cursor-not-allowed'
													aria-hidden
												/>
											)}
											<div
												ref={feedbackContentRef}
												className='bg-neutral-50 border border-neutral-100 rounded-6 min-h-[206px] px-3.5 py-2'
											>
												{feedbacks.map(feedback => (
													<FeedbackItem
														key={feedback.id}
														partName={feedback.partName}
														authorName={feedback.authorName}
														content={
															editingFeedbackId === feedback.id
																? editingFeedbackContent
																: feedback.content
														}
														timestamp={feedback.timestamp}
														state={feedback.state}
														isEditing={editingFeedbackId === feedback.id}
														autoFocus={editingFeedbackId === feedback.id}
														onClick={() => toggleFeedback(feedback.id)}
														onContentClick={() => handleFeedbackEdit(feedback.id, feedback.content)}
														onChange={setEditingFeedbackContent}
														onSubmit={handleFeedbackEditSubmit}
														onDelete={() => {
															removeFeedback(feedback.id)
															setEditingFeedbackId(prev => (prev === feedback.id ? null : prev))
														}}
													/>
												))}
												{/* 아래 입력칸 항상 표시 (피드백을 다 지워도 추가 가능) */}
												<FeedbackItem
													partName='파트 소속'
													authorName='작성자 이름'
													content={newFeedbackContent}
													timestamp={formatTimestamp()}
													isEditing
													autoFocus={feedbacks.length > 0}
													onChange={setNewFeedbackContent}
													onSubmit={handleFeedbackSubmit}
													onDelete={() => setNewFeedbackContent('')}
												/>
											</div>
										</div>
									</div>

									{/* 업로드 파일 & 링크 */}
									<div className='flex flex-col gap-3 w-[230px]'>
										{/* Header */}
										<div className='flex items-center justify-between px-1'>
											<p className='text-[16px] font-semibold text-neutral-900 tracking-[-0.32px]'>
												업로드 파일 & 링크
											</p>
											<button
												className='flex gap-0.5 items-center px-1.5 pr-2.5 py-0.5 bg-neutral-50/20 border border-neutral-200 rounded-6 shadow-inner-neutral-2'
												onClick={() => setIsAddingFile(true)}
											>
												<PlusIcon className='w-4 h-4 stroke-neutral-400' />
												<span className='body-3 font-medium text-neutral-400 tracking-[-0.26px]'>
													추가
												</span>
											</button>
										</div>

										{/* Content */}
										<div className='bg-neutral-50 border py-2 border-neutral-100 rounded-6 min-h-[206px] overflow-y-auto max-h-[300px]'>
											<div className='flex flex-col'>
												{/* 기존 파일 목록 */}
												{files.map(file => (
													<FileItem
														key={file.id}
														data={file}
														onClick={() => {
															if (file.url) {
																const url =
																	file.url.startsWith('http://') ||
																	file.url.startsWith('https://')
																		? file.url
																		: `https://${file.url}`
																window.open(url, '_blank')
															}
														}}
														onDelete={() => removeFile(file.id)}
														onDownload={() => {
															if (file.url && file.fileName) {
																const link = document.createElement('a')
																link.href = file.url
																link.download = file.fileName
																document.body.appendChild(link)
																link.click()
																document.body.removeChild(link)
															}
														}}
													/>
												))}
												{/* 파일 추가 입력 */}
												{isAddingFile && (
													<FileItem
														isEditing
														onSave={fileData => {
															addFile({
																id: Date.now(),
																...fileData,
															})
															setIsAddingFile(false)
														}}
														onCancel={() => setIsAddingFile(false)}
													/>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</OverlayScrollbarsComponent>
		</div>
	)
}

export default MissionModal
