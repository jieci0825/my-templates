import request from '@/api/request'
import type { LoginParams, TokenVO, RefreshTokenParams } from '@/api/types/auth'

/**
 * 用户登录
 */
export const login = (data: LoginParams) => {
    return request.post<TokenVO>({ url: '/auth/login', data })
}

/**
 * 刷新 token
 */
export const refreshToken = (data: RefreshTokenParams) => {
    return request.post<TokenVO>({ url: '/auth/refresh', data })
}
