<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore, useUserStore } from '@/stores'
import type { MenuVO } from '@/api/types/user'

interface Emits {
    (e: 'toggle-sidebar'): void
}

interface BreadcrumbItem {
    title: string
    path?: string | null
    icon?: string | null
}

const emit = defineEmits<Emits>()
const route = useRoute()
const settingsStore = useSettingsStore()
const userStore = useUserStore()

/**
 * 根据路径在菜单树中查找面包屑路径
 */
const findBreadcrumbPath = (
    menus: MenuVO[],
    targetPath: string,
    path: BreadcrumbItem[] = [],
): BreadcrumbItem[] | null => {
    for (const menu of menus) {
        const currentPath = [...path, { title: menu.title, path: menu.path, icon: menu.icon }]

        if (menu.path === targetPath) {
            return currentPath
        }

        if (menu.children?.length) {
            const result = findBreadcrumbPath(menu.children, targetPath, currentPath)
            if (result) {
                return result
            }
        }
    }
    return null
}

/** 面包屑数据 */
const breadcrumbList = computed<BreadcrumbItem[]>(() => {
    const currentPath = route.path
    const result = findBreadcrumbPath(userStore.menus, currentPath)
    return result || []
})

const handleToggleSidebar = () => {
    emit('toggle-sidebar')
}
</script>

<template>
    <div class="header-left">
        <div class="sidebar-toggle" @click="handleToggleSidebar">
            <icon-carbon-right-panel-close v-if="settingsStore.settingState.sidebarCollapsed" />
            <icon-carbon-right-panel-open v-else />
        </div>

        <!-- 面包屑导航 -->
        <el-breadcrumb
            v-if="settingsStore.settingState.isShowBreadcrumb && breadcrumbList.length"
            class="breadcrumb"
            separator="/"
        >
            <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
                <span class="breadcrumb-item-content">
                    <span>{{ item.title }}</span>
                </span>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<style scoped lang="scss">
$h: 32px;

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;

    .sidebar-toggle {
        width: $h;
        height: $h;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background-color: var(--el-color-primary-light-9);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .breadcrumb {
        :deep(.el-breadcrumb__item) {
            .el-breadcrumb__inner {
                display: inline-flex;
                align-items: center;
                padding: 4px 6px;
                border-radius: 4px;
                font-size: 14px;
                color: var(--el-text-color-secondary);
                transition: all 0.25s ease;

                &:hover {
                    background-color: var(--el-color-primary-light-9);
                    color: var(--el-color-primary);
                }

                .breadcrumb-item-content {
                    display: inline-flex;
                    align-items: center;
                    gap: 3px;
                }
            }

            // 最后一项（当前页）的样式
            &:last-child {
                .el-breadcrumb__inner {
                    color: var(--el-text-color-primary);
                    font-weight: 500;
                }
            }

            // 分隔符样式
            .el-breadcrumb__separator {
                margin: 0 4px;
                color: var(--el-text-color-placeholder);
            }
        }
    }
}
</style>
