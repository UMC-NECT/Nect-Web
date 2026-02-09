import { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import 'overlayscrollbars/overlayscrollbars.css'
import { useMissionModalStore } from '@/stores/mission-modal/missionModalStore'
import { useProcessDetailQuery } from '@/hooks/process/useProcessApi'
import { useTeamStore } from '@/stores/teamStore'
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
import {
	useMissionListQuery,
	useMissionDetailQuery,
	usePatchTaskItemMutation,
	useDeleteTaskItemMutation,
	usePatchMissionStatusMutation,
} from '@/hooks/process/useWeekMissionApi'
import { useProjectIdStore } from '@/stores/useProjectIdStroe'
import { usePostProcessMutation, usePostFileMutation, usePatchProcessMutation } from '@/hooks/process/useProcessApi'
import {
	usePostTaskItemsMutation,
	usePatchTaskItemsMutation,
	useDeleteTaskItemsMutation,
	usePatchTaskItemsOrderMutation,
} from '@/hooks/process/useTaskItemsApi'
import {
	usePostFeedbackMutation,
	usePatchFeedbackMutation,
	useDeleteFeedbackMutation,
} from '@/hooks/process/useFeedbackApi'
import {
	usePostUploadAttachmentFileMutation,
	usePostAttachmentLinksMutation,
	useDeleteAttachmentFileMutation,
	useDeleteAttachmentLinkMutation,
} from '@/hooks/process/useAttachmentApi'
import type { RequestProcessPostDto, RequestProcessPatchDto } from '@/types/api/process/process'

interface MissionModalProps {
	className?: string
	variant?: 'default' | 'leader' // 기본 모달 또는 리더형 모달
}

const formatDateForDisplay = (dateStr: string) => {
	if (!dateStr) return ''
	return dateStr.replace(/-/g, '.')
}

/** 모달 표시용 "YYYY.MM.DD" → API용 "YYYY-MM-DD" */
const formatDateToApi = (dateStr: string) => {
	if (!dateStr) return ''
	return dateStr.replace(/\./g, '-')
}

/** 타임스탬프 표시: "26/2/9 AM 8:52" 형식 (YY/M/D AM/PM H:MM) */
const formatTimestampDisplay = (date: Date | string): string => {
	const d = typeof date === 'string' ? new Date(date) : date
	if (Number.isNaN(d.getTime())) return ''
	const year = d.getFullYear().toString().slice(-2)
	const month = d.getMonth() + 1
	const day = d.getDate()
	const hours = d.getHours()
	const minutes = d.getMinutes().toString().padStart(2, '0')
	const period = hours >= 12 ? 'PM' : 'AM'
	const displayHours = hours % 12 || 12
	return `${year}/${month}/${day} ${period} ${displayHours}:${minutes}`
}

/** 파츠 API role_field와 위크미션 task_groups 매칭용 (ROLE: 제거, 대소문자 무시) */
const normalizeRoleFieldForMatch = (v: string | null | undefined) =>
	(v ?? '').replace(/^ROLE:/i, '').trim().toLowerCase()

const roleFieldMatches = (
	role: { role_field: string | null; custom_role_field_name: string | null },
	group: { role_field: string | null; custom_field_name: string | null }
) => {
	const a = normalizeRoleFieldForMatch(role.role_field)
	const b = normalizeRoleFieldForMatch(role.custom_role_field_name)
	const ga = normalizeRoleFieldForMatch(group.role_field)
	const gb = normalizeRoleFieldForMatch(group.custom_field_name)
	return (a !== '' && a === ga) || (b !== '' && b === gb) || (a !== '' && a === gb) || (b !== '' && b === ga)
}

/** role_field 값이 있으면 role_field만 보내고 custom_role_field_name은 null, 없으면 그 반대 */
const toRoleFieldPayload = (
	part: { role_field?: string | null; custom_role_field_name?: string | null } | null | undefined
) => {
	if (part == null) return { role_field: null as string | null, custom_role_field_name: null as string | null }
	const hasRoleField = !!part.role_field?.trim()
	return {
		role_field: hasRoleField ? part.role_field! : null,
		custom_role_field_name: hasRoleField ? null : (part.custom_role_field_name ?? null),
	}
}

const MissionModal = ({ className, variant = 'default' }: MissionModalProps) => {
	const isLeader = variant === 'leader'
	const { roles, persons } = useTeamStore()
	const {
		editingMissionId,
		projectId,
		setMissions,
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
		missionNumber,
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
		setRoleTasks,
		roleTasks,
		addRoleTask,
		updateRoleTask,
		toggleRoleTask,
		addFeedback,
		updateFeedback,
		removeFeedback,
		toggleFeedback,
		addFile,
		removeFile,
		closeMissionModal,
		mentionedPersons,
		setMentionedPersons,
		isTask,
	} = useMissionModalStore()

	const { projectId: pageProjectId } = useProjectIdStore()
	const projectIdForList = projectId ?? pageProjectId?.toString() ?? ''

	const isEditMode = editingMissionId != null && projectId != null
	const { data: processDetail } = useProcessDetailQuery(projectId ?? '', String(editingMissionId ?? ''), {
		enabled: isEditMode && !isTask,
	})
	const { data: missionDetail } = useMissionDetailQuery(projectId ?? '', String(editingMissionId ?? ''), {
		enabled: isEditMode && !!isTask,
	})
	const { data: missionListData } = useMissionListQuery(projectIdForList)
	const patchTaskItemMutation = usePatchTaskItemMutation()
	const deleteTaskItemMutation = useDeleteTaskItemMutation()
	const patchMissionStatusMutation = usePatchMissionStatusMutation()

	useEffect(() => {
		if (!missionListData?.body?.missions) return
		const list = missionListData.body.missions.map(m => ({
			id: m.mission_number,
			missionNumber: m.mission_number,
			is_current: m.is_current,
		}))
		setMissions(list)
		// 편집 모드(기존 프로세스 조회)에서는 openMissionModal에서 넘긴 missionNumber 사용, mission list로 덮어쓰지 않음
		if (editingMissionId != null) return
		const current = list.find(m => m.is_current)
		if (current) setMissionNumber(current.missionNumber)
	}, [missionListData, setMissions, setMissionNumber, editingMissionId])

	const appliedDetailKeyRef = useRef<string | null>(null)
	useEffect(() => {
		if (!isEditMode || isTask || !processDetail?.body) return
		const key = `${projectId}-${editingMissionId}`
		if (appliedDetailKeyRef.current === key) return
		appliedDetailKeyRef.current = key
		const body = processDetail.body
		setTitle(body.process_title ?? '')
		setWorkContent(body.process_content ?? '')
		setStartDate(formatDateForDisplay(body.start_date ?? ''))
		setDeadline(formatDateForDisplay(body.dead_line ?? ''))
		const statusMap: Record<string, MissionStatus> = {
			PLANNING: 'planning',
			IN_PROGRESS: 'in_progress',
			DONE: 'completed',
			BACKLOG: 'backlog',
		}
		const status = statusMap[body.process_status ?? ''] ?? 'planning'
		setMissionStatus(status)

		if (body.mission_number != null) setMissionNumber(body.mission_number)

		const roleFieldValues = (body.role_fields ?? []) as string[]
		const matchedParts = roleFieldValues
			.map(value => roles.find(r => r.role_field === value || r.custom_role_field_name === value))
			.filter((r): r is NonNullable<typeof r> => r != null)
		setSelectedParts(matchedParts)

		const assignees = (body.assignees ?? []).map(a => ({
			id: a.user_id,
			name: a.user_name ?? a.nickname,
			roleId: 0,
			image: a.user_image ?? '',
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
			authorName: f.created_by?.user_name ?? f.created_by?.nickname ?? '',
			content: f.content,
			timestamp: formatTimestampDisplay(f.created_at),
			state: (f.status === 'complete' ? 'complete' : 'default') as 'default' | 'complete' | 'disabled',
		}))
		setFeedbacks(feedbackList)

		const fileItems = (body.attachments ?? []).map(att => {
			if (att.type === 'FILE') {
				return {
					id: att.id,
					type: 'file' as const,
					name: att.file_name ?? '',
					url: att.file_url ?? '',
					fileName: att.file_name ?? '',
				}
			}
			return {
				id: att.id,
				type: 'link' as const,
				name: att.title ?? att.url ?? '',
				url: att.url ?? '',
			}
		})
		setFiles(fileItems)

		const mentionIds = body.mention_user_ids ?? []
		const mentionedList = persons.filter(p => mentionIds.includes(p.id))
		setMentionedPersons(mentionedList)
	}, [
		isEditMode,
		isTask,
		processDetail,
		projectId,
		editingMissionId,
		setTitle,
		setWorkContent,
		setStartDate,
		setDeadline,
		setMissionStatus,
		setMissionNumber,
		setSelectedParts,
		setSelectedAssignees,
		setTasks,
		setFeedbacks,
		setFiles,
		setMentionedPersons,
		roles,
		persons,
	])

	// 위크미션(task) task_groups 보관 - 선택된 파트에 따라 해당 그룹의 items만 표시
	type TaskGroupItem = { role_field: string | null; custom_field_name: string | null; items: Array<{ task_item_id: number; content: string; is_done: boolean; sort_order: number; done_at: string | null }> }
	const missionTaskGroupsRef = useRef<TaskGroupItem[]>([])

	// 위크미션(task) 상세 적용 - ResponseMissionDetailDto 반환값을 모달 필드에 매핑
	const appliedMissionDetailKeyRef = useRef<string | null>(null)
	useEffect(() => {
		if (!isEditMode || !isTask || !missionDetail?.body) return
		const body = missionDetail.body
		const taskGroups = body.task_groups ?? []
		const key = `mission-${projectId}-${editingMissionId}`
		// task_groups가 있는데 roles가 비어 있으면 파츠 로드 후 다시 적용되도록 ref 설정 보류
		const canMatchParts = taskGroups.length === 0 || roles.length > 0
		if (appliedMissionDetailKeyRef.current === key && canMatchParts) return
		if (canMatchParts) appliedMissionDetailKeyRef.current = key
		setTitle(body.title ?? '')
		setWorkContent(body.content ?? '')
		setStartDate(formatDateForDisplay(body.start_date ?? ''))
		setDeadline(formatDateForDisplay(body.dead_line ?? ''))
		const statusMap: Record<string, MissionStatus> = {
			PLANNING: 'planning',
			IN_PROGRESS: 'in_progress',
			DONE: 'completed',
			BACKLOG: 'backlog',
		}
		setMissionStatus(statusMap[body.status ?? ''] ?? 'planning')
		if (body.assignee) {
			setSelectedAssignees([
				{
					id: body.assignee.user_id,
					name: body.assignee.name ?? body.assignee.nickname,
					roleId: 0,
					image: body.assignee.profile_image_url ?? '',
				},
			])
		} else {
			setSelectedAssignees([])
		}
		missionTaskGroupsRef.current = taskGroups
		if (taskGroups.length > 0) {
			const firstGroup = taskGroups[0]
			const matchedRole = roles.find(r => roleFieldMatches(r, firstGroup))
			if (matchedRole) {
				setSelectedParts([matchedRole])
			}
			setTasks(
				firstGroup.items.map(t => ({
					id: t.task_item_id,
					content: t.content,
					isComplete: t.is_done,
				}))
			)
			// 리더형 모달(RoleTaskPanel)용 roleTasks 채우기 - 파츠 API role_field로 task_groups 매칭
			const roleTasksFromGroups: Array<{ id: number; roleId: number; content: string; isComplete: boolean }> = []
			for (const group of taskGroups) {
				const role = roles.find(r => roleFieldMatches(r, group))
				const roleId = role?.part_id ?? 0
				for (const t of group.items) {
					roleTasksFromGroups.push({
						id: t.task_item_id,
						roleId,
						content: t.content,
						isComplete: t.is_done,
					})
				}
			}
			setRoleTasks(roleTasksFromGroups)
		} else {
			setTasks((body.task_items ?? []).map(t => ({
				id: t.task_item_id,
				content: t.content,
				isComplete: t.is_done,
			})))
			setRoleTasks([])
		}
		// 위크미션 상세 attachments → 파일/링크 목록 렌더링용
		const fileItems = (body.attachments ?? []).map(att => {
			if (att.type === 'FILE') {
				return {
					id: att.id,
					type: 'file' as const,
					name: att.file_name ?? '',
					url: att.file_url ?? '',
					fileName: att.file_name ?? '',
				}
			}
			return {
				id: att.id,
				type: 'link' as const,
				name: att.title ?? att.url ?? '',
				url: att.url ?? '',
			}
		})
		setFiles(fileItems)
	}, [
		isEditMode,
		isTask,
		missionDetail,
		projectId,
		editingMissionId,
		roles,
		setTitle,
		setWorkContent,
		setStartDate,
		setDeadline,
		setMissionStatus,
		setSelectedAssignees,
		setSelectedParts,
		setTasks,
		setRoleTasks,
		setFiles,
	])

	// 위크미션(task) 모달에서 담당 파트 변경 시 해당 파트의 task_groups items만 tasks에 반영
	useEffect(() => {
		if (!isTask || !missionTaskGroupsRef.current.length) return
		const parts = selectedParts
		if (!parts.length) return
		const fieldMatch = (group: TaskGroupItem) =>
			parts.some(p => roleFieldMatches(p, group))
		const matchedGroups = missionTaskGroupsRef.current.filter(fieldMatch)
		const items = matchedGroups.flatMap(g => g.items)
		setTasks(
			items.map(t => ({
				id: t.task_item_id,
				content: t.content,
				isComplete: t.is_done,
			}))
		)
	}, [isTask, selectedParts, setTasks])

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	)

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) return
		const fromIndex = tasks.findIndex(t => t.id === active.id)
		const toIndex = tasks.findIndex(t => t.id === over.id)
		if (fromIndex === -1 || toIndex === -1) return
		const reordered = [...tasks]
		const [moved] = reordered.splice(fromIndex, 1)
		reordered.splice(toIndex, 0, moved)
		const newOrderIds = reordered.map(t => t.id)
		reorderTasks(active.id as number, over.id as number)
		if (
			isEditMode &&
			projectId != null &&
			editingMissionId != null &&
			newOrderIds.length > 0
		) {
			const firstPart = selectedParts[0]
			const rolePayload = toRoleFieldPayload(firstPart ?? undefined)
			patchTaskItemsOrderMutation.mutate(
				{
					projectId,
					processId: String(editingMissionId),
					body: {
						ordered_task_item_ids: newOrderIds,
						role_field: rolePayload.role_field,
						custom_role_field_name: rolePayload.custom_role_field_name,
					},
				},
				)
		}
	}

	const nextTempTaskIdRef = useRef(-1)
	const nextTempFeedbackIdRef = useRef(-1)
	const nextTempFileIdRef = useRef(-1)
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

	const postFileMutation = usePostFileMutation()
	const postProcessMutation = usePostProcessMutation()
	const patchProcessMutation = usePatchProcessMutation()
	const postTaskItemsMutation = usePostTaskItemsMutation()
	const patchTaskItemsMutation = usePatchTaskItemsMutation()
	const deleteTaskItemsMutation = useDeleteTaskItemsMutation()
	const patchTaskItemsOrderMutation = usePatchTaskItemsOrderMutation()
	const postFeedbackMutation = usePostFeedbackMutation()
	const patchFeedbackMutation = usePatchFeedbackMutation()
	const deleteFeedbackMutation = useDeleteFeedbackMutation()
	const postUploadAttachmentFileMutation = usePostUploadAttachmentFileMutation()
	const postAttachmentLinksMutation = usePostAttachmentLinksMutation()
	const deleteAttachmentFileMutation = useDeleteAttachmentFileMutation()
	const deleteAttachmentLinkMutation = useDeleteAttachmentLinkMutation()

	const toggleDropdown = (dropdown: 'mission' | 'parts' | 'assignees' | 'duration' | 'status') => {
		setOpenDropdown(prev => (prev === dropdown ? null : dropdown))
	}

	const handleSave = async () => {
		if (!projectIdForList) return
		const projectIdNum = Number(projectIdForList)
		if (Number.isNaN(projectIdNum)) return

		// 편집 모드: 기존 프로세스 수정 → PATCH
		if (isEditMode && editingMissionId != null && projectId != null) {
			const patchBody: RequestProcessPatchDto = {
				process_title: title.trim() || '',
				process_content: workContent.trim() || '',
				process_status: missionStatus.toUpperCase(),
				start_date: formatDateToApi(startDate),
				dead_line: formatDateToApi(deadline),
				role_fields: selectedParts.map(p => p.role_field ?? p.custom_role_field_name ?? '').filter(Boolean),
				custom_fields: processDetail?.body?.custom_fields ?? [],
				mission_number: missionNumber,
				assignee_ids: selectedAssignees.map(a => a.id),
				mention_user_ids: mentionedPersons.map(p => p.id),
			}
			try {
				// 위크미션 task: 작업 상태는 patchMissionStatus API로 전송
				if (isTask) {
					const statusForApi = missionStatus === 'completed' ? 'DONE' : missionStatus.toUpperCase()
					await patchMissionStatusMutation.mutateAsync({
						projectId,
						processId: String(editingMissionId),
						body: { status: statusForApi as 'PLANNING' | 'IN_PROGRESS' | 'DONE' | 'BACKLOG' },
					})
				}
				await patchProcessMutation.mutateAsync({
					projectId,
					processId: String(editingMissionId),
					body: patchBody,
				})
				closeMissionModal()
			} catch {
				// 에러 토스트 등은 필요 시 추가
			}
			return
		}

		// 생성 모드: 새 프로세스 → POST (파일 업로드 + postProcess)
		const fileIds: number[] = []
		for (const file of files) {
			if (file.type === 'file') {
				if (file.rawFile) {
					const formData = new FormData()
					formData.append('file', file.rawFile)
					try {
						const res = await postFileMutation.mutateAsync({
							projectId: projectIdForList,
							body: formData,
						})
						if (res?.body?.file_id != null) fileIds.push(res.body.file_id)
					} catch {
						// 업로드 실패 시 해당 파일은 제외
					}
				} else if (!file.rawFile) {
					// 이미 서버에 있는 파일 (상세 로드 시 id = file_id)
					fileIds.push(file.id)
				}
			}
		}
		const links = files
			.filter((f): f is typeof f & { url: string; name: string } => f.type === 'link' && !!f.url)
			.map(f => ({ title: f.name || '', url: f.url }))

		const body: RequestProcessPostDto = {
			process_title: title.trim() || '',
			process_content: workContent.trim() || '',
			process_status: missionStatus.toUpperCase(),
			assignee_ids: selectedAssignees.map(a => a.id),
			role_fields: selectedParts.map(p => p.role_field ?? p.custom_role_field_name ?? '').filter(Boolean),
			custom_field_name: null,
			mission_number: missionNumber,
			start_date: formatDateToApi(startDate),
			dead_line: formatDateToApi(deadline),
			mention_user_ids: mentionedPersons.map(p => p.id),
			file_ids: fileIds,
			links,
			task_items: tasks.map((t, i) => ({
				content: t.content,
				is_done: t.isComplete,
				sort_order: i + 1,
			})),
		}
		try {
			await postProcessMutation.mutateAsync({ projectId: projectIdNum, body })
			closeMissionModal()
		} catch {
			// 에러 토스트 등은 필요 시 추가
		}
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

	const formatTimestamp = () => formatTimestampDisplay(new Date())

	const handleTaskSubmit = () => {
		const content = newTaskContent.trim()
		if (!content) return
		if (isEditMode && projectId != null && editingMissionId != null) {
			postTaskItemsMutation.mutate(
				{
					projectId,
					processId: String(editingMissionId),
					body: { content, is_done: false, sort_order: tasks.length },
				},
				{
					onSuccess: res => {
						if (res?.body) {
							addTask({
								id: res.body.task_item_id,
								content: res.body.content,
								isComplete: res.body.is_done,
							})
						}
						setNewTaskContent('')
					},
				}
			)
		} else {
			addTask({ id: nextTempTaskIdRef.current--, content, isComplete: false })
			setNewTaskContent('')
		}
	}

	const handleTaskEdit = (taskId: number, content: string) => {
		setEditingTaskId(taskId)
		setEditingTaskContent(content)
	}

	const handleTaskEditSubmit = () => {
		if (editingTaskId === null || !editingTaskContent.trim()) {
			setEditingTaskId(null)
			setEditingTaskContent('')
			return
		}
		const task = tasks.find(t => t.id === editingTaskId)
		const sortOrder = task ? tasks.findIndex(t => t.id === editingTaskId) : 0
		const firstPart = selectedParts[0]
		if (isEditMode && projectId != null && editingMissionId != null && task) {
			if (isTask) {
				const rolePayload = toRoleFieldPayload(firstPart ?? undefined)
				patchTaskItemMutation.mutate(
					{
						projectId,
						processId: String(editingMissionId),
						taskItemId: String(editingTaskId),
						body: {
							content: editingTaskContent.trim(),
							is_done: task.isComplete,
							...rolePayload,
						},
					},
					{
						onSuccess: () => {
							updateTask(editingTaskId, { content: editingTaskContent.trim() })
							setEditingTaskId(null)
							setEditingTaskContent('')
						},
					}
				)
			} else {
				patchTaskItemsMutation.mutate(
					{
						projectId,
						processId: String(editingMissionId),
						taskItemId: String(editingTaskId),
						body: {
							content: editingTaskContent.trim(),
							is_done: task.isComplete,
							sort_order: sortOrder,
						},
					},
					{
						onSuccess: () => {
							updateTask(editingTaskId, { content: editingTaskContent.trim() })
							setEditingTaskId(null)
							setEditingTaskContent('')
						},
					}
				)
			}
		} else {
			updateTask(editingTaskId, { content: editingTaskContent.trim() })
			setEditingTaskId(null)
			setEditingTaskContent('')
		}
	}

	const handleTaskToggle = (task: { id: number; content: string; isComplete: boolean }) => {
		if (isEditMode && projectId != null && editingMissionId != null) {
			const firstPart = selectedParts[0]
			if (isTask) {
				const rolePayload = toRoleFieldPayload(firstPart ?? undefined)
				patchTaskItemMutation.mutate(
					{
						projectId,
						processId: String(editingMissionId),
						taskItemId: String(task.id),
						body: {
							content: task.content,
							is_done: !task.isComplete,
							...rolePayload,
						},
					},
					{
						onSuccess: () => {
							updateTask(task.id, { isComplete: !task.isComplete })
						},
					}
				)
			} else {
				const sortOrder = tasks.findIndex(t => t.id === task.id)
				patchTaskItemsMutation.mutate(
					{
						projectId,
						processId: String(editingMissionId),
						taskItemId: String(task.id),
						body: {
							content: task.content,
							is_done: !task.isComplete,
							sort_order: sortOrder,
						},
					},
					{
						onSuccess: () => {
							updateTask(task.id, { isComplete: !task.isComplete })
						},
					}
				)
			}
		} else {
			toggleTask(task.id)
		}
	}

	const handleTaskDelete = (taskId: number) => {
		if (isEditMode && projectId != null && editingMissionId != null) {
			const onSuccess = () => {
				removeTask(taskId)
				setEditingTaskId(prev => (prev === taskId ? null : prev))
			}
			const variables = {
				projectId,
				processId: String(editingMissionId),
				taskItemId: String(taskId),
			}
			if (isTask) {
				deleteTaskItemMutation.mutate(variables, { onSuccess })
			} else {
				deleteTaskItemsMutation.mutate(variables, { onSuccess })
			}
		} else {
			removeTask(taskId)
			setEditingTaskId(prev => (prev === taskId ? null : prev))
		}
	}

	const handleFeedbackSubmit = () => {
		const content = newFeedbackContent.trim()
		if (!content) return
		if (isEditMode && projectId != null && editingMissionId != null) {
			postFeedbackMutation.mutate(
				{
					projectId,
					processId: String(editingMissionId),
					body: { content },
				},
				{
					onSuccess: res => {
						if (res?.body) {
							const b = res.body
							addFeedback({
								id: b.feedback_id,
								partName: b.created_by?.role_fields?.[0] ?? '',
								authorName: b.created_by?.user_name ?? '',
								content: b.content,
								timestamp: formatTimestampDisplay(b.created_at),
								state: (b.status === 'complete' ? 'complete' : 'default') as 'default' | 'complete' | 'disabled',
							})
						}
						setNewFeedbackContent('')
					},
				}
			)
		} else {
			addFeedback({
				id: nextTempFeedbackIdRef.current--,
				partName: '파트 소속',
				authorName: '작성자 이름',
				content,
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
		if (editingFeedbackId === null || !editingFeedbackContent.trim()) {
			setEditingFeedbackId(null)
			setEditingFeedbackContent('')
			return
		}
		if (isEditMode && projectId != null && editingMissionId != null) {
			patchFeedbackMutation.mutate(
				{
					projectId,
					processId: String(editingMissionId),
					feedbackId: String(editingFeedbackId),
					body: { content: editingFeedbackContent.trim() },
				},
				{
					onSuccess: () => {
						updateFeedback(editingFeedbackId, { content: editingFeedbackContent.trim() })
						setEditingFeedbackId(null)
						setEditingFeedbackContent('')
					},
				}
			)
		} else {
			updateFeedback(editingFeedbackId, { content: editingFeedbackContent.trim() })
			setEditingFeedbackId(null)
			setEditingFeedbackContent('')
		}
	}

	const handleFeedbackDelete = (feedbackId: number) => {
		if (isEditMode && projectId != null && editingMissionId != null) {
			deleteFeedbackMutation.mutate(
				{
					projectId,
					processId: String(editingMissionId),
					feedbackId: String(feedbackId),
				},
				{
					onSuccess: () => {
						removeFeedback(feedbackId)
						setEditingFeedbackId(prev => (prev === feedbackId ? null : prev))
					},
				}
			)
		} else {
			removeFeedback(feedbackId)
			setEditingFeedbackId(prev => (prev === feedbackId ? null : prev))
		}
	}

	type FileSaveData = Omit<import('@/stores/mission-modal/missionModalStore').FileItem, 'id'>
	const handleFileSave = (fileData: FileSaveData) => {
		if (isEditMode && projectId != null && editingMissionId != null) {
			if (fileData.type === 'file' && fileData.rawFile) {
				const formData = new FormData()
				formData.append('file', fileData.rawFile)
				postUploadAttachmentFileMutation.mutate(
					{
						projectId,
						processId: String(editingMissionId),
						body: formData,
					},
					{
						onSuccess: res => {
							if (res?.body) {
								addFile({
									id: res.body.file_id,
									type: 'file',
									name: res.body.file_name,
									fileName: res.body.file_name,
									url: res.body.file_url,
								})
							}
							setIsAddingFile(false)
						},
					}
				)
			} else if (fileData.type === 'link' && fileData.url) {
				postAttachmentLinksMutation.mutate(
					{
						projectId,
						processId: String(editingMissionId),
						body: { title: fileData.name ?? '', link_url: fileData.url },
					},
					{
						onSuccess: res => {
							if (res?.body) {
								addFile({
									id: res.body.document_id,
									type: 'link',
									name: res.body.title,
									url: res.body.url,
								})
							}
							setIsAddingFile(false)
						},
					}
				)
			}
		} else {
			addFile({
				id: nextTempFileIdRef.current--,
				...fileData,
			})
			setIsAddingFile(false)
		}
	}

	const handleFileDelete = (file: { id: number; type: 'file' | 'link' }) => {
		if (isEditMode && projectId != null && editingMissionId != null) {
			if (file.type === 'file') {
				deleteAttachmentFileMutation.mutate(
					{
						projectId,
						processId: String(editingMissionId),
						fileId: file.id,
					},
					{
						onSuccess: () => {
							removeFile(file.id)
						},
					}
				)
			} else {
				deleteAttachmentLinkMutation.mutate(
					{
						projectId,
						processId: String(editingMissionId),
						linkId: file.id,
					},
					{
						onSuccess: () => {
							removeFile(file.id)
						},
					}
				)
			}
		} else {
			removeFile(file.id)
		}
	}

	// 리더형 모달 + 편집 모드: RoleTaskPanel 업무 추가/수정/토글 API 연동
	const rolePanelApiHandlers =
		isLeader && isEditMode && projectId != null && editingMissionId != null
			? {
					onAddTask: (roleId: number, content: string) => {
						const sortOrder = roleTasks.filter(t => t.roleId === roleId).length
						postTaskItemsMutation.mutate(
							{
								projectId,
								processId: String(editingMissionId),
								body: { content, is_done: false, sort_order: sortOrder },
							},
							{
								onSuccess: res => {
									if (res?.body) {
										addRoleTask({
											id: res.body.task_item_id,
											roleId,
											content,
											isComplete: false,
										})
									}
								},
							}
						)
					},
					onToggleTask: (taskId: number) => {
						const task = roleTasks.find(t => t.id === taskId)
						if (!task) return
						const part = roles.find(r => r.part_id === task.roleId)
						if (isTask) {
							const rolePayload = toRoleFieldPayload(part ?? undefined)
							patchTaskItemMutation.mutate(
								{
									projectId,
									processId: String(editingMissionId),
									taskItemId: String(taskId),
									body: {
										content: task.content,
										is_done: !task.isComplete,
										...rolePayload,
									},
								},
								{
									onSuccess: () => toggleRoleTask(taskId),
								}
							)
						} else {
							const sortOrder = roleTasks.findIndex(t => t.id === taskId)
							patchTaskItemsMutation.mutate(
								{
									projectId,
									processId: String(editingMissionId),
									taskItemId: String(taskId),
									body: {
										content: task.content,
										is_done: !task.isComplete,
										sort_order: sortOrder,
									},
								},
								{
									onSuccess: () => toggleRoleTask(taskId),
								}
							)
						}
					},
					onUpdateTask: (taskId: number, content: string) => {
						const task = roleTasks.find(t => t.id === taskId)
						if (!task) return
						const part = roles.find(r => r.part_id === task.roleId)
						if (isTask) {
							const rolePayload = toRoleFieldPayload(part ?? undefined)
							patchTaskItemMutation.mutate(
								{
									projectId,
									processId: String(editingMissionId),
									taskItemId: String(taskId),
									body: {
										content,
										is_done: task.isComplete,
										...rolePayload,
									},
								},
								{
									onSuccess: () => updateRoleTask(taskId, { content }),
								}
							)
						} else {
							const sortOrder = roleTasks.findIndex(t => t.id === taskId)
							patchTaskItemsMutation.mutate(
								{
									projectId,
									processId: String(editingMissionId),
									taskItemId: String(taskId),
									body: {
										content,
										is_done: task.isComplete,
										sort_order: sortOrder,
									},
								},
								{
									onSuccess: () => updateRoleTask(taskId, { content }),
								}
							)
						}
					},
				}
			: undefined

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

					<button
						type='button'
						disabled={
							postProcessMutation.isPending ||
							postFileMutation.isPending ||
							patchProcessMutation.isPending ||
							patchMissionStatusMutation.isPending ||
							postUploadAttachmentFileMutation.isPending ||
							postAttachmentLinksMutation.isPending
						}
						onClick={handleSave}
						className='button-1 font-semibold px-2.5 py-1.5 rounded-6 bg-primary-150-light text-primary-500-normal min-w-[60px] hover:bg-primary-200-light transition-all duration-300 ease-in-out disabled:opacity-50 disabled:pointer-events-none'
					>
						{postProcessMutation.isPending ||
						postFileMutation.isPending ||
						patchProcessMutation.isPending ||
						patchMissionStatusMutation.isPending ||
						postUploadAttachmentFileMutation.isPending ||
						postAttachmentLinksMutation.isPending
							? '저장 중...'
							: '저장'}
					</button>
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
														onDelete={() => handleFileDelete(file)}
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
														onSave={handleFileSave}
														onCancel={() => setIsAddingFile(false)}
													/>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* Right: Role Task Panel */}
								<RoleTaskPanel
									onAddTask={rolePanelApiHandlers?.onAddTask}
									onToggleTask={rolePanelApiHandlers?.onToggleTask}
									onUpdateTask={rolePanelApiHandlers?.onUpdateTask}
								/>
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
																onClick={() => handleTaskToggle(task)}
																onContentClick={() => handleTaskEdit(task.id, task.content)}
																onChange={setEditingTaskContent}
																onSubmit={handleTaskEditSubmit}
																onDelete={() => handleTaskDelete(task.id)}
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
														onDelete={() => handleFeedbackDelete(feedback.id)}
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
														onDelete={() => handleFileDelete(file)}
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
														onSave={handleFileSave}
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
