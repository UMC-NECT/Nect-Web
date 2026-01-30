export interface CommonResponse<T> {
    status: {
        statusCode: string
        message: string
        description: string | null
    },
    body: T
}