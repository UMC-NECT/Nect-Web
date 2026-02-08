import { useState, useRef } from 'react'
import CheckIcon from '@/assets/icons/team-board/check.svg?react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { formatDateInput, formatTimeInput } from '@/utils/dateUtils'

interface AddScheduleModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (title: string, startDate: string, endDate: string, time: string) => void
}

const AddScheduleModal = ({ isOpen, onClose, onSave }: AddScheduleModalProps) => {
	const [title, setTitle] = useState('')
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [time, setTime] = useState('')
	const [previousStartDate, setPreviousStartDate] = useState('')
	const [previousEndDate, setPreviousEndDate] = useState('')
	const [previousTime, setPreviousTime] = useState('')

	const modalRef = useRef<HTMLDivElement>(null)
	useClickOutside(modalRef, () => {
		if (isOpen) {
            setTitle('')
            setStartDate('')
            setEndDate('')
            setTime('')
			onClose()
		}
	}, isOpen)

	const handleSave = () => {
		if (!title.trim()) {
			// 제목이 없으면 저장하지 않음
			return
		}
		onSave(title, startDate, endDate, time)
		// 저장 후 폼 초기화
		setTitle('')
		setStartDate('')
		setEndDate('')
		setTime('')
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
