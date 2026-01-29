import FlagIcon from '@/assets/icons/work-status/flag.svg?react'
import GoalIcon from '@/assets/icons/week-mission/goal.svg?react'
import FigmaIcon from '@/assets/icons/app/figma.svg?react'
import PDFIcon from '@/assets/icons/app/pdf.svg?react'

interface HistoryIconProps {
	variant: 'add' | 'share' | 'app'
    app?: string
}

const HistoryIcon = ({ variant, app }: HistoryIconProps) => {
	return (
		<div className='w-10 h-10 bg-neutral-50 rounded-10 py-[7px] px-2 shadow-inner-neutral-2'>
			{
                variant === 'add' && (
                    <GoalIcon className='w-6 h-6 stroke-neutral-600' />
                ) || (
                variant === 'share' && (
                    <FlagIcon className='w-6 h-6 stroke-neutral-600' />
                )) || (
                variant === 'app' && (
                    app === 'figma' && (
                        <FigmaIcon className='w-6 h-6' />
                    ) || app === 'pdf' && (
                        <PDFIcon className='w-6 h-6' />
                    ) || (
                        ''
                    )
                ))
            }
		</div>
	)
}

export default HistoryIcon