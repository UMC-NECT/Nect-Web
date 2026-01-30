import { Outlet } from 'react-router'
import Header from '../header/Header'
import { Sidebar } from './sidebar/Sidebar'
import { useWorkspace } from '@/stores/useWorkspace'
import { useMissionModalStore } from '@/stores/mission-modal/missionModalStore'
import MissionModal from '@/components/mission-modal/MissionModal'

export const Layout = () => {
	const { isWorkspace } = useWorkspace()
	const { isMissionModalOpen, closeMissionModal } = useMissionModalStore()

	return (
		<>
			<Header />
			{isWorkspace && <Sidebar />}
			<div className={`w-full max-w-main mx-auto px-[72px] ${isWorkspace ? 'pt-[66px]' : 'pt-[132px]'}`}>
				<Outlet />
			</div>

			{/* Mission Modal */}
			{isMissionModalOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50' onClick={closeMissionModal}>
					<div onClick={e => e.stopPropagation()}>
						<MissionModal />
					</div>
				</div>
			)}
		</>
	)
}
