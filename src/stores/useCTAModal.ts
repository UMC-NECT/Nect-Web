import { create } from 'zustand'

type CTAModalType =
	// 저장
	| 'save'
	| 'unsavedChanges'

	// 삭제
	| 'delete'
	| 'deleteComplete'

	// (내 프로필 설정) 공개/비공개 매칭 등록
	| 'openMatchingRegister'
	| 'openMatchingRegisterComplete'
	| 'privateMatching'
	| 'privateMatchingComplete'

	// (내 프로필 설정) 프로필 분석 키워드 불러오기
	| 'profileKeywordRefresh'

	// (내 프로필 설정) 이력/경력 불러오기
	| 'careerRefreshSuccess'
	| 'careerRefreshFail'

	// (나의 아이디어 분석) 프로젝트 만들기
	| 'projectRegister'

	// (진행중인 프로젝트) 모집 등록/종료
	| 'recruitmentEnd'
	| 'recruitmentEndComplete'
	| 'recruitmentRegister'
	| 'recruitmentRegisterComplete'
	| null

interface CTAModalConfig {
	message: string
	subMessage?: string
	isMessageHighlight?: boolean
	fixedHeight?: boolean
	leftButton?: { text: string; onClick: () => void }
	rightButton?: { text: string; onClick: () => void }
}

interface CTAModalState {
	modalType: CTAModalType | null
	isOpen: boolean
	config: CTAModalConfig | null
	open: (type: CTAModalType, config?: CTAModalConfig) => void
	close: () => void
}

export const useCTAModal = create<CTAModalState>(set => ({
	modalType: null,
	isOpen: false,
	config: null,
	open: (type, config) => set({ isOpen: true, modalType: type, config: config ?? null }),
	close: () => set({ isOpen: false, modalType: null, config: null }),
}))
