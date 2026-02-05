import { useTeamMembersStore } from '@/stores/useTeamMembersStore'
import HistoryCard from '../HistoryCard'
import { MyPageHeader } from '../MyPageHeader'

const AllProjects = () => {
	const { teamMembersHistory } = useTeamMembersStore()

	return (
		<div className='min-h-50 flex flex-col'>
			<MyPageHeader />

			<div className='flex gap-4 bg-neutral-000 border border-neutral-200 rounded-12 p-11.5'>
				{teamMembersHistory.map(history => (
					<HistoryCard title={history.title} description={history.description} period={history.period} />
				))}
			</div>
		</div>
	)
}

export default AllProjects
