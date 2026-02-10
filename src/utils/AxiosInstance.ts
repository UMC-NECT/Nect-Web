import { LOCAL_STORAGE_KEY } from '@/constants/key'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import axios, { type InternalAxiosRequestConfig } from 'axios'
import { postRefreshToken } from '@/api/users'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean
}

let refreshPromise: Promise<string> | null = null

export const api = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}`,
})

api.interceptors.request.use(
	config => {
		const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
		const accessToken = getItem()

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}

		return config
	},
	error => {
		return Promise.reject(error)
	}
)

api.interceptors.response.use(
	response => {
		return response
	},
	async error => {
		const originalRequest = error.config as CustomAxiosRequestConfig

		if (error.response && error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true
			const isRefreshRequest = originalRequest.url?.includes('/refresh') ?? false
			if (isRefreshRequest) {
				const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
				const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN)
				removeAccessToken()
				removeRefreshToken()

				// 로그인 페이지 리다이렉트 잠시 주석 처리
				//window.location.href = '/login'
				return Promise.reject(error)
			}

			if (!refreshPromise) {
				refreshPromise = (async () => {
					const { getItem: getRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN)
					const refreshToken = getRefreshToken()
					if (!refreshToken) throw new Error('No refresh token')

					const response = await postRefreshToken({ refreshToken })
					const tokenData = response.body
					if (!tokenData?.accessToken || !tokenData?.refreshToken) throw new Error('Invalid refresh response')

					const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
					const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN)
					setAccessToken(tokenData.accessToken)
					setRefreshToken(tokenData.refreshToken)

					return tokenData.accessToken
				})()
					.catch(err => {
						const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
						const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN)
						removeAccessToken()
						removeRefreshToken()
						throw err
					})
					.finally(() => {
						refreshPromise = null
					})
			}

			return refreshPromise.then(newAccessToken => {
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
				return api.request(originalRequest)
			})
		}

		// 에러 코드별 에러 페이지 리다이렉트 (404, 408, 500, 503)
		const status = error.response?.status
		const redirectErrorCodes = [404, 408, 500, 503] as const
		if (status && redirectErrorCodes.includes(status as (typeof redirectErrorCodes)[number])) {
			window.location.href = `/error/${status}`
		}

		return Promise.reject(error)
	}
)