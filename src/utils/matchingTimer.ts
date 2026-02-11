/**
 * expiresAt으로부터 남은 시간(초) 계산
 * @param expiresAt - 만료 시간 (ISO 8601 형식 문자열)
 * @param currentTime - 현재 시간 (밀리초, 선택적)
 * @returns 남은 시간(초) 또는 undefined
 */
export const calculateRemainingSeconds = (expiresAt?: string, currentTime?: number): number | undefined => {
	if (!expiresAt) return undefined
	const now = currentTime ?? Date.now()
	const expires = new Date(expiresAt).getTime()
	const remaining = Math.floor((expires - now) / 1000)
	return remaining > 0 ? remaining : 0
}
