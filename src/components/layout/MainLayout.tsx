import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { useWorkspace } from '@/stores/useWorkspace'
import CTAModal from '@/components/common/CTAModal'
import { useCTAModal } from '@/stores/useCTAModal'
import { OnboardingGuard } from './OnboardingGuard'
import ExploreHeader from '../header/ExploreHeader'
import Footer from './Footer'

export const MainLayout = () => {
	const { isWorkspace } = useWorkspace()

	const { isOpen: isCTAModalOpen, config: ctaModalConfig } = useCTAModal()
	const location = useLocation()
	const isMyPage = location.pathname.startsWith('/mypage')

	// 페이지 전환 시 스크롤 최상위로 이동
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location.pathname])

	const getContentClassName = () => {
		// 마이 페이지 레이아웃
		if (isMyPage) {
			return 'w-full pt-[124px] bg-neutral-50'
		}

		// 작업실 or 메인 레이아웃
		return `w-full max-w-main mx-auto px-[72px] ${isWorkspace ? 'pt-[66px]' : 'pt-[132px]'}`
	}

	return (
		<OnboardingGuard>
		<>
			<ExploreHeader />
			<div className={getContentClassName()}>
				<Outlet />
			</div>
			<Footer type='Default' margin='196' />

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
		</OnboardingGuard>
	)
}
