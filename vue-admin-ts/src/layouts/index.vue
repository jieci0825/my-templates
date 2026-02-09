<script setup lang="ts">
import LayoutVertical from './components/layout-vertical/index.vue'
import LayoutHorizontal from './components/layout-horizontal/index.vue'
import SettingsDrawer from './components/settings-drawer/index.vue'
import GlobalWatermark from '@/components/global-watermark/index.vue'
import LockScreen from '@/components/lock-screen/index.vue'
import { useSettingsStore } from '@/stores'
import type { Layout } from '@/stores/setting/type'
import type { Component } from 'vue'

const { settingState } = useSettingsStore()

/** 布局组件映射表，新增布局只需在此注册 */
const layoutComponents: Record<Layout, Component> = {
    vertical: LayoutVertical,
    horizontal: LayoutHorizontal,
}
</script>

<template>
    <div class="layout-container">
        <component :is="layoutComponents[settingState.layout]" />

        <!-- 全局浮层（与布局模式无关） -->
        <SettingsDrawer />
        <GlobalWatermark />
        <LockScreen />
    </div>
</template>

<style scoped lang="scss">
.layout-container {
    height: 100vh;
    overflow: hidden;
    --logo-size: 35px;
    --logo-font-size: 24px;
}
</style>
