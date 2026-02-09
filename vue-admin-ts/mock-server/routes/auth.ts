import Router from '@koa/router'
import { readData, writeData } from '../utils/db'
import { generateAccessToken, generateRefreshToken, isTokenExpired } from '../utils/token'

const router = new Router({ prefix: '/api/auth' })

/** 用户登录 */
router.post('/login', async (ctx) => {
    const { username, password } = ctx.request.body as {
        username?: string
        password?: string
    }

    if (!username || !password) {
        ctx.status = 400
        ctx.body = { code: 3000, msg: '用户名和密码不能为空', data: null }
        return
    }

    const db = readData()
    const user = db.users.find((u) => u.username === username)

    if (!user || user.password !== password) {
        ctx.status = 401
        ctx.body = { code: 1004, msg: '用户名或密码错误', data: null }
        return
    }

    const accessTokenData = generateAccessToken(user.username)
    const refreshTokenData = generateRefreshToken(user.username)

    user.accessToken = accessTokenData.token
    user.accessTokenExpiresAt = accessTokenData.expiresAt
    user.refreshToken = refreshTokenData.token
    user.refreshTokenExpiresAt = refreshTokenData.expiresAt
    writeData(db)

    ctx.body = {
        code: 0,
        msg: '登录成功',
        data: {
            accessToken: accessTokenData.token,
            refreshToken: refreshTokenData.token,
        },
    }
})

/** 刷新 token */
router.post('/refresh', async (ctx) => {
    const { refreshToken } = ctx.request.body as { refreshToken?: string }

    if (!refreshToken) {
        ctx.status = 400
        ctx.body = { code: 3001, msg: 'refreshToken 不能为空', data: null }
        return
    }

    const db = readData()
    const user = db.users.find((u) => u.refreshToken === refreshToken)

    if (!user) {
        ctx.status = 401
        ctx.body = { code: 1005, msg: 'refreshToken 无效', data: null }
        return
    }

    if (isTokenExpired(user.refreshTokenExpiresAt)) {
        ctx.status = 401
        ctx.body = { code: 1006, msg: 'refreshToken 已过期', data: null }
        return
    }

    const accessTokenData = generateAccessToken(user.username)
    const refreshTokenData = generateRefreshToken(user.username)

    user.accessToken = accessTokenData.token
    user.accessTokenExpiresAt = accessTokenData.expiresAt
    user.refreshToken = refreshTokenData.token
    user.refreshTokenExpiresAt = refreshTokenData.expiresAt
    writeData(db)

    ctx.body = {
        code: 0,
        msg: 'token 刷新成功',
        data: {
            accessToken: accessTokenData.token,
            refreshToken: refreshTokenData.token,
        },
    }
})

export default router
