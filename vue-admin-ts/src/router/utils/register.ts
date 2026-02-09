import router from '@/router'
import { dynamicRoutes } from '@/router/routes/dynamic'
import type { MenuVO } from '@/api/types/user'
import type { RouteRecordRaw } from 'vue-router'

// 存储动态路由的移除函数
let removeRouteCallbacks: (() => void)[] = []

/**
 * 扁平化树形菜单结构
 */
function flattenMenus(menus: MenuVO[]): MenuVO[] {
    if (!menus || !Array.isArray(menus)) {
        return []
    }

    const result: MenuVO[] = []

    function traverse(menuList: MenuVO[]) {
        if (!menuList || !Array.isArray(menuList)) {
            return
        }
        menuList.forEach((menu) => {
            result.push(menu)
            if (menu.children && menu.children.length > 0) {
                traverse(menu.children)
            }
        })
    }

    traverse(menus)
    return result
}

/**
 * 注册动态路由
 */
export function registerDynamicRoutes(menus: MenuVO[]) {
    if (!menus || !Array.isArray(menus) || menus.length === 0) {
        console.warn('菜单列表为空，无法注册动态路由')
        return
    }

    const flatMenus = flattenMenus(menus)
    const menuMap = new Map(flatMenus.map((menu) => [menu.name, menu]))

    const routesToAdd = dynamicRoutes
        .filter((route) => menuMap.has(route.name as string))
        .map((route) => {
            const menu = menuMap.get(route.name as string)!
            return {
                ...menu,
                component: route.component,
                meta: {
                    ...route.meta,
                    title: menu.title,
                    icon: menu.icon,
                    isAffix: menu.isAffix === 1,
                    isCache: menu.isCache === 1,
                },
            } as RouteRecordRaw
        })

    routesToAdd.forEach((route) => {
        const removeRoute = router.addRoute('Layout', route)
        removeRouteCallbacks.push(removeRoute)
    })
}

/**
 * 移除所有已注册的动态路由
 */
export function removeDynamicRoutes() {
    removeRouteCallbacks.forEach((fn) => fn())
    removeRouteCallbacks = []
}
