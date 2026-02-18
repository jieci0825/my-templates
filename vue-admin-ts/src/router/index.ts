import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'
import { routes } from './routes'
import { printRoutes } from './utils'

// 在开发环境下打印路由信息
if (import.meta.env.DEV) {
    printRoutes()
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

// 设置路由守卫
setupRouterGuards(router)

export default router

// 导出公共 API
export { resetRoutesRegistered, markRoutesRegistered } from './guards/permission'
// #scaffold-start:tabs
export { resetAffixTabsInitialized } from './guards/tabs'
// #scaffold-end:tabs
export { registerDynamicRoutes, removeDynamicRoutes } from './utils'
