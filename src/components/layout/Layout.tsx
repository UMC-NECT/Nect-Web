import { Outlet, useLocation } from 'react-router'
import Header from '../header/Header'
import { Sidebar } from './sidebar/Sidebar'
import { useWorkspace } from '@/stores/useWorkspace'
import { useMissionModalStore } from '@/stores/mission-modal/missionModalStore'
import MissionModal from '@/components/mission-modal/MissionModal'

export const Layout = () => {
	const { isWorkspace } = useWorkspace()
	const { isMissionModalOpen, closeMissionModal } = useMissionModalStore()
	const location = useLocation()
	const isMyPage = location.pathname.startsWith('/mypage')

	const getContentClassName = () => {
		// 마이 페이지 레이아웃
		if (isMyPage) {
			return 'w-full pt-[124px] bg-neutral-50'
		}

		// 작업실 or 메인 레이아웃
		return `w-full max-w-main mx-auto px-[72px] ${isWorkspace ? 'pt-[66px]' : 'pt-[132px]'}`
	}

	return (
		<>
			<Header />
			{isWorkspace && <Sidebar />}
			<div className={getContentClassName()}>
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
