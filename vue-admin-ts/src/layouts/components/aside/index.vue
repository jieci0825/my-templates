<script setup lang="ts">
import Menu from '../menu/index.vue'
import AppLogo from '@/components/app-logo/index.vue'
import type { MenuItem } from '@/types/menu'

interface Props {
    sidebarCollapsed: boolean
    sidebarWidth: number
    menuTreeList: MenuItem[]
}

defineProps<Props>()

const title = import.meta.env.VITE_TITLE
</script>

<template>
    <el-aside
        :width="(sidebarCollapsed ? 0 : sidebarWidth) + 'px'"
        class="sidebar"
        :class="{ 'sidebar-collapsed': sidebarCollapsed }"
    >
        <div class="logo">
            <AppLogo class="logo-img" />
            <h2>{{ title }}</h2>
        </div>
        <div class="menu">
            <Menu :menu-data="menuTreeList" mode="vertical" />
        </div>
    </el-aside>
</template>

<style scoped lang="scss">
.sidebar {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--el-border-color);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &.sidebar-collapsed {
        border-right: none;
    }

    .logo {
        flex-shrink: 0;
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 0 12px;
        color: var(--el-color-primary);

        .logo-img {
            width: var(--logo-size);
            height: var(--logo-size);
            object-fit: contain;
            flex-shrink: 0;
        }

        h2 {
            margin: 0;
            font-size: var(--logo-font-size);
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .menu {
        flex: 1;
        overflow-y: auto;
        padding: 10px 12px 0 12px;
    }
}
</style>
