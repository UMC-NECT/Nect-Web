import GoalIcon from '@/assets/icons/week-mission/goal.svg?react'
import PlusIcon from '@/assets/icons/week-mission/plus.svg?react'

interface MissonPart_TitleProps {
    title: string
	isGoal?: boolean
}

export const MissonPart_Title = ({ title, isGoal }: MissonPart_TitleProps) => {
	return (
		<div className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-4 gap-1 mt-3 ${isGoal ? 'bg-primary-400-normal' : 'bg-neutral-600'} w-[72px] h-[118px]`}>
			{isGoal && <GoalIcon className='w-[18px] h-[18px]' />}
			<p className='body-2 font-bold text-neutral-000 text-center'>{title}</p>
		</div>
	)
}

export const MissionPart_Add = () => {
	return (
		<div className='flex flex-col items-center justify-center rounded-xl px-2.5 py-4 gap-1 mt-3 bg-neutral-100 w-[72px] h-[118px] hover:bg-neutral-200 cursor-pointer transition-all duration-300'>
			<p className='body-2 font-bold text-neutral-000 text-center'>팀 추가</p>
			<PlusIcon className='w-[18px] h-[18px]' />
		</div>
	)
}