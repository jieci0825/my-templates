<script setup lang="ts">
import Aside from '../aside/index.vue'
import Header from '../header/index.vue'
import HeaderBreadcrumb from '../header/header-breadcrumb.vue'
import Tabs from '../tabs/index.vue'
import Main from '../main/index.vue'
import { useSettingsStore, useUserStore } from '@/stores'

const { settingState, setSetting } = useSettingsStore()
const userStore = useUserStore()

const handleToggleSidebar = () => {
    setSetting('sidebarCollapsed', !settingState.sidebarCollapsed)
}

const handleLogout = () => {
    userStore.logout()
}
</script>

<template>
    <el-container class="layout-vertical">
        <!-- 侧边栏 -->
        <Aside
            :sidebar-collapsed="settingState.sidebarCollapsed"
            :sidebar-width="settingState.sidebarWidth"
            :menu-tree-list="userStore.menus"
        />

        <!-- 主内容区 -->
        <el-container class="main-container" direction="vertical">
            <Header @logout="handleLogout">
                <HeaderBreadcrumb @toggle-sidebar="handleToggleSidebar" />
            </Header>

            <Tabs v-if="settingState.isShowTags" />
            <Main />
        </el-container>
    </el-container>
</template>

<style scoped lang="scss">
.layout-vertical {
    height: 100%;

    .main-container {
        flex: 1;
        min-width: 0;
    }
}
</style>
