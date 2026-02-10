import { useState, useRef, useEffect } from 'react'
import CheckIcon from '@/assets/icons/team-board/check.svg?react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { formatDateInput, formatTimeInput } from '@/utils/dateUtils'

interface AddScheduleModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (title: string, startDate: string, endDate: string, time: string) => void
	// 수정 모드용 props
	initialTitle?: string
	initialStartDate?: string // ISO 형식: "2026-02-01T10:00:00"
	initialEndDate?: string // ISO 형식: "2026-02-01T11:00:00"
	initialAllDay?: boolean
}

/**
 * ISO 날짜를 "2026년 02월 01일" 형식으로 변환
 */
const formatISODateToInput = (isoDate: string): string => {
	const date = new Date(isoDate)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}년 ${month}월 ${day}일`
}

/**
 * ISO 시간을 "15:00 - 17:00" 형식으로 변환
 */
const formatISOTimeToInput = (startAt: string, endAt: string): string => {
	const startDate = new Date(startAt)
	const endDate = new Date(endAt)
	const startHour = String(startDate.getHours()).padStart(2, '0')
	const startMinute = String(startDate.getMinutes()).padStart(2, '0')
	const endHour = String(endDate.getHours()).padStart(2, '0')
	const endMinute = String(endDate.getMinutes()).padStart(2, '0')
	return `${startHour}:${startMinute} - ${endHour}:${endMinute}`
}

const AddScheduleModal = ({ 
	isOpen, 
	onClose, 
	onSave,
	initialTitle,
	initialStartDate,
	initialEndDate,
	initialAllDay,
}: AddScheduleModalProps) => {
	const [title, setTitle] = useState('')
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [time, setTime] = useState('')
	const [previousStartDate, setPreviousStartDate] = useState('')
	const [previousEndDate, setPreviousEndDate] = useState('')
	const [previousTime, setPreviousTime] = useState('')

	// 수정 모드일 때 초기값 설정
	useEffect(() => {
		if (isOpen && initialTitle && initialStartDate && initialEndDate) {
			setTitle(initialTitle)
			setStartDate(formatISODateToInput(initialStartDate))
			setEndDate(formatISODateToInput(initialEndDate))
			if (!initialAllDay) {
				setTime(formatISOTimeToInput(initialStartDate, initialEndDate))
			} else {
				setTime('')
			}
		} else if (isOpen && !initialTitle) {
			// 생성 모드일 때 초기화
			setTitle('')
			setStartDate('')
			setEndDate('')
			setTime('')
		}
	}, [isOpen, initialTitle, initialStartDate, initialEndDate, initialAllDay])

	const modalRef = useRef<HTMLDivElement>(null)
	useClickOutside(modalRef, () => {
		if (isOpen) {
			// 수정 모드가 아닐 때만 초기화
			if (!initialTitle) {
				setTitle('')
				setStartDate('')
				setEndDate('')
				setTime('')
			}
			onClose()
		}
	}, isOpen)

	const handleSave = () => {
		if (!title.trim()) {
			// 제목이 없으면 저장하지 않음
			return
		}
		onSave(title, startDate, endDate, time)
		// 저장 후 폼 초기화 (수정 모드가 아닐 때만)
		if (!initialTitle) {
			setTitle('')
			setStartDate('')
			setEndDate('')
			setTime('')
		}
		onClose()
	}

	if (!isOpen) return null

	return (
		<div className="absolute top-0 left-0 w-[392px] h-[124px] z-50">
			<div
				ref={modalRef}
				className="bg-neutral-000 border border-neutral-100 rounded-12 shadow-drop-neutral-1 flex flex-col gap-2 pb-5 pl-5 pr-[18px] pt-4"
			>
				{/* 헤더: 일정 제목 입력 + 체크 버튼 */}
				<div className="flex gap-2.5 items-center justify-center w-full">
					<div className="flex-1 flex flex-col justify-center min-h-px min-w-px overflow-hidden">
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className={`title-3 font-semibold leading-[1.4] bg-transparent border-none outline-none w-[314px] ${
								title ? 'text-neutral-900' : 'text-neutral-400'
							}`}
							placeholder="일정 제목 *"
						/>
					</div>
					{/* 체크 버튼 */}
					<button
						onClick={handleSave}
						className="w-[30px] h-[30px] rounded-[8px] relative shrink-0 hover:bg-neutral-50 transition-colors duration-200"
					>
						<CheckIcon className="w-[30px] h-[30px]" />
					</button>
				</div>

				{/* 날짜 범위 입력 */}
				<div className="flex gap-1 items-start body-2 font-regular leading-normal">
					<input
						type="text"
						value={startDate}
						onChange={(e) => {
							const formatted = formatDateInput(e.target.value, previousStartDate)
							setPreviousStartDate(startDate)
							setStartDate(formatted)
						}}
						className={`w-[123px] opacity-80 bg-transparent border-none outline-none ${
							startDate ? 'text-neutral-900' : 'text-neutral-400'
						}`}
						placeholder="0000년 00월 00일 *"
					/>
					<span className="opacity-80 text-neutral-400"> ~ </span>
					<input
						type="text"
						value={endDate}
						onChange={(e) => {
							const formatted = formatDateInput(e.target.value, previousEndDate)
							setPreviousEndDate(endDate)
							setEndDate(formatted)
						}}
						className={`opacity-80 bg-transparent border-none outline-none ${
							endDate ? 'text-neutral-900' : 'text-neutral-400'
						}`}
						placeholder="0000년 00월 00일"
					/>
				</div>

				{/* 시간 입력 */}
				<div className="body-2 font-regular leading-normal">
					<input
						type="text"
						value={time}
						onChange={(e) => {
							const formatted = formatTimeInput(e.target.value, previousTime)
							setPreviousTime(time)
							setTime(formatted)
						}}
						className={`opacity-80 bg-transparent border-none outline-none ${
							time ? 'text-neutral-900' : 'text-neutral-400'
						}`}
						placeholder="15:00 - 17:00"
					/>
				</div>
			</div>
		</div>
	)
}

export default AddScheduleModal
