import { useState, useRef, useEffect } from 'react'
import GoalIcon from '@/assets/icons/week-mission/goal.svg?react'
import PlusIcon from '@/assets/icons/week-mission/plus.svg?react'
import { useTeamStore } from '@/stores/teamStore'
import { usePatchProjectPartMutation, usePostProjectPartMutation } from '@/hooks/project/useProjectApi'
import { cn } from '@/utils/cn'

interface MissonPart_TitleProps {
	title: string
	task?: boolean
	/** CUSTOM인 경우 파트명 수정 시 사용 */
	partId?: number
	roleField?: string | null
	requiredCount?: number
	projectId?: string
}

export const MissonPart_Title = ({ title, task, partId, roleField, requiredCount, projectId }: MissonPart_TitleProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [editValue, setEditValue] = useState(title)
	const inputRef = useRef<HTMLInputElement>(null)
	const patchPartMutation = usePatchProjectPartMutation()
	const isCustom = roleField === 'CUSTOM' && projectId && partId != null

	useEffect(() => {
		if (isEditing && inputRef.current) inputRef.current.focus()
	}, [isEditing])
	useEffect(() => {
		setEditValue(title)
	}, [title])

	const handleSave = () => {
		const trimmed = editValue.trim()
		if (!trimmed || trimmed === title) {
			setIsEditing(false)
			return
		}
		patchPartMutation.mutate(
			{
				projectId: projectId!,
				partId: partId!,
				body: { custom_role_field_name: trimmed, required_count: requiredCount ?? null },
			},
			{
				onSuccess: () => {
					setIsEditing(false)
				},
			}
		)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') handleSave()
		if (e.key === 'Escape') {
			setEditValue(title)
			setIsEditing(false)
		}
	}

	if (isCustom && isEditing) {
		return (
			<div className='flex flex-col items-center justify-center rounded-xl px-2.5 py-4 gap-1 mt-3 bg-neutral-600 w-[72px] h-[118px] border border-neutral-400'>
				<input
					ref={inputRef}
					type='text'
					value={editValue}
					onChange={e => setEditValue(e.target.value)}
					onKeyDown={handleKeyDown}
					onBlur={handleSave}
					className='w-full bg-transparent text-center body-2 font-semibold text-neutral-000 outline-none'
				/>
			</div>
		)
	}

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center rounded-xl px-2.5 py-4 gap-1 mt-3 w-[72px] h-[118px]',
				task ? 'bg-primary-400-normal' : 'bg-neutral-600',
				isCustom && 'cursor-pointer hover:bg-neutral-500 transition-colors'
			)}
			onClick={isCustom ? () => setIsEditing(true) : undefined}
			role={isCustom ? 'button' : undefined}
		>
			{task && <GoalIcon className='w-[18px] h-[18px]' stroke='#FBF9FF' />}
			<p className={cn('body-2 text-neutral-000 text-center w-[66px] line-clamp-2', task ? 'text-white font-bold' : 'text-neutral-000 font-semibold')}>{title}</p>
		</div>
	)
}

interface MissionPart_AddProps {
	projectId?: string
}

export const MissionPart_Add = ({ projectId }: MissionPart_AddProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [inputValue, setInputValue] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)
	const { roles, addRole } = useTeamStore()
	const postPartMutation = usePostProjectPartMutation()

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isEditing])

	const handleClick = () => {
		if (!isEditing) {
			setIsEditing(true)
		}
	}

	const handleSubmit = () => {
		const trimmed = inputValue.trim()
		if (!trimmed) return

		if (projectId) {
			postPartMutation.mutate(
				{
					projectId,
					body: {
						role_field: 'CUSTOM',
						custom_role_field_name: trimmed,
						required_count: 0,
					},
				},
				{
					onSuccess: () => {
						setInputValue('')
						setIsEditing(false)
					},
				}
			)
		} else {
			const newPartId = Math.max(...roles.map(r => r.part_id), 0) + 1
			addRole({
				part_id: newPartId,
				part_label: trimmed,
				role_field: null,
				custom_role_field_name: null,
				required_count: 0,
			})
			setInputValue('')
			setIsEditing(false)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSubmit()
		} else if (e.key === 'Escape') {
			setInputValue('')
			setIsEditing(false)
		}
	}

	const handleBlur = () => {
		// 입력값이 없으면 편집 모드 종료
		if (!inputValue.trim()) {
			setIsEditing(false)
		}
	}

	if (isEditing) {
		return (
			<div className='flex flex-col items-center justify-center rounded-xl px-2.5 py-4 gap-1 mt-3 bg-neutral-300 w-[72px] h-[118px] border border-neutral-400'>
				<input
					ref={inputRef}
					type='text'
					value={inputValue}
					onChange={e => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					onBlur={handleBlur}
					placeholder='팀 이름'
					className='w-full bg-transparent text-center body-2 font-semibold text-neutral-000 placeholder:text-neutral-300 outline-none'
				/>
				<button
					type='button'
					onClick={handleSubmit}
					className='cursor-pointer hover:opacity-70 transition-opacity'
				>
					<PlusIcon className='w-[18px] h-[18px] stroke-neutral-000 ' />
				</button>
			</div>
		)
	}

	return (
		<div
			className='flex flex-col items-center justify-center rounded-xl px-2.5 py-4 gap-1 mt-3 bg-neutral-100 w-[72px] h-[118px] hover:bg-neutral-200 cursor-pointer transition-all duration-300'
			onClick={handleClick}
		>
			<p className='body-2 font-bold text-neutral-000 text-center'>팀 추가</p>
			<PlusIcon className='w-[18px] h-[18px] stroke-neutral-000 ' />
		</div>
	)
}