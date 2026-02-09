import type { RouteRecordRaw } from 'vue-router'
import { staticRoutes } from './static'
import { dynamicRoutes } from './dynamic'

/**
 * 所有路由配置
 * 只包含静态路由，动态路由在登录后根据权限动态注册
 */
export const routes: RouteRecordRaw[] = [...staticRoutes]

/**
 * 导出路由模块
 */
export { staticRoutes, dynamicRoutes }
