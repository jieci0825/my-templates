import type { Router } from 'vue-router'
import { useTabStore, useUserStore } from '@/stores'

// 标记是否已初始化固定标签
let affixTabsInitialized = false

/** 设置标签页守卫 */
export function setupTabsGuard(router: Router) {
    router.afterEach((to) => {
        const tabStore = useTabStore()
        const userStore = useUserStore()

        // 初始化固定标签页（只执行一次）
        if (!affixTabsInitialized && userStore.menus.length > 0) {
            tabStore.initAffixTabs(userStore.menus)
            affixTabsInitialized = true
        }

        // 忽略重定向路由
        if (to.name === 'Redirect') {
            return
        }

        // 添加标签页
        tabStore.addTabByRoute(to)
    })
}

/**
 * 重置固定标签页初始化状态
 */
export function resetAffixTabsInitialized() {
    affixTabsInitialized = false
}
