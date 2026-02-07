import { getProjectUsers } from "@/api/project-users/projectUsers"
import { QUERY_KEY } from "@/constants/key"
import { useQuery } from "@tanstack/react-query"

const useGetProjectUsers = () => {
    const { data } = useQuery({
        queryKey: [QUERY_KEY.PROJECT_USERS],
        queryFn: () => getProjectUsers(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    })

    return data?.body
}

export default useGetProjectUsers