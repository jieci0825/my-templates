<script setup lang="ts">
import LayoutVertical from './components/layout-vertical/index.vue'
import LayoutHorizontal from './components/layout-horizontal/index.vue'
// #scaffold-start:settingsDrawer
import SettingsDrawer from './components/settings-drawer/index.vue'
// #scaffold-end:settingsDrawer
// #scaffold-start:watermark
import GlobalWatermark from '@/components/global-watermark/index.vue'
// #scaffold-end:watermark
// #scaffold-start:lockScreen
import LockScreen from '@/components/lock-screen/index.vue'
// #scaffold-end:lockScreen
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
        <!-- #scaffold-start:settingsDrawer -->
        <SettingsDrawer />
        <!-- #scaffold-end:settingsDrawer -->
        <!-- #scaffold-start:watermark -->
        <GlobalWatermark />
        <!-- #scaffold-end:watermark -->
        <!-- #scaffold-start:lockScreen -->
        <LockScreen />
        <!-- #scaffold-end:lockScreen -->
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
