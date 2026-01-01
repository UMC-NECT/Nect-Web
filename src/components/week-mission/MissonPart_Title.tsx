import GoalIcon from '@/assets/icons/week-mission/goal.svg?react'

interface MissonPart_TitleProps {
    title: string
	isGoal?: boolean
}

const MissonPart_Title = ({ title, isGoal }: MissonPart_TitleProps) => {
	return (
		<div className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-4 gap-1 ${isGoal ? 'bg-primary-400-normal' : 'bg-neutral-600'} w-[72px] h-[120px]`}>
			{isGoal && <GoalIcon className='w-[18px] h-[18px]' />}
			<p className='body-2 font-bold text-neutral-000 text-center'>{title}</p>
		</div>
	)
}

export default MissonPart_Title