import { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useMissionModalStore } from '@/stores/mission-modal/missionModalStore'
import MissionTagChip from './MissionTagChip'
import PartSelector from './PartSelector'
import TagChipList from './TagChipList'
import TaskItem from './TaskItem'
import SortableTaskItem from './SortableTaskItem'
import FeedbackItem from './FeedbackItem'
import WorkContentInput from './WorkContentInput'
import StatusChip from '@/components/common/StatusChip'
import StatusChipList from '@/components/common/StatusChipList'
import Tooltip from '@/components/common/Tooltip'
import PlusIcon from '@/assets/icons/week-mission/plus.svg?react'
import CheckboxIcon from '@/assets/icons/common/checkbox/checkbox-gray.svg?react'
import InfoIcon from '@/assets/icons/common/info.svg?react'

interface MissionModalProps {
    onFileUploadClick?: () => void
    className?: string
}

const MissionModal = ({
    onFileUploadClick,
    className,
}: MissionModalProps) => {
    const {
        missionNumber,
        title,
        selectedParts,
        selectedAssignees,
        selectedDuration,
        missionStatus,
        workContent,
        tasks,
        feedbacks,
        setTitle,
        addSelectedPart,
        removeSelectedPart,
        addSelectedAssignee,
        removeSelectedAssignee,
        setSelectedDuration,
        setMissionStatus,
        setWorkContent,
        addTask,
        updateTask,
        toggleTask,
        reorderTasks,
        addFeedback,
        updateFeedback,
        toggleFeedback,
    } = useMissionModalStore()

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
    const [isAddingTask, setIsAddingTask] = useState(true)
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
    const [editingTaskContent, setEditingTaskContent] = useState('')

    const [newFeedbackContent, setNewFeedbackContent] = useState('')
    const [isAddingFeedback, setIsAddingFeedback] = useState(true)
    const [editingFeedbackId, setEditingFeedbackId] = useState<number | null>(null)
    const [editingFeedbackContent, setEditingFeedbackContent] = useState('')

    // Dropdown states
    type DropdownType = 'parts' | 'assignees' | 'duration' | 'status' | null
    const [openDropdown, setOpenDropdown] = useState<DropdownType>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleDropdown = (type: DropdownType) => {
        setOpenDropdown(openDropdown === type ? null : type)
    }

    // Duration options

    const completedTasks = tasks.filter(t => t.isComplete).length
    const totalTasks = tasks.length

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

    // Task handlers
    const handleTaskSubmit = (content: string) => {
        if (content.trim()) {
            addTask({
                id: Date.now(),
                content: content.trim(),
                isComplete: false,
            })
            setNewTaskContent('')
            setIsAddingTask(true)
        }
    }

    const handleTaskEdit = (taskId: number, currentContent: string) => {
        setEditingTaskId(taskId)
        setEditingTaskContent(currentContent)
        setIsAddingTask(false)
    }

    const handleTaskEditSubmit = (content: string) => {
        if (editingTaskId && content.trim()) {
            updateTask(editingTaskId, { content: content.trim() })
        }
        setEditingTaskId(null)
        setEditingTaskContent('')
        setIsAddingTask(true)
    }

    // Feedback handlers
    const handleFeedbackSubmit = (content: string) => {
        if (content.trim()) {
            addFeedback({
                id: Date.now(),
                partName: '내 파트',
                authorName: '나',
                content: content.trim(),
                timestamp: formatTimestamp(),
                state: 'default',
            })
            setNewFeedbackContent('')
            setIsAddingFeedback(true)
        }
    }

    const handleFeedbackEdit = (feedbackId: number, currentContent: string) => {
        setEditingFeedbackId(feedbackId)
        setEditingFeedbackContent(currentContent)
        setIsAddingFeedback(false)
    }

    const handleFeedbackEditSubmit = (content: string) => {
        if (editingFeedbackId && content.trim()) {
            updateFeedback(editingFeedbackId, { content: content.trim() })
        }
        setEditingFeedbackId(null)
        setEditingFeedbackContent('')
        setIsAddingFeedback(true)
    }

    return (
        <div
            className={cn(
                'flex items-center justify-center-safe bg-white rounded-12 px-[58px] py-[34px] w-full overflow-x-auto overflow-y-hidden',
                className
            )}
        >
            <div className='flex flex-col gap-[22px] w-[924px]'>
                {/* Mission Tag */}
                <MissionTagChip missionNumber={missionNumber} />

                <div className='flex flex-col gap-9'>
                    {/* Title */}
                    <input
                        type='text'
                        className='text-[28px] font-bold text-neutral-900 leading-[1.3] placeholder:text-neutral-300 outline-none bg-transparent w-full'
                        placeholder='새 미션 업무'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

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
                                                disabledRoleIds={selectedParts.map(p => p.id)}
                                                onRoleSelect={(role) => {
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
                                                onPersonSelect={(person) => {
                                                    addSelectedAssignee(person)
                                                }}
                                                className='w-[130px]'
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* 진행 기간 */}
                                <div className='flex gap-1.5 items-center relative'>
                                    <span className='body-2 font-medium text-neutral-500 w-[70px]'>진행 기간</span>
                                    <input
                                        type='text'
                                        value={selectedDuration}
                                        onChange={(e) => {
                                            let value = e.target.value

                                            // 숫자와 점, ~, 공백만 허용
                                            value = value.replace(/[^0-9.~ ]/g, '')

                                            // 자동 포맷팅: yyyy.mm.dd ~ yyyy.mm.dd
                                            const digits = value.replace(/[^0-9]/g, '')
                                            let formatted = ''

                                            for (let i = 0; i < digits.length && i < 16; i++) {
                                                if (i === 4 || i === 6 || i === 12 || i === 14) {
                                                    formatted += '.'
                                                }
                                                if (i === 8) {
                                                    formatted += ' ~ '
                                                }
                                                formatted += digits[i]
                                            }

                                            setSelectedDuration(formatted)
                                        }}
                                        placeholder='입력해주세요'
                                        className={cn(
                                            'flex min-h-[28px] py-0.5 px-2 rounded-[6px] bg-neutral-50 w-[266px] items-center',
                                            'hover:bg-neutral-100 focus:bg-neutral-100 transition-colors shadow-inner-neutral-2',
                                            'button-1 font-medium text-neutral-700 placeholder:text-neutral-300',
                                            'outline-none border-none'
                                        )}
                                    />
                                </div>

                                {/* 작업 상태 */}
                                <div className='flex gap-2.5 items-center relative'>
                                    <span className='body-2 font-medium text-neutral-500 w-[70px]'>작업 상태</span>
                                    <div onClick={() => toggleDropdown('status')}>
                                        <StatusChip state={missionStatus} />
                                    </div>
                                    {openDropdown === 'status' && (
                                        <div className='absolute top-full left-[76px] mt-1 z-10'>
                                            <StatusChipList
                                                onStatusChange={(status) => {
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
                                <div className='bg-neutral-50 border border-neutral-100 rounded-[6px] min-h-[206px] px-3 py-2'>
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
                                                {tasks.map((task) => (
                                                    <SortableTaskItem
                                                        key={task.id}
                                                        id={task.id}
                                                        content={editingTaskId === task.id ? editingTaskContent : task.content}
                                                        isComplete={task.isComplete}
                                                        isEditing={editingTaskId === task.id}
                                                        autoFocus={editingTaskId === task.id}
                                                        onClick={() => toggleTask(task.id)}
                                                        onContentClick={() => handleTaskEdit(task.id, task.content)}
                                                        onChange={setEditingTaskContent}
                                                        onSubmit={handleTaskEditSubmit}
                                                    />
                                                ))}
                                                {isAddingTask && (
                                                    <TaskItem
                                                        content={newTaskContent}
                                                        isEditing
                                                        autoFocus={tasks.length > 0}
                                                        isPlaceholder={tasks.length === 0 && !newTaskContent}
                                                        onChange={setNewTaskContent}
                                                        onSubmit={handleTaskSubmit}
                                                    />
                                                )}
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
                                <div className='bg-neutral-50 border border-neutral-100 rounded-[6px] min-h-[206px] px-3.5 py-2'>
                                    {feedbacks.map((feedback) => (
                                        <FeedbackItem
                                            key={feedback.id}
                                            partName={feedback.partName}
                                            authorName={feedback.authorName}
                                            content={editingFeedbackId === feedback.id ? editingFeedbackContent : feedback.content}
                                            timestamp={feedback.timestamp}
                                            state={feedback.state}
                                            isEditing={editingFeedbackId === feedback.id}
                                            autoFocus={editingFeedbackId === feedback.id}
                                            onClick={() => toggleFeedback(feedback.id)}
                                            onContentClick={() => handleFeedbackEdit(feedback.id, feedback.content)}
                                            onChange={setEditingFeedbackContent}
                                            onSubmit={handleFeedbackEditSubmit}
                                        />
                                    ))}
                                    {isAddingFeedback && (
                                        <FeedbackItem
                                            partName='파트 소속'
                                            authorName='작성자 이름'
                                            content={newFeedbackContent}
                                            timestamp={formatTimestamp()}
                                            isEditing
                                            autoFocus={feedbacks.length > 0}
                                            onChange={setNewFeedbackContent}
                                            onSubmit={handleFeedbackSubmit}
                                        />
                                    )}
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
                                        className='flex gap-0.5 items-center px-1.5 pr-2.5 py-0.5 bg-neutral-50/20 border border-neutral-200 rounded-[6px] shadow-inner-neutral-2'
                                        onClick={onFileUploadClick}
                                    >
                                        <PlusIcon className='w-4 h-4 stroke-neutral-400' />
                                        <span className='body-3 font-medium text-neutral-400 tracking-[-0.26px]'>추가</span>
                                    </button>
                                </div>

                                {/* Content */}
                                <div className='bg-neutral-50 border border-neutral-100 rounded-[6px] min-h-[206px]' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MissionModal
