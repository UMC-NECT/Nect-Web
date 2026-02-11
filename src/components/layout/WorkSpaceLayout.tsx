import { Outlet } from "react-router"
import WorkspaceHeader from "../header/WorkspaceHeader"
import { Sidebar } from "./sidebar/Sidebar"
import { useMissionModalStore } from "@/stores/mission-modal/missionModalStore"
import MissionModal from "@/components/mission-modal/MissionModal"

const WorkspaceLayout = () => {
	const { isMissionModalOpen, closeMissionModal, editingSectionIndex } = useMissionModalStore()
	// sectionIndex가 0이면 리더형 모달
	const modalVariant = editingSectionIndex === 0 ? 'leader' : 'default'

	return (
		<>
            <WorkspaceHeader />
			<Sidebar />
			<div className='w-full max-w-main mx-auto px-[72px] mt-16'>
				<Outlet />
			</div>

				{/* Mission Modal */}
				{isMissionModalOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50' onClick={closeMissionModal}>
					<div onClick={e => e.stopPropagation()}>
						<MissionModal variant={modalVariant} />
					</div>
				</div>
			)}
		</>
	)
}

export default WorkspaceLayout