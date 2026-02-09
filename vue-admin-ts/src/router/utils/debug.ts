/**
 * 路由调试工具
 * 用于在开发环境下查看所有路由配置
 */
import { routes, staticRoutes, dynamicRoutes } from '../routes'

/**
 * 打印路由信息
 */
export function printRoutes() {
    console.groupCollapsed('路由配置信息')

    // ************* 总路由列表 *************
    console.groupCollapsed('📊 总路由列表')
    console.table([
        { 类型: '静态路由', 数量: staticRoutes.length },
        { 类型: '动态路由', 数量: dynamicRoutes.length },
        { 类型: '总路由', 数量: routes.length },
    ])
    console.groupEnd()

    // ************* 静态路由列表 *************
    console.groupCollapsed('🔹 静态路由列表')
    console.table(
        staticRoutes.map((route) => ({
            路径: route.path,
            名称: String(route.name) || '(unnamed)',
            标题: route.meta?.title || '-',
        })),
    )
    console.groupEnd()

    // ************* 动态路由列表 *************
    console.groupCollapsed('🔸 动态路由列表')
    console.table(
        dynamicRoutes.map((route) => ({
            路径: route.path,
            名称: String(route.name) || '(unnamed)',
            标题: route.meta?.title || '-',
        })),
    )
    console.groupEnd()

    console.groupEnd()
}
