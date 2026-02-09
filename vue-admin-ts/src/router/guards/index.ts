import type { Router } from 'vue-router'
import { setupPermissionGuard } from './permission'
import { setupProgressGuard } from './progress'
import { setupTabsGuard } from './tabs'

/**
 * 设置路由守卫
 */
export function setupRouterGuards(router: Router) {
    // 进度条守卫
    setupProgressGuard(router)
    // 权限守卫
    setupPermissionGuard(router)
    // 标签页守卫
    setupTabsGuard(router)
}
