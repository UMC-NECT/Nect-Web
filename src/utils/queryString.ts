/** 값이 있는 쿼리 파라미터만 모아서 query string 반환 (빈 문자열이면 생략) */
export const toQueryString = (params: Record<string, string | undefined>): string => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value != null && value !== '') {
            searchParams.set(key, value)
        }
    })
    const query = searchParams.toString()
    return query ? `?${query}` : ''
}
