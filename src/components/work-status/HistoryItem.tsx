import HistoryIcon from './HistoryIcon'

interface HistoryItemProps {
	team: string
	user: string
	action: string
	time: string
	iconVariant: 'add' | 'share' | 'app'
	app?: string
}

const HistoryItem = ({ team, user, action, time, iconVariant, app }: HistoryItemProps) => {
	return (
		<div className='flex gap-[14px] items-start relative shrink-0 w-[207px]'>
			<HistoryIcon variant={iconVariant} app={app} />
			<div className='flex flex-col gap-[6px] items-start leading-0 relative shrink-0 w-[153px]'>
				<div className='flex flex-col gap-[4px] items-start relative shrink-0 w-full'>
					<div className='flex font-medium gap-[6px] items-center not-italic relative shrink-0'>
						<p className='body-1 text-primary-500-normal relative shrink-0'>{team}</p>
						<p className='body-3 text-neutral-900 relative shrink-0'>{user}님이</p>
					</div>
					<p className='body-2 text-neutral-900 font-medium relative shrink-0 w-full'>{action}</p>
				</div>
				<p className='caption-1 text-neutral-400 font-normal relative shrink-0 w-full'>{time}</p>
			</div>
		</div>
	)
}

export default HistoryItem
