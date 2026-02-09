import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { refreshToken as refreshTokenApi } from '@/api/modules/auth'
import { useUserStore } from '@/stores'
import { getStorage } from '@/utils'
import { STORAGE_KEY } from '@/constants'

let isRefreshing = false
let requestsQueue: Array<(token: string) => void> = []

/**
 * 处理 token 过期，尝试刷新 token 并重试请求
 */
export async function handleTokenExpired(error: AxiosError): Promise<InternalAxiosRequestConfig> {
    // 获取原始请求配置
    const config = error.config as InternalAxiosRequestConfig

    if (isRefreshing) {
        // 如果正在刷新 token，则将请求添加到队列中
        //  - 避免短时间触发多次刷新 token 接口
        return new Promise<InternalAxiosRequestConfig>((resolve) => {
            // 做一层回调包装，当刷新token成功之后，执行请求队列时，可以拿到新的 token 并重新发送请求
            requestsQueue.push((token: string) => {
                config.headers.Authorization = token
                resolve(config)
            })
        })
    }

    isRefreshing = true

    try {
        const refreshToken = getStorage<string>(STORAGE_KEY.REFRESH_TOKEN)
        if (!refreshToken) {
            throw new Error('refresh token 不存在')
        }

        const result = await refreshTokenApi({ refreshToken })
        const { setToken } = useUserStore()
        setToken(result.accessToken, result.refreshToken)

        config.headers.Authorization = result.accessToken

        requestsQueue.forEach((callback) => callback(result.accessToken))
        requestsQueue = []

        return config
    } catch (err) {
        // 只要刷新 token 失败，就退出登录
        const { logout } = useUserStore()
        logout()
        throw err
    } finally {
        isRefreshing = false
    }
}
