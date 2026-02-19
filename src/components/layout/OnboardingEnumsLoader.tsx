import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/key'
import { fetchOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'
import { useOnboardingEnumsStore } from '@/stores/onboardingEnumsStore'

/** 앱 진입 시 한 번만 온보딩 enum API를 요청하고 스토어에 저장. UI 없음. getState()로 setter만 사용해 스토어 구독 안 함 → 무한 리렌더 방지 */
export function OnboardingEnumsLoader() {
	const { data, isLoading, error } = useQuery({
		queryKey: QUERY_KEY.onboardingEnums,
		queryFn: fetchOnboardingEnums,
		staleTime: Infinity,
		gcTime: Infinity,
	})

	useEffect(() => {
		useOnboardingEnumsStore.getState().setLoading(isLoading)
	}, [isLoading])

	useEffect(() => {
		if (data) {
			useOnboardingEnumsStore.getState().setEnums(data)
		}
	}, [data])

	useEffect(() => {
		useOnboardingEnumsStore.getState().setError(
			error ? (error instanceof Error ? error.message : 'enum 목록을 불러오지 못했습니다.') : null
		)
	}, [error])

	return null
}
