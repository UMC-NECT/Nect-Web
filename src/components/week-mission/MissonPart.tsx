import { useState, useRef, useEffect } from 'react'
import GoalIcon from '@/assets/icons/week-mission/goal.svg?react'
import PlusIcon from '@/assets/icons/week-mission/plus.svg?react'
import { useTeamStore } from '@/stores/teamStore'

interface MissonPart_TitleProps {
    title: string
	isGoal?: boolean
}

export const MissonPart_Title = ({ title, isGoal }: MissonPart_TitleProps) => {
	return (
		<div className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-4 gap-1 mt-3 ${isGoal ? 'bg-primary-400-normal' : 'bg-neutral-600'} w-[72px] h-[118px]`}>
			{isGoal && <GoalIcon className='w-[18px] h-[18px]' stroke='#FBF9FF' />}
			<p className='body-2 font-bold text-neutral-000 text-center'>{title}</p>
		</div>
	)
}

export const MissionPart_Add = () => {
	const [isEditing, setIsEditing] = useState(false)
	const [inputValue, setInputValue] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)
	const { roles, addRole } = useTeamStore()

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
		if (inputValue.trim()) {
			// 새 role ID 생성 (기존 ID 중 최대값 + 1)
			const newId = Math.max(...roles.map(r => r.id), 0) + 1
			addRole({ id: newId, name: inputValue.trim() })
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
					className='w-full bg-transparent text-center body-2 font-bold text-neutral-000 placeholder:text-neutral-300 outline-none'
				/>
				<button
					type='button'
					onClick={handleSubmit}
					className='cursor-pointer hover:opacity-70 transition-opacity'
				>
					<PlusIcon className='w-[18px] h-[18px] stroke-neutral-000' />
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
			<PlusIcon className='w-[18px] h-[18px] stroke-neutral-000' />
		</div>
	)
}