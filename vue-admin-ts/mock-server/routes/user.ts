import Router from '@koa/router'
import { readData } from '../utils/db'
import { isTokenExpired } from '../utils/token'

const router = new Router({ prefix: '/api/user' })

/** 获取当前登录用户信息 */
router.get('/info', async (ctx) => {
    const token = ctx.headers.authorization

    if (!token) {
        ctx.status = 401
        ctx.body = { code: 1001, msg: '未授权，请先登录', data: null }
        return
    }

    const db = readData()
    const user = db.users.find((u) => u.accessToken === token)

    if (!user) {
        ctx.status = 401
        ctx.body = { code: 1002, msg: 'token 无效', data: null }
        return
    }

    if (isTokenExpired(user.accessTokenExpiresAt)) {
        ctx.status = 401
        ctx.body = { code: 1003, msg: 'token 已过期', data: null }
        return
    }

    // 排除敏感字段
    const { password, accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt, ...userInfo } = user

    ctx.body = {
        code: 0,
        msg: '获取成功',
        data: userInfo,
    }
})

export default router
