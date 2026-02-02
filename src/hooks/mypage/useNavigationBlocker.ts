import { useEffect, useCallback } from 'react'
import { useBlocker } from 'react-router'

interface UseNavigationBlockerOptions {
	isDirty: boolean
	onSave?: () => Promise<boolean> | boolean // 저장 함수 (성공 시 true 반환)
}

interface UseNavigationBlockerReturn {
	isBlocked: boolean
	handleLeaveWithoutSaving: () => void
	handleSaveAndLeave: () => void
	handleCloseModal: () => void
}

/**
 * 페이지 이탈 감지 및 경고 모달을 위한 커스텀 훅
 * - 내부 이동 감지 (뒤로가기, 링크 클릭 등)
 * - 브라우저 닫기/새로고침 감지
 */
export const useNavigationBlocker = ({ isDirty, onSave }: UseNavigationBlockerOptions): UseNavigationBlockerReturn => {
	// 브라우저 닫기/새로고침 감지
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (isDirty) {
				e.preventDefault()
				e.returnValue = ''
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [isDirty])

	// 내부 이동 감지 (뒤로가기, 링크 클릭 등)
	const blocker = useBlocker(
		({ currentLocation, nextLocation }) => isDirty && currentLocation.pathname !== nextLocation.pathname
	)

	// 저장하지 않고 나가기
	const handleLeaveWithoutSaving = useCallback(() => {
		if (blocker.state === 'blocked') {
			blocker.proceed()
		}
	}, [blocker])

	// 저장 후 나가기
	const handleSaveAndLeave = useCallback(async () => {
		if (onSave) {
			const success = await onSave()
			if (blocker.state === 'blocked') {
				if (success) {
					blocker.proceed() // 저장 성공 → 페이지 이동
				} else {
					blocker.reset() // 저장 실패 → 모달 닫고 현재 페이지 유지
				}
			}
		} else if (blocker.state === 'blocked') {
			blocker.proceed()
		}
	}, [blocker, onSave])

	// 모달 닫기 (이동 취소)
	const handleCloseModal = useCallback(() => {
		if (blocker.state === 'blocked') {
			blocker.reset()
		}
	}, [blocker])

	return {
		isBlocked: blocker.state === 'blocked',
		handleLeaveWithoutSaving,
		handleSaveAndLeave,
		handleCloseModal,
	}
}
