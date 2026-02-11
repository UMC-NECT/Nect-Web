import { Outlet } from "react-router"
import ExploreHeader from "../header/ExploreHeader"
import { useCTAModal } from "@/stores/useCTAModal"
import CTAModal from "../common/CTAModal"
import Footer from './Footer'

const MyPageLayout = () => {
	const { isOpen: isCTAModalOpen, config: ctaModalConfig } = useCTAModal()
	return (
		<>
			<ExploreHeader />
			<div className='w-full pt-[124px] bg-neutral-50'>
				<Outlet />
				<Footer type='Default' margin='152' />
			</div>

			{/* CTA 모달 */}
			{isCTAModalOpen && ctaModalConfig && (
				<CTAModal
					message={ctaModalConfig.message}
					subMessage={ctaModalConfig.subMessage}
					isMessageHighlight={ctaModalConfig.isMessageHighlight}
					fixedHeight={ctaModalConfig.fixedHeight}
					leftButtonMsg={ctaModalConfig.leftButton?.text}
					rightButtonMsg={ctaModalConfig.rightButton?.text}
					onLeftClick={ctaModalConfig.leftButton?.onClick}
					onRightClick={ctaModalConfig.rightButton?.onClick}
				/>
			)}
		</>
	)
}

export default MyPageLayout