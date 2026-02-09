import type { Context, Next } from 'koa'

/** CORS 跨域中间件 */
export async function cors(ctx: Context, next: Next) {
    const origin = ctx.get('Origin')

    if (origin) {
        ctx.set('Access-Control-Allow-Origin', origin)
        ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
        ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ctx.set('Access-Control-Allow-Credentials', 'true')
        ctx.set('Access-Control-Max-Age', '86400')
    }

    if (ctx.method === 'OPTIONS') {
        ctx.status = 204
        return
    }

    await next()
}
