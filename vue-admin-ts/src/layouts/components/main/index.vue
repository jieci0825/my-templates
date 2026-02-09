<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import { computed } from 'vue'

const settingsStore = useSettingsStore()

/** 当前动画名称 */
const transitionName = computed(() => {
    const transition = settingsStore.settingState.pageTransitionType
    if (transition === 'none') return ''
    return `page-${transition}`
})
</script>

<template>
    <el-main class="main-content">
        <router-view v-slot="{ Component }">
            <transition :name="transitionName" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </el-main>
</template>

<style scoped lang="scss">
.main-content {
    background-color: var(--light-bg);
    overflow: hidden;
}

// 淡入淡出动画
.page-fade-enter-active,
.page-fade-leave-active {
    transition: opacity 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
    opacity: 0;
}

// 左侧滑入动画
.page-slide-left-enter-active,
.page-slide-left-leave-active {
    transition: all 0.3s ease;
}

.page-slide-left-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.page-slide-left-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

// 下方滑入动画
.page-slide-bottom-enter-active,
.page-slide-bottom-leave-active {
    transition: all 0.3s ease;
}

.page-slide-bottom-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

.page-slide-bottom-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}

// 上方滑入动画
.page-slide-top-enter-active,
.page-slide-top-leave-active {
    transition: all 0.3s ease;
}

.page-slide-top-enter-from {
    opacity: 0;
    transform: translateY(-30px);
}

.page-slide-top-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>
