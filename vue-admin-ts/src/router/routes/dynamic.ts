import { toPascalCase } from '@/utils'
import type { RouteRecordRaw } from 'vue-router'

interface MetaConfig {
    ignore?: boolean
    title?: string
    [key: string]: any
}

function generateRoute(metaPath: string, metaConfig: MetaConfig): RouteRecordRaw | null {
    if (metaConfig.ignore !== false) {
        return null
    }

    const routePath = metaPath.replace('../../views/', '/').replace('/meta.json', '')
    const name = toPascalCase(routePath.slice(1).replaceAll('/', '-'))
    const componentPath = metaPath.replace('/meta.json', '/index.vue')

    const { ignore, ...metaData } = metaConfig

    return {
        path: routePath,
        name,
        component: () => import(/* @vite-ignore */ componentPath),
        meta: metaData,
    }
}

/**
 * 动态路由配置
 * 扫描 views 目录下所有层级的 meta.json 配置文件，根据配置生成路由
 */
export function generateDynamicRoutes(): RouteRecordRaw[] {
    const metaModules = import.meta.glob<MetaConfig>('../../views/**/meta.json', {
        eager: true,
        import: 'default',
    })

    const routes = Object.keys(metaModules).map((path) => {
        const metaConfig = metaModules[path]
        if (!metaConfig) {
            return null
        }
        return generateRoute(path, metaConfig)
    })

    return routes.filter(Boolean) as RouteRecordRaw[]
}

/**
 * 动态路由列表
 */
export const dynamicRoutes = generateDynamicRoutes()
