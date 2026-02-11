import { getProjectUsers } from '@/api/project-users/projectUsers'
import { LOCAL_STORAGE_KEY, QUERY_KEY } from '@/constants/key'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useQuery } from '@tanstack/react-query'

const useGetProjectUsers = () => {
	const { getItem: getAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
	const accessToken = getAccessToken()

	const { data } = useQuery({
		queryKey: [QUERY_KEY.PROJECT_USERS],
		queryFn: () => getProjectUsers(),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		enabled: !!accessToken,
	})

	return data?.body
}

export default useGetProjectUsers