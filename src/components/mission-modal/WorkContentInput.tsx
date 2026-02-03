import { useState, useRef } from 'react'
import { cn } from '@/utils/cn'
import { useMissionModalStore } from '@/stores/mission-modal/missionModalStore'
import { useTeamStore, type Person } from '@/stores/teamStore'
import TagChipList from './TagChipList'
import getCaretCoordinates from 'textarea-caret'

interface WorkContentInputProps {
	value: string
	onChange: (value: string) => void
	partName?: string
	authorName?: string
	placeholder?: string
	className?: string
}

const WorkContentInput = ({
	value,
	onChange,
	partName = '내 파트',
	authorName = '나',
	placeholder = '미션의 업무 내용을 적어주세요',
	className,
}: WorkContentInputProps) => {
	const [isFocused, setIsFocused] = useState(false)
	const [timestamp, setTimestamp] = useState('')
	const [showMentionList, setShowMentionList] = useState(false)
	const [mentionQuery, setMentionQuery] = useState('')
	const [mentionStartIndex, setMentionStartIndex] = useState(-1)
	const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const textareaContainerRef = useRef<HTMLDivElement>(null)

	const { persons } = useTeamStore()
	const { addMentionedPerson } = useMissionModalStore()

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

	const handleFocus = () => {
		setIsFocused(true)
		if (!timestamp) {
			setTimestamp(formatTimestamp())
		}
	}

	const handleBlur = () => {
		if (!value) {
			setIsFocused(false)
			setTimestamp('')
		}
		// 멘션 리스트는 약간의 딜레이 후 닫기 (클릭 이벤트 처리를 위해)
		setTimeout(() => {
			setShowMentionList(false)
		}, 200)
	}

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value
		const cursorPos = e.target.selectionStart

		onChange(newValue)

		// @ 입력 감지
		const textBeforeCursor = newValue.slice(0, cursorPos)
		const lastAtIndex = textBeforeCursor.lastIndexOf('@')

		if (lastAtIndex !== -1) {
			const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)
			// @ 뒤에 공백이 없으면 멘션 모드
			if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
				// @ 위치 계산
				if (textareaRef.current) {
					const coords = getCaretCoordinates(textareaRef.current, lastAtIndex)
					setMentionPosition({
						top: coords.top + coords.height,
						left: coords.left,
					})
				}
				setShowMentionList(true)
				setMentionQuery(textAfterAt)
				setMentionStartIndex(lastAtIndex)
				return
			}
		}

		setShowMentionList(false)
		setMentionQuery('')
		setMentionStartIndex(-1)
	}

	const handlePersonSelect = (person: Person) => {
		if (mentionStartIndex === -1) return

		const beforeMention = value.slice(0, mentionStartIndex)
		const afterMention = value.slice(mentionStartIndex + 1 + mentionQuery.length)
		const newValue = `${beforeMention}@${person.name} ${afterMention}`

		onChange(newValue)
		addMentionedPerson(person) // store에 멘션된 인원 추가
		setShowMentionList(false)
		setMentionQuery('')
		setMentionStartIndex(-1)

		// 커서를 멘션 뒤로 이동
		setTimeout(() => {
			if (textareaRef.current) {
				const newCursorPos = beforeMention.length + person.name.length + 2
				textareaRef.current.focus()
				textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
			}
		}, 0)
	}

	// 멘션 쿼리와 일치하는 person IDs
	const filteredPersonIds = mentionQuery
		? persons.filter(p => p.name.toLowerCase().includes(mentionQuery.toLowerCase())).map(p => p.id)
		: []

	// 텍스트에서 멘션을 하이라이트하여 렌더링
	const renderHighlightedText = () => {
		if (!value) return null

		const mentionRegex = /@(\S+)/g
		const parts: React.ReactNode[] = []
		let lastIndex = 0
		let match

		while ((match = mentionRegex.exec(value)) !== null) {
			// 멘션 앞의 텍스트
			if (match.index > lastIndex) {
				parts.push(<span key={`text-${lastIndex}`}>{value.slice(lastIndex, match.index)}</span>)
			}

			// 멘션된 이름이 실제 persons에 있는지 확인
			const mentionedName = match[1]
			const isPerson = persons.some(p => p.name === mentionedName)

			parts.push(
				<span key={`mention-${match.index}`} className={isPerson ? 'text-neutral-400' : ''}>
					@{mentionedName}
				</span>
			)

			lastIndex = match.index + match[0].length
		}

		// 남은 텍스트
		if (lastIndex < value.length) {
			parts.push(<span key={`text-${lastIndex}`}>{value.slice(lastIndex)}</span>)
		}

		return parts
	}

	return (
		<div className={cn('bg-neutral-50 border border-neutral-100 rounded-[6px] px-5 py-2 flex flex-col relative', className)}>
			{(isFocused || value) && (
				<div className='flex items-center justify-between mb-1'>
					<div className='flex gap-1.5 items-center'>
						<p className='body-3 font-medium text-neutral-900'>{partName}</p>
						<div className='w-0.5 h-3 bg-neutral-300 rounded-[6px]' />
						<p className='body-3 font-medium text-neutral-900'>{authorName}</p>
					</div>
					<p className='caption-2 text-neutral-400'>{timestamp || formatTimestamp()}</p>
				</div>
			)}

			{/* 하이라이트된 텍스트 오버레이 */}
			<div ref={textareaContainerRef} className='relative flex-1'>
				<div
					className='absolute inset-0 pointer-events-none body-3 font-medium text-neutral-900 whitespace-pre-wrap wrap-break-word overflow-hidden'
					aria-hidden='true'
				>
					{renderHighlightedText()}
				</div>
				<textarea
					ref={textareaRef}
					className='w-full h-full bg-transparent resize-none outline-none body-3 font-medium text-transparent caret-neutral-900 placeholder:text-neutral-300 relative z-10'
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>

				{/* 멘션 드롭다운 - @ 위치에 표시 */}
				{showMentionList && (
					<div
						className='absolute z-50'
						style={{
							top: mentionPosition.top,
							left: mentionPosition.left,
						}}
					>
						<TagChipList
							variant='person'
							title='담당자 선택'
							filterQuery={mentionQuery}
							filteredPersonIds={filteredPersonIds}
							onPersonSelect={person => handlePersonSelect(person)}
							className='w-[200px]'
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default WorkContentInput
