<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MenuRecursive from './menu-recursive.vue'
import type { MenuItem } from '@/types/menu'

interface Props {
    /** 菜单数据 */
    menuData: MenuItem[]
    /** 菜单模式 vertical / horizontal */
    mode?: 'vertical' | 'horizontal'
    /** 背景色 */
    backgroundColor?: string
    /** 文字颜色 */
    textColor?: string
    /** 激活菜单的文字颜色 */
    activeTextColor?: string
    /** 默认激活的菜单 */
    defaultActive?: string
    /** 是否只保持一个子菜单展开 */
    uniqueOpened?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'vertical',
    uniqueOpened: false,
})

const router = useRouter()
const route = useRoute()

// 当前激活的菜单
const activeMenu = ref<string>(props.defaultActive || route.path)

// 监听路由变化，更新激活菜单
watch(
    () => route.path,
    (newPath) => {
        activeMenu.value = newPath
    },
)

// 过滤隐藏的菜单项
const visibleMenuData = computed(() => props.menuData.filter((item) => !item.hidden))

/**
 * 根据菜单项查找完整的菜单信息
 */
const findMenuByPath = (path: string, menus: MenuItem[] = props.menuData): MenuItem | null => {
    for (const menu of menus) {
        if (menu.path === path) {
            return menu
        }
        if (menu.children && menu.children.length > 0) {
            const found = findMenuByPath(path, menu.children)
            if (found) return found
        }
    }
    return null
}

/**
 * 自定义菜单跳转函数
 * 支持内部路由跳转、外链跳转等多种方式
 */
const handleMenuNavigate = (path: string, menuItem?: MenuItem | null) => {
    // 如果没有传入 menuItem，尝试查找
    const item = menuItem || findMenuByPath(path)

    // 更新激活菜单
    activeMenu.value = path

    // 外链跳转（以 http:// 或 https:// 开头）
    if (path.startsWith('http://') || path.startsWith('https://')) {
        window.open(path, '_blank')
        return
    }

    // 内部路由跳转
    if (path.startsWith('/')) {
        // 检查是否需要在新窗口打开（可以通过菜单项的 meta.openInNewWindow 控制）
        const openInNewWindow = item?.meta?.openInNewWindow

        if (openInNewWindow) {
            const routeData = router.resolve({ path })
            window.open(routeData.href, '_blank')
        } else {
            router.push(path)
        }
        return
    }

    // 其他情况，可以根据需要扩展
    console.warn(`未知的菜单路径类型: ${path}`)
}

// 菜单选择事件
const handleSelect = (index: string) => {
    const menuItem = findMenuByPath(index)
    handleMenuNavigate(index, menuItem)
}

// 导出跳转函数，供外部使用
defineExpose({
    handleMenuNavigate,
})
</script>

<template>
    <el-menu
        :default-active="activeMenu"
        :mode="mode"
        :unique-opened="uniqueOpened"
        :router="false"
        @select="handleSelect"
    >
        <MenuRecursive
            v-for="item in visibleMenuData"
            :key="item.id"
            :item="item"
        />
    </el-menu>
</template>

<style scoped lang="scss">
.el-menu {
    border-right: none;
}
</style>
