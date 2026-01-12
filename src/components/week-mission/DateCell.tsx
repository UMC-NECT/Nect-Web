import { memo } from 'react'
import { getDate, isSameDay } from 'date-fns'

interface DateCellProps {
	date: Date
	index: number
}

const DateCell = memo(({ date, index }: DateCellProps) => {
	const day = getDate(date)
	const isSunday = date.getDay() === 0
	const today = isSameDay(date, new Date())
	const isTodayAndSunday = today && isSunday

	return (
		<div key={index} className='h-6 relative shrink-0 w-[80px] flex items-center justify-center mb-2'>
			{today ? (
				<div
					className={`flex items-center justify-center rounded-[12px] w-6 h-6 ${
						isTodayAndSunday ? 'bg-semantic-600' : 'bg-primary-400-normal'
					}`}
				>
					<p className='font-medium text-[13px] leading-gutter text-center text-white'>{day}</p>
				</div>
			) : (
				<p
					className={`font-medium text-[13px] leading-gutter text-center ${
						isSunday ? 'text-[#fc3333]' : 'text-[#333]'
					}`}
				>
					{day}
				</p>
			)}
		</div>
	)
})

DateCell.displayName = 'DateCell'

export default DateCell
