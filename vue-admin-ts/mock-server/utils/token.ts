import { randomBytes } from 'node:crypto'

export const ACCESS_TOKEN_EXPIRES = 60 * 60 * 1000 // 1 小时
export const REFRESH_TOKEN_EXPIRES = 30 * 24 * 60 * 60 * 1000 // 30 天

export interface TokenPayload {
    token: string
    expiresAt: number
}

/**
 * 生成访问令牌
 */
export function generateAccessToken(username: string): TokenPayload {
    const token = `${username}-access-${randomBytes(16).toString('hex')}`
    const expiresAt = Date.now() + ACCESS_TOKEN_EXPIRES
    return { token, expiresAt }
}

/**
 * 生成刷新令牌
 */
export function generateRefreshToken(username: string): TokenPayload {
    const token = `${username}-refresh-${randomBytes(16).toString('hex')}`
    const expiresAt = Date.now() + REFRESH_TOKEN_EXPIRES
    return { token, expiresAt }
}

/**
 * 验证令牌是否过期
 */
export function isTokenExpired(expiresAt: number): boolean {
    return Date.now() > expiresAt
}
