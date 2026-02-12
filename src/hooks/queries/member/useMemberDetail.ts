import { useQuery } from '@tanstack/react-query'
import { getMemberDetail } from '@/api/member/detail'

export const useMemberDetail = (userId: number, options?: { enabled?: boolean }) => {
	return useQuery({
		queryKey: ['member', 'detail', userId],
		queryFn: () => getMemberDetail(userId),
		enabled: options?.enabled !== undefined ? options.enabled : !!userId,
	})
}
