import { useUserStore } from '@/stores'
import type { RouteLocationNormalized, Router } from 'vue-router'
import { registerDynamicRoutes } from '@/router/utils'

// 白名单路由
const WHITE_LIST = ['/login']
// 元数据里面表示是否是白名单的标记字段
const WHITE_KEY = 'isWhiteList'
// 动态路由是否已注册的标记
let isRoutesRegistered = false

/**
 * 是否是白名单路由
 */
function isWhiteRoute(to: RouteLocationNormalized): boolean {
    if (WHITE_LIST.includes(to.path)) {
        return true
    }

    const isWhite = to.meta[WHITE_KEY] as boolean
    if (!!isWhite) {
        return true
    }

    return false
}

export function setupPermissionGuard(router: Router) {
    router.beforeEach(async (to, _, next) => {
        const userStore = useUserStore()

        // 1. 白名单路由处理
        if (isWhiteRoute(to)) {
            // 已登录用户访问登录页，直接跳转到首页
            if (to.path === '/login' && userStore.isLoggedIn) {
                next({ path: '/dashboard' })
                return
            }
            next()
            return
        }

        // 2. 未登录，跳转到登录页
        if (!userStore.isLoggedIn) {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath,
                },
            })
            return
        }

        // 3. 已登录且动态路由已注册，直接放行
        if (isRoutesRegistered) {
            next()
            return
        }

        // 4. 已登录但动态路由未注册
        // 如果菜单数据为空（如页面刷新后缓存丢失），重新请求用户信息
        if (userStore.menus.length === 0) {
            try {
                await userStore.getUserInfo()
            } catch {
                userStore.logout(to.fullPath)
                next(false)
                return
            }
        }

        // 5. 注册动态路由并重新导航
        isRoutesRegistered = true
        registerDynamicRoutes(userStore.menus)
        next({ ...to, replace: true })
    })
}

/**
 * 标记动态路由已注册
 */
export function markRoutesRegistered() {
    isRoutesRegistered = true
}

/**
 * 重置路由注册状态
 */
export function resetRoutesRegistered() {
    isRoutesRegistered = false
}
