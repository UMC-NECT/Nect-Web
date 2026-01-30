export interface CommonResponse<T> {
    status: {
        statusCode: string
        message: string
        description: boolean
    },
    body: T
}