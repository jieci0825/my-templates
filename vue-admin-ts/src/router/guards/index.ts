import type { Router } from 'vue-router'
import { setupPermissionGuard } from './permission'
// #scaffold-start:nprogress
import { setupProgressGuard } from './progress'
// #scaffold-end:nprogress
// #scaffold-start:tabs
import { setupTabsGuard } from './tabs'
// #scaffold-end:tabs

/**
 * 设置路由守卫
 */
export function setupRouterGuards(router: Router) {
    // #scaffold-start:nprogress
    // 进度条守卫
    setupProgressGuard(router)
    // #scaffold-end:nprogress
    // 权限守卫
    setupPermissionGuard(router)
    // #scaffold-start:tabs
    // 标签页守卫
    setupTabsGuard(router)
    // #scaffold-end:tabs
}
