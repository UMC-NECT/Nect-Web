import { useQuery } from '@tanstack/react-query'
import { getFields } from '@/api/enums'
import { QUERY_KEY } from '@/constants/key'

/** getFields API로 직종 목록 조회. value → label 맵 반환 (enum 비교/라벨 표시용) */
export const useFieldsQuery = () => {
	const { data, ...rest } = useQuery({
		queryKey: QUERY_KEY.enums.fields(),
		queryFn: () => getFields(),
		staleTime: 1000 * 60 * 60,
	})
	const fieldLabelMap: Record<string, string> = (data?.body ?? []).reduce(
		(acc, item) => {
			acc[item.value] = item.label
			return acc
		},
		{} as Record<string, string>
	)
	return { data, fieldLabelMap, ...rest }
}
