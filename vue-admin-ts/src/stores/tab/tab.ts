import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useRoute, useRouter, type RouteLocationNormalized } from 'vue-router'
import { STORAGE_KEY } from '@/constants'
import { getStorage, setStorage } from '@/utils'
import type { TabItem } from './type'

export const useTabStore = defineStore('tab', () => {
    const router = useRouter()
    const route = useRoute()

    // 获取本地的标签页列表
    const savedTabs = getStorage<TabItem[]>(STORAGE_KEY.TABS)

    // 标签页列表
    const tabList = ref<TabItem[]>(savedTabs || [])

    /** 当前激活的标签页路径 */
    const activeTabPath = computed(() => route.path)

    /** 添加标签页 */
    const addTab = (tab: TabItem) => {
        // 检查是否已存在
        const existIndex = tabList.value.findIndex((item) => item.path === tab.path)
        if (existIndex === -1) {
            tabList.value.push(tab)
        }
    }

    /** 根据路由添加标签页 */
    const addTabByRoute = (routeInfo: RouteLocationNormalized) => {
        const { path, meta, query, name } = routeInfo
        const ignorePaths = ['/login', '/404']
        if (ignorePaths.includes(path)) {
            return
        }
        const tab: TabItem = {
            path,
            title: (meta?.title as string) || (name as string) || path,
            icon: meta?.icon as string,
            isAffix: !!meta?.isAffix,
            name: name as string,
            query: { ...query },
        }
        addTab(tab)
    }

    /** 初始化固定标签页 */
    const initAffixTabs = (
        menus: Array<{ path?: string | null; title: string; icon?: string | null; isAffix?: number }>,
    ) => {
        // 过滤出固定的菜单
        const affixMenus = menus.filter((menu) => menu.isAffix === 1 && menu.path)
        affixMenus.forEach((menu) => {
            const tab: TabItem = {
                path: menu.path!,
                title: menu.title,
                icon: menu.icon,
                isAffix: true,
            }
            // 检查是否已存在
            const existTab = tabList.value.find((item) => item.path === tab.path)
            if (!existTab) {
                // 固定标签添加到最前面
                tabList.value.unshift(tab)
            } else {
                // 更新为固定状态
                existTab.isAffix = true
            }
        })
    }

    /** 关闭标签页 */
    const closeTab = (path: string) => {
        const index = tabList.value.findIndex((item) => item.path === path)
        if (index === -1) return

        const tab = tabList.value[index]
        // 固定标签不可关闭
        if (tab?.isAffix) return

        tabList.value.splice(index, 1)

        // 如果关闭的是当前页，跳转到最后一个标签
        if (path === route.path) {
            const lastTab = tabList.value[tabList.value.length - 1]
            if (lastTab) {
                router.push(lastTab.path)
            } else {
                router.push('/')
            }
        }
    }

    /** 关闭左侧标签页 */
    const closeLeftTabs = (path: string) => {
        const index = tabList.value.findIndex((item) => item.path === path)
        if (index <= 0) return

        // 保留固定标签和当前及右侧标签
        tabList.value = tabList.value.filter((item, i) => item.isAffix || i >= index)

        // 如果当前路由不在标签列表中，跳转到目标标签
        if (!tabList.value.find((item) => item.path === route.path)) {
            router.push(path)
        }
    }

    /** 关闭右侧标签页 */
    const closeRightTabs = (path: string) => {
        const index = tabList.value.findIndex((item) => item.path === path)
        if (index === -1 || index === tabList.value.length - 1) return

        // 保留固定标签和当前及左侧标签
        tabList.value = tabList.value.filter((item, i) => item.isAffix || i <= index)

        // 如果当前路由不在标签列表中，跳转到目标标签
        if (!tabList.value.find((item) => item.path === route.path)) {
            router.push(path)
        }
    }

    /** 关闭其他标签页 */
    const closeOtherTabs = (path: string) => {
        tabList.value = tabList.value.filter((item) => item.isAffix || item.path === path)

        // 如果当前路由不在标签列表中，跳转到目标标签
        if (!tabList.value.find((item) => item.path === route.path)) {
            router.push(path)
        }
    }

    /** 关闭全部标签页 */
    const closeAllTabs = () => {
        // 只保留固定标签
        tabList.value = tabList.value.filter((item) => item.isAffix)

        // 跳转到第一个固定标签或首页
        const firstAffix = tabList.value[0]
        if (firstAffix) {
            router.push(firstAffix.path)
        } else {
            router.push('/')
        }
    }

    /** 切换标签页固定状态 */
    const toggleTabAffix = (path: string) => {
        const tab = tabList.value.find((item) => item.path === path)
        if (tab) {
            tab.isAffix = !tab.isAffix
        }
    }

    /** 刷新标签页 */
    const refreshTab = (path: string) => {
        // 通过替换路由实现刷新
        router.replace({
            path: '/redirect' + path,
        })
    }

    /** 清空标签页（登出时调用） */
    const clearTabs = () => {
        tabList.value = []
    }

    // 监听标签页变化，保存到本地存储
    watch(
        tabList,
        (val) => {
            setStorage(STORAGE_KEY.TABS, val)
        },
        { deep: true },
    )

    return {
        tabList,
        activeTabPath,
        addTab,
        addTabByRoute,
        initAffixTabs,
        closeTab,
        closeLeftTabs,
        closeRightTabs,
        closeOtherTabs,
        closeAllTabs,
        toggleTabAffix,
        refreshTab,
        clearTabs,
    }
})
