import { useState, useEffect } from 'react'

/**
 * 매칭 타이머를 관리하는 커스텀 훅
 * @returns currentTime - 1초마다 업데이트되는 현재 시간
 * @returns initialTime - 컴포넌트 마운트 시점의 고정 시간
 */
export const useMatchingTimer = () => {
	const [currentTime, setCurrentTime] = useState(Date.now())
	const [initialTime] = useState(Date.now()) // 초기 로드 시점의 시간 (PENDING이 아닌 상태용)

	// 1초마다 현재 시간 업데이트 (타이머 실시간 업데이트용 - PENDING 상태만)
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(Date.now())
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	return { currentTime, initialTime }
}
