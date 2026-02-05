export interface CommonResponse<T = void> {
    status: {
        statusCode: string
        message: string
        description: string | null
    },
    body?: T
}