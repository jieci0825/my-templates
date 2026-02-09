/**
 * 认证相关接口类型定义
 */

export interface LoginParams {
    username: string
    password: string
}

export interface TokenVO {
    accessToken: string
    refreshToken: string
}

export interface RefreshTokenParams {
    refreshToken: string
}
